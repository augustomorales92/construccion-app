import prisma from '@/lib/db'
import { updateCertificateStatusSchema } from '@/schemas'
import { NextRequest, NextResponse } from 'next/server'

// Estos endpoints estan pensados para el admin que vea lo pendiente y apruebe o desapruebe
// entra a la seccion certificados pendientes y en el params recupere el id del project
export async function GET(req:NextRequest) {
  try {
    const url = new URL(req.url)
    const projectId = url.searchParams.get('id')
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID no encontrado' }, { status: 400 })
    }
    const certificates = await prisma.certificate.findMany({
      where: {
        projectId,
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

export async function PUT(req: NextRequest) {
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
