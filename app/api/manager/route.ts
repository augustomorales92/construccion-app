import getUser from '@/actions/auth'
import prisma from '@/lib/db'
import { managerSchema } from '@/schemas'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  const userAuth = await getUser()
  if (!userAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const manager = await prisma.manager.findMany({
      include: {
        projects: true,
      },
    })
    return NextResponse.json(manager)
  } catch (error) {
    console.error('Error obteniendo managers:', error)
    return NextResponse.json(
      { error: 'Error obteniendo managers' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsedData = managerSchema.safeParse(body)

  if (!parsedData.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsedData.error.format() },
      { status: 400 },
    )
  }

  const { name, email, phone, projectIds } = parsedData.data

  try {
    const newManager = await prisma.manager.create({
      data: {
        name,
        email,
        phone,
        projects: {
          connect: projectIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: { projects: true },
    })

    return NextResponse.json(newManager, { status: 201 })
  } catch (error) {
    console.error('Error al crear manager:', error)
    return NextResponse.json(
      { error: 'Error al crear manager' },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url)
  const managerId = url.searchParams.get('id')
  const userAuth = await getUser()
  if (!userAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, email, phone } = await req.json()

  if (!managerId) {
    return NextResponse.json(
      { error: 'Manager ID es requerido' },
      { status: 400 },
    )
  }
  try {
    const updatedManager = await prisma.manager.update({
      where: {
        id: managerId,
      },
      data: { name, email, phone},
    })
    return NextResponse.json(updatedManager)
  } catch (error) {
    console.error('Error creando manager:', error)
    return NextResponse.json(
      { error: 'Error creando manager' },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url)
  const managerId = url.searchParams.get('id')
  if (!managerId) {
    return NextResponse.json(
      { error: 'Manager Id es requerido' },
      { status: 400 },
    )
  }
  const userAuth = await getUser()
  if (!userAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.manager.delete({
      where: {
        id: managerId,
      },
    })
    return new NextResponse('Eliminado con exito', { status: 204 })
  } catch (error) {
    console.error('Error eliminando manager:', error)
    return NextResponse.json(
      { error: 'Error eliminando manager' },
      { status: 500 },
    )
  }
}
