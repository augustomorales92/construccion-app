import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { progress } from 'framer-motion'

type UpdatedItem = {
  itemId: string
  progress: number
  notes?: string | undefined
  photos?: string[] | undefined
}

type Tx = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">

export const calculateSameDayCertificateProgress = async (
  tx: Tx,
  certificateId: string,
  projectId: string,
  budget: number | null,
  updatedItems: UpdatedItem[],
) => {
  for (const updatedItem of updatedItems) {
    const existingProgress = await tx.certificateItemProgress.findFirst({
      where: {
        certificateId,
        itemId: updatedItem.itemId,
      },
    })

    let newItemProgress = 0

    if (existingProgress) {
      await tx.certificateItemProgress.update({
        where: { id: existingProgress.id },
        data: {
          progress: updatedItem.progress,
          notes: updatedItem.notes,
          photos: updatedItem.photos || [],
        },
      })
      newItemProgress = updatedItem.progress - existingProgress.progress
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
      newItemProgress = updatedItem.progress
    }

    const currentItem = await tx.item.findUnique({
      where: { id: updatedItem.itemId },
    })

    await tx.item.update({
      where: { id: updatedItem.itemId },
      data: {
        progressItem: currentItem?.progressItem || 0 + newItemProgress,
      },
    })
  }
  console.log('certificate id mismo dia', certificateId)
  await updateCertificates(tx, projectId, certificateId, budget)
  return certificateId
}

export const calculateNewCertificateProgress = async (
  tx: Tx,
  latestCertificateVersion: number | null,
  projectId: string,
  budget: number | null,
  updatedItems: UpdatedItem[],
  bodyDate: Date,
) => {

  const newVersion = (latestCertificateVersion || 0) + 1
  const newCertificate = await tx.certificate.create({
    data: {
      version: newVersion,
      status: 'PENDING',
      projectId,
      issuedAt: bodyDate,
    },
  })

  const certificateId = newCertificate.id

  for (const updatedItem of updatedItems) {
    await tx.certificateItemProgress.create({
      data: {
        certificateId,
        itemId: updatedItem.itemId,
        progress: updatedItem.progress,
        notes: updatedItem.notes,
        photos: updatedItem.photos || [],
      },
    })
    await tx.item.update({
      where: { id: updatedItem.itemId },
      data: {
        progressItem: updatedItem.progress,
      },
    })
  }
  console.log('certificate id nuevo', certificateId)
  await updateCertificates(tx, projectId, certificateId, budget)
}

const updateCertificates = async (
  tx: any,
  projectId: any,
  certificateId: any,
  budget: any,
) => {
  const certificateItems = await tx.certificateItemProgress.findMany({
    where: { certificateId },
    include: {
      item: {
        select: {
          id: true,
          progressItem: true,
          price: true,
        },
      },
    },
  })
  console.log('certificate items', certificateItems)

  const certificateAmount = certificateItems.reduce(
    (acc: number, item: any) => acc + (item.progress / 100) * item.item.price,
    0,
  )
  console.log('suma de los certiificados monto',certificateAmount)

  await tx.certificate.update({
    where: { id: certificateId },
    data: {
      certificateAmount,
    },
  })

  const certificates = await tx.certificate.findMany({
    where: { projectId },
    select: { certificateAmount: true },
  })

  const totalCertifiedAmount = certificates.reduce(
    (acc: number, certificate: any) => acc + certificate.certificateAmount,
    0,
  )
  console.log('total certificate amount',totalCertifiedAmount)

  const projectProgress = budget ? (totalCertifiedAmount / budget) * 100 : 0

  console.log('progreso total',projectProgress)

  await tx.project.update({
    where: { id: projectId },
    data: {
      totalCertifiedAmount,
      progressTotal: projectProgress,
    },
  })
  return certificateId
}
