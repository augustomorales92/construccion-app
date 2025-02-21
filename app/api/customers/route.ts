import getUser from '@/actions/auth'
import prisma from '@/lib/db'
import { customerSchema } from '@/schemas'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userAuth = await getUser()
  if (!userAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const customers = await prisma.customer.findMany({
      include: {
        projects: true,
      },
    })
    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error obteniendo clientes:', error)
    return NextResponse.json(
      { error: 'Error obteniendo clientes' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsedData = customerSchema.safeParse(body)

  if (!parsedData.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsedData.error.format() },
      { status: 400 },
    )
  }

  const { name, email, phone, projectIds } = parsedData.data

  try {
    const newCustomer = await prisma.customer.create({
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

    return NextResponse.json(newCustomer, { status: 201 })
  } catch (error) {
    console.error('Error al crear cliente:', error)
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url)
  const cusotmerId = url.searchParams.get('id')
  const userAuth = await getUser()
  if (!userAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, email, phone } = await req.json()

  if (!cusotmerId) {
    return NextResponse.json(
      { error: 'Cliente ID es requerido' },
      { status: 400 },
    )
  }
  try {
    const updatedCustomer = await prisma.customer.update({
      where: {
        id: cusotmerId,
      },
      data: { name, email, phone},
    })
    return NextResponse.json(updatedCustomer)
  } catch (error) {
    console.error('Error creando cliente:', error)
    return NextResponse.json(
      { error: 'Error creando cliente' },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url)
  const cusotmerId = url.searchParams.get('id')
  if (!cusotmerId) {
    return NextResponse.json(
      { error: 'Cliente Id es requerido' },
      { status: 400 },
    )
  }
  const userAuth = await getUser()
  if (!userAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.customer.delete({
      where: {
        id: cusotmerId,
      },
    })
    return new NextResponse('Eliminado con exito', { status: 204 })
  } catch (error) {
    console.error('Error eliminando cliente:', error)
    return NextResponse.json(
      { error: 'Error eliminando cliente' },
      { status: 500 },
    )
  }
}
