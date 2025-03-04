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
            include: {
              certificateItems: true,
            },
          },
          items: true,
        },
      })

      if (!project) {
        throw new Error('Proyecto no encontrado')
      }

      const allCertificates = project.certificates
      // extraigo el ultimo
      const latestCertificate = allCertificates[0]
      console.log('last certi', latestCertificate)
      console.log('all certi', { allCertificates })

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

      for (const updatedItem of updatedItems) {
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

      console.log('id del certificado', certificateId)
      // Añadir la nueva columan en item de progreso general... y ese progress es el que hay que comparara
      // Traigo progreso previo aprobado de cada item
      const itemsWithProgress = await tx.item.findMany({
        where: { projectId },
        select: {
          id: true,
          progressItem: true, 
          price: true,
        },
      })
      // mapeo para acceder al progreso acumulado
      const previousApprovedProgressMap = new Map(
        itemsWithProgress.map(item => [item.id, item.progressItem ?? 0])
      )

      // CALCULOS DE PROGRESOS Y MONTOS
      // Busco con el nuevo certificado los progresos
      const certificateItems = await tx.certificateItemProgress.findMany({
        where: { certificateId },
        include: {
          item: true,
        },
      })
      console.log('certificateItems', certificateItems)

      let certificateAmount = 0

      for (const itemProgress of certificateItems) {
        const previousProgress =
          previousApprovedProgressMap.get(itemProgress.itemId) || 0
        const newProgress = itemProgress.progress

        // Aseguraramos de no cobrar progreso ya aprobado y cobrado
        const progressToCharge = Math.max(newProgress - previousProgress, 0)

        if (progressToCharge > 0) {
          const itemPrice = itemProgress.item.price || 0
          certificateAmount += (progressToCharge / 100) * itemPrice
        }
        await tx.item.update({
          where: { id: itemProgress.itemId },
          data: { progressItem: Math.max(previousProgress, Math.min(newProgress, 100)) }
        })
      }

      console.log('certificateAmount despues de ajuste:', certificateAmount)

      await tx.certificate.update({
        where: { id: certificateId },
        data: { certificateAmount },
      })

      const totalCertifiedAmount =
        allCertificates.reduce(
          (acc, cert) => acc + (cert.certificateAmount || 0),
          0,
        ) + (certificateAmount || 0)
      console.log('totalCertifiedAmount:', totalCertifiedAmount)

      const projectProgress = project.budget
        ? (totalCertifiedAmount/ project.budget) * 100
        : 0

      console.log('progressTotal:', projectProgress)

      await tx.project.update({
        where: { id: projectId },
        data: {
          totalCertifiedAmount,
          progressTotal: projectProgress,
        },
      })

      return { project, certificateId }
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
