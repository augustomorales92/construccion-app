import getUser from '@/actions/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const certificateId = url.searchParams.get('id')
    if (!certificateId) {
      return NextResponse.json({ error: 'ID no encontrado' }, { status: 400 })
    }
    const userAuth = await getUser()
    if (!userAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const latestCertificate = await prisma.certificate.findFirst({
      where: {
        id: certificateId,
        status: 'APPROVED',
      },
      orderBy: {
        issuedAt: 'desc',
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

    if (!latestCertificate) {
      return NextResponse.json(
        { error: 'Certificate no encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json(latestCertificate)
  } catch (error) {
    console.error('Error obteniendo proyecto:', error)
    return NextResponse.json(
      { error: 'Error obteniendo proyecto' },
      { status: 500 },
    )
  }
}
