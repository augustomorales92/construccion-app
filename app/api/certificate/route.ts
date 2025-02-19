import prisma from '@/lib/db'
import { NextResponse } from 'next/server'

// Eesta es para mostrar que items teien qeu actualizar el manager
export async function GET() {
  try {
    const maxVersion = await prisma.certificate.aggregate({
      _max: {
        version: true,
      },
    })

    const latestVersion = maxVersion._max.version

    if (latestVersion === null) {
      return NextResponse.json([])
    }

    const certificates = await prisma.certificate.findMany({
      where: {
        version: latestVersion,
      },
      include: {
        Project: true,
        certificateItems: {
          include: {
            item: true, 
          },
        },
      },
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
