'use server'

import prisma from '@/lib/db'

export async function updateCertificateProgress(certificateId: string) {
  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: { certificateItems: true },
  })

  if (!certificate) {
    throw new Error('Certificado no encontrado')
  }

  let progressSum = 0
  for (const item of certificate.certificateItems) {
    progressSum += item.progress
  }

  const nuevoProgresoCertificado =
  progressSum / certificate.certificateItems.length

  await prisma.certificate.update({
    where: { id: certificateId },
    data: { progressPercent: nuevoProgresoCertificado },
  })

  return nuevoProgresoCertificado
}
