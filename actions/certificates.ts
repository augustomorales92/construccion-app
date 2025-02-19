'use server'

import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function updateCertificateProgress(certificateId: string) {
  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: { certificateItems: true },
  })

  if (!certificate) {
    throw new Error('Certificado no encontrado')
  }

  let progresoTotal = 0
  for (const item of certificate.certificateItems) {
    progresoTotal += item.progress
  }

  const nuevoProgresoCertificado =
    progresoTotal / certificate.certificateItems.length

  await prisma.certificate.update({
    where: { id: certificateId },
    data: { progressPercent: nuevoProgresoCertificado },
  })

  return nuevoProgresoCertificado
}

export async function updateProjectProgress(
  projectId: string,
  certificateId: string,
  updatedItems: { itemId: string; progress: number }[],
  totalItems: number,
  progressTotal: number,
  tx: Prisma.TransactionClient,
) {
  if (totalItems === 0) {
    throw new Error('No hay ítems en el modelo Item')
  }

  // Calcular el progreso del certificado (suma de avances / total de ítems)
  const totalProgress = updatedItems.reduce(
    (sum, item) => sum + item.progress,
    0,
  )
  const progressPercent = (totalProgress / totalItems) * 100

  // Actualizar el certificado con el progreso calculado
  await tx.certificate.update({
    where: { id: certificateId },
    data: { progressPercent },
  })

  // TODO: Calcular el progreso total ponderado basado en el presupuesto

  await tx.project.update({
    where: { id: projectId },
    data: { progressTotal },
  })
}
