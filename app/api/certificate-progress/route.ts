import getUser from '@/actions/auth'
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

      console.log('Projecto encontrado:', project)
      // extraigo el ultimo
      const latestCertificate = project.certificates[0]
      if (!latestCertificate) {
        throw new Error('No se encontraron certificados para este proyecto')
      }

      const bodyDate = new Date(date)
      const certificateDate = new Date(latestCertificate.issuedAt)
      const isSameDay = isSameDayFn(bodyDate, certificateDate)

      let certificateId

      if (isSameDay) {
        console.log('mismo dia certific existent', latestCertificate.id)
        certificateId = latestCertificate.id
      } else {
        console.log('dia distinto creo version')
        const newVersion = (latestCertificate.version || 0) + 1
        const newCertificate = await tx.certificate.create({
          data: {
            version: newVersion,
            status: 'PENDING',
            projectId,
            issuedAt: bodyDate,
          },
        })

        certificateId = newCertificate.id
      }

      console.log('id certificado', certificateId)
      for (const updatedItem of updatedItems) {
        console.log('items para actualizar:', updatedItem.itemId)

        const existingProgress = await tx.certificateItemProgress.findFirst({
          where: {
            certificateId,
            itemId: updatedItem.itemId,
          },
        })

        if (existingProgress) {
          await tx.certificateItemProgress.update({
            where: { id: existingProgress.id },
            data: {
              progress: updatedItem.progress,
              notes: updatedItem.notes,
              photos: updatedItem.photos || [],
            },
          })
        } else {
          await tx.certificateItemProgress.create({
            data: {
              certificateId,
              itemId: updatedItem.itemId,
              progress: updatedItem.progress,
              notes: updatedItem.notes,
              photos: updatedItem.photos || [],
            },
          })
        }
      }

      const certificateItems = await tx.certificateItemProgress.findMany({
        where: { certificateId },
      })
      console.log('certificate items', certificateItems)
      const totalItems = certificateItems.length
      const progressSum = certificateItems.reduce(
        (acc, item) => acc + item.progress,
        0,
      )
      console.log('items totales', totalItems)
      console.log('suma progres', progressSum)
      const progressPercent = totalItems > 0 ? progressSum / totalItems : 0
      console.log('progreco certificado:', progressPercent)
      await tx.certificate.update({
        where: { id: certificateId },
        data: { progressPercent },
      })

      const allCertificates = await tx.certificate.findMany({
        where: { projectId },
        select: { progressPercent: true },
      })

      const projectProgress =
        allCertificates.reduce((acc, cert) => acc + cert.progressPercent, 0) /
        allCertificates.length
      console.log('progreco proyecto:', projectProgress)
      await tx.project.update({
        where: { id: projectId },
        data: { progressTotal: projectProgress },
      })

      return { project, certificateId, progressPercent, projectProgress }
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
