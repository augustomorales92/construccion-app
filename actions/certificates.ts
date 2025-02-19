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


export async function updateProjectProgress(projectId: string, tx: any) {
  const project = await tx.project.findUnique({
    where: { id: projectId },
    include: {
      certificates: {
        orderBy: { version: 'desc' },
        take: 1,
        include: {
          certificateItems: true,
        },
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

  let totalProgress = 0
  for (const certificateItem of latestCertificate.certificateItems) {
    totalProgress += certificateItem.progress
  }
  console.log('totalpro', totalProgress)

  const progressPercent =(
    latestCertificate.certificateItems.length > 0
      ? totalProgress / latestCertificate.certificateItems.length
      : 0).toFixed(2)

  console.log('progresspercent', progressPercent)
  const updatedCertificate = await tx.certificate.update({
    where: { id: latestCertificate.id },
    data: {
      progressPercent: progressPercent,
    },
  })

  // Calculo el progreso del proyecto
  const projectProgress = progressPercent

  const updatedProject = await tx.project.update({
    where: { id: projectId },
    data: {
      progressTotal: projectProgress,
    },
  })

  return { updatedCertificate, updatedProject }
}
