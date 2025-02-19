import getUser from '@/actions/auth'
import { updateProjectProgress } from '@/actions/certificates'
import prisma from '@/lib/db'
import { isSameDayFn } from '@/lib/utils'
import { updateProgressSchema } from '@/schemas'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const userAuth = await getUser()
    if (!userAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsedData = updateProgressSchema.safeParse(body)

    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsedData.error.format() },
        { status: 400 },
      )
    }

    // Esto deberia elegir previamtne el usuario , por que ahi eligiria que es lo que queire modificar en el BOT
    const { projectId, updatedItems, date } = parsedData.data

    const updatedProject = await prisma.$transaction(async (tx) => {
      // Traigo el certificado mas reciente del proyecto
      const project = await tx.project.findUnique({
        where: { id: projectId },
        include: {
          certificates: {
            orderBy: { version: 'desc' },
            take: 1,
          },
        },
      })

      if (!project) {
        throw new Error('Proyecto no encontrado')
      }

      const latestCertificate = project.certificates[0]
      if (!latestCertificate) {
        throw new Error('No se encontraron certificados para este proyecto')
      }

      const totalItems = await prisma.item.count()
      const allCertificates = await prisma.certificate.findMany({
        where: { projectId },
        select: { progressPercent: true },
      })

      const bodyDate = new Date(date)
      const certificateDate = new Date(latestCertificate.issuedAt)
      const progressTotal = allCertificates.reduce(
        (sum, cert) => sum + (cert.progressPercent || 0),
        0,
      )

      const isSameDay = isSameDayFn(bodyDate, certificateDate)

      if (isSameDay) {
        // actualizo certificado que ya existe
        for (const updatedItem of updatedItems) {
          await tx.certificateItemProgress.updateMany({
            where: {
              certificateId: latestCertificate.id,
              itemId: updatedItem.itemId,
            },
            data: {
              progress: updatedItem.progress,
              notes: updatedItem.notes,
              photos: updatedItem.photos || [],
            },
          })
        }
        const progressUpdate = await updateProjectProgress(
          projectId,
          latestCertificate.id,
          updatedItems,
          totalItems,
          progressTotal,
          tx,
        )

        return { project, latestCertificate, progressUpdate }
      }

      const newVersion = (latestCertificate.version || 0) + 1

      // Crear el nuevo certificado nueva version
      const newCertificate = await tx.certificate.create({
        data: {
          version: newVersion,
          status: 'PENDING',
          projectId: projectId,
          issuedAt: bodyDate,
        },
      })

      // creo relaciones CertificateItemProgress para el nuevo certificado
      for (const updatedItem of updatedItems) {
        await tx.certificateItemProgress.create({
          data: {
            certificateId: newCertificate.id,
            itemId: updatedItem.itemId,
            progress: updatedItem.progress,
            notes: updatedItem.notes,
            photos: updatedItem.photos || [],
          },
        })
      }
      const progressUpdate = await updateProjectProgress(
        projectId,
        newCertificate.id,
        updatedItems,
        totalItems,
        progressTotal,
        tx,
      )
      return { project, newCertificate, progressUpdate }
    })

    return NextResponse.json(updatedProject, { status: 200 })
  } catch (error) {
    console.error('Error actualizando el progreso del proyecto:', error)
    return NextResponse.json(
      { error: 'Error actualizando el progreso del proyecto' },
      { status: 500 },
    )
  }
}
