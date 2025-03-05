import getUser from '@/actions/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(_req: Request) {
  const userAuth = await getUser()

  if (!userAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const favorites = userAuth.user_metadata?.favorites || []

  try {
    const projects = await prisma.project.findMany({
      where: {
        users: {
          some: {
            userId: userAuth.id,
          },
        },
        id: {
          in: favorites,
        },
      },
      include: {
        certificates: {
          orderBy: { version: 'desc' },
          include: {
            certificateItems: true,
          },
        },
        items: true,
      },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Error obteniendo certificados' },
      { status: 500 },
    )
  }
}
