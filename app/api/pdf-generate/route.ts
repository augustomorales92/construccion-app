import getUser from '@/actions/auth'
import prisma from '@/lib/db'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { certificateId } = await req.json()

    if (!certificateId) {
      return NextResponse.json(
        { error: 'ID de certificado no encontrado' },
        { status: 400 },
      )
    }

    const userAuth = await getUser()
    if (!userAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const certificate = await prisma.certificate.findUnique({
      where: {
        id: certificateId,
        status: 'APPROVED',
      },
      include: {
        certificateItems: {
          include: {
            item: true,
          },
        },
        Project: {
          select: {
            name: true,
            budget: true,
            projectNumber: true,
            address: true,
            description: true,
            estimatedTime: true,
          },
        },
      },
    })

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificado no encontrado' },
        { status: 404 },
      )
    }

    // const pythonServiceUrl = `${process.env.PYTHON_ENDPOINT_URL}/generate_certificate_pdf`
    const pythonServiceUrl = 'http://localhost:8000/generate_certificate_pdf'

    const response = await axios.post(pythonServiceUrl, certificate, {
      responseType: 'arraybuffer', 
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/pdf',
      },
    })

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate_${certificateId}.pdf"`,
      },
    })

  } catch (error) {
    console.error('Error obteniendo el certificado:', error)
    return NextResponse.json(
      { error: 'Error obteniendo el certificado' },
      { status: 500 },
    )
  }
}
