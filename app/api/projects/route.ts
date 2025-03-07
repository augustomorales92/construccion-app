import getUser from '@/actions/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const query = url.searchParams.get('query') ?? ''
  const userAuth = await getUser()
  if (!userAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        users: {
          some: {
            userId: userAuth.id,
          },
        },
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            projectNumber: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
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
