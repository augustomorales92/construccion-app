import getUser from '@/actions/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const userAuth = await getUser()
  if (!userAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const projects = await prisma.project.findMany({
      include: {
        certificates: {
          include: {
            certificateItems: {
              include: {
                item: true,
              },
            },
          },
        },
      },
    })
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error obteniendo certificados' },
      { status: 500 },
    )
  }
}
