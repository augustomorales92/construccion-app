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

      const bodyDate = new Date(date)
      const certificateDate = new Date(latestCertificate.issuedAt)

      const isSameDay = isSameDayFn(bodyDate, certificateDate)

      if (isSameDay) {
        return {
          project,
          message: 'No se requiere nueva versión del certificado',
        }
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

      // Traigo las relaciones CertificateItemProgress del certificado anterior
      const previousCertificateItems =
        await tx.certificateItemProgress.findMany({
          where: { certificateId: latestCertificate.id },
          include: { item: true },
        })

      // creo relaciones CertificateItemProgress para el nuevo certificado
      for (const previousCertificateItem of previousCertificateItems) {
        // Busco actualizacion de algun item
        const updatedItem = updatedItems.find(
          (item) => item.itemId === previousCertificateItem.itemId,
        )

        await tx.certificateItemProgress.create({
          data: {
            certificateId: newCertificate.id,
            itemId: previousCertificateItem.itemId,
            progress: updatedItem
              ? updatedItem.progress
              : previousCertificateItem.progress,
            notes: updatedItem
              ? updatedItem.notes
              : previousCertificateItem.notes,
            photos: updatedItem
              ? updatedItem.photos
              : previousCertificateItem.photos,
          },
        })
      }

      // Funcion para caluclar el progreso de todo
      const progressUpdate = await updateProjectProgress(projectId, tx)

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
