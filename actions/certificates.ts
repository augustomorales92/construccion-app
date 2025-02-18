'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import getUser from './auth'

// CREO CERTIFICADOS
export async function createCertificate(
  projectId: string,
  title: string,
): Promise<{ success: boolean; error?: string }> {
  const userAuth = await getUser()

  if (!userAuth) {
    return { success: false, error: 'Unauthorized' }
  }
  try {
    await prisma.certificate.create({
      data: {
        title,
        projectId,
      },
    })
    revalidatePath(`/`)
    return { success: true }
  } catch (error: any) {
    console.error('Error creating certificate:', error)
    return { success: false, error: 'Failed to create certificate' }
  }
}

export async function deleteCertificate(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const certificate = await prisma.certificate.delete({
      where: { id },
    })
    revalidatePath(`/`)
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting certificate:', error)
    return { success: false, error: 'Failed to delete certificate' }
  }
}

// SECCION DE CREAR ITEMS
export async function createItem(
  section: string,
  description: string,
  unit: string,
  quantity: number,
  price: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.item.create({
      data: {
        section,
        description,
        unit,
        quantity,
        price,
      },
    })
    revalidatePath(`/`)
    return { success: true }
  } catch (error: any) {
    console.error('Error creating item:', error)
    return { success: false, error: 'Failed to create item' }
  }
}

export async function deleteItem(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const item = await prisma.item.delete({
      where: { id },
    })
    revalidatePath(`/`)
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting item:', error)
    return { success: false, error: 'Failed to delete item' }
  }
}

//
export async function createCertificateItem(
  certificateId: string,
  itemId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.certificateItem.create({
      data: {
        certificateId,
        itemId,
      },
    })
    revalidatePath(`/`)
    return { success: true }
  } catch (error: any) {
    console.error('Error creating CertificateItem:', error)
    return { success: false, error: 'Failed to create CertificateItem' }
  }
}

export async function updateCertificateItemProgress(
  id: string, // ID del CertificateItem
  progress: number,
  notes: string | null,
  photos: string[],
): Promise<{ success: boolean; error?: string }> {
  try {
    const certificateItem = await prisma.certificateItem.update({
      where: { id },
      data: {
        progress,
        notes,
        photos,
        status: 'PENDING', 
      },
    })
    revalidatePath(`/`) 
    return { success: true }
  } catch (error: any) {
    console.error('Error updating CertificateItem progress:', error)
    return {
      success: false,
      error: 'Failed to update CertificateItem progress',
    }
  }
}

// logica para aprobcar o rechazar el progreso de un item en un certificado
export async function approveCertificateItemProgress(
    id: string, 
    approved: boolean,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const certificateItem = await prisma.certificateItem.findUnique({
        where: { id },
      });
  
      if (!certificateItem) {
        return { success: false, error: 'CertificateItem not found' };
      }
  
      const updatedCertificateItem = await prisma.certificateItem.update({
        where: { id },
        data: {
          status: approved ? 'APPROVED' : 'REJECTED',
        },
      });
  
      // Recalcular el progreso del certificado y del proyecto
      await updateCertificateProgress(certificateItem.certificateId);
      const certificate = await prisma.certificate.findUnique({
       where: { id: certificateItem.certificateId },
      });
      if (certificate?.projectId) {
      await updateProjectProgress(certificate.projectId);
       }
  
      revalidatePath(`/`); 
      return { success: true };
    } catch (error: any) {
      console.error('Error approving/rejecting CertificateItem progress:', error);
      return {
        success: false,
        error: 'Failed to approve/reject CertificateItem progress',
      };
    }
  }

export async function updateCertificateProgress(certificateId: string) {
  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: { items: true },
  })

  if (!certificate) {
    throw new Error('Certificado no encontrado')
  }

  let progresoTotal = 0
  for (const item of certificate.items) {
    progresoTotal += item.progress
  }

  const nuevoProgresoCertificado = progresoTotal / certificate.items.length

  await prisma.certificate.update({
    where: { id: certificateId },
    data: { progressPercent: nuevoProgresoCertificado },
  })

  return nuevoProgresoCertificado
}

export async function updateProjectProgress(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { certificates: true },
  })

  if (!project) {
    throw new Error('Proyecto no encontrado')
  }

  let progresoTotalProyecto = 0
  for (const certificate of project.certificates) {
    progresoTotalProyecto += certificate.progressPercent
  }

  const nuevoProgresoProyecto =
    progresoTotalProyecto / project.certificates.length

  await prisma.project.update({
    where: { id: projectId },
    data: { progressTotal: nuevoProgresoProyecto },
  })

  return nuevoProgresoProyecto
}
