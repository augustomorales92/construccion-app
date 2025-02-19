import prisma from '@/lib/db'
import { updateCertificateStatusSchema } from '@/schemas'
import { NextResponse } from 'next/server'

// Estos endpoints estan pensados para el admin que vea lo pendiente y apruebe o desapruebe
export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      where: {
        status: 'PENDING',
      },
      include: { certificateItems: true, Project: true },
    })

    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Error obteniendo certificados:', error)
    return NextResponse.json(
      { error: 'Error obteniendo certificados' },
      { status: 500 },
    )
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const parsedData = updateCertificateStatusSchema.safeParse(body)

    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsedData.error.format() },
        { status: 400 },
      )
    }

    const { certificateId, status } = parsedData.data
    
    const existingCertificate = await prisma.certificate.findUnique({
      where: {
        id: certificateId,
      },
    })

    if (!existingCertificate) {
      return NextResponse.json(
        { error: 'Certificado no encontrado' },
        { status: 404 },
      )
    }

    const updatedCertificate = await prisma.certificate.update({
      where: {
        id: certificateId,
      },
      data: {
        status: status,
      },
    })

    return NextResponse.json(updatedCertificate)
  } catch (error) {
    console.error('Error actualizando el certificado:', error)
    return NextResponse.json(
      { error: 'Error actualizando el certificado' },
      { status: 500 },
    )
  }
}
