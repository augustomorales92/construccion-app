import getUser from '@/actions/auth'
import prisma from '@/lib/db'
import { incidentSchema } from '@/schemas'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const projectId = url.searchParams.get('id')
  if (!projectId) {
    return NextResponse.json({ error: 'ID no encontrado' }, { status: 400 })
  }
  const userAuth = await getUser()
  if (!userAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const incidents = await prisma.incident.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(incidents)
  } catch (error) {
    console.error('Error obteniendo incidencias:', error)
    return NextResponse.json(
      { error: 'Error obteniendo incidencias' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  const userAuth = await getUser()
  if (!userAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsedData = incidentSchema.safeParse(body)

  if (!parsedData.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsedData.error.format() },
      { status: 400 },
    )
  }

  const { description, projectId, date } = parsedData.data
  console.log('datos que llegan,',date)

  if (!projectId) {
    return NextResponse.json(
      { error: 'Project ID es requerido' },
      { status: 400 },
    )
  }

  if (!description || !projectId) {
    return NextResponse.json(
      { error: 'Descripción y User ID son requeridos' },
      { status: 400 },
    )
  }

  try {
    const newIncident = await prisma.incident.create({
      data: {
        description: description,
        projectId: projectId,
        userId: userAuth.id,
        issuedAt: date,
      },
    })
    return NextResponse.json(newIncident, { status: 201 })
  } catch (error) {
    console.error('Error creando incidencia:', error)
    return NextResponse.json(
      { error: 'Error creando incidencia' },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url)
  const incidentId = url.searchParams.get('id')
  const userAuth = await getUser()
  if (!userAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { description, projectId } = await req.json()

  if (!incidentId) {
    return NextResponse.json(
      { error: 'Project ID es requerido' },
      { status: 400 },
    )
  }

  if (!description || !projectId) {
    return NextResponse.json(
      { error: 'Descripción y projectId son requeridos' },
      { status: 400 },
    )
  }

  try {
    const updatedIncident = await prisma.incident.update({
      where: {
        id: incidentId,
      },
      data: {
        description: description,
      },
    })
    return NextResponse.json(updatedIncident)
  } catch (error) {
    console.error('Error creando incidencia:', error)
    return NextResponse.json(
      { error: 'Error creando incidencia' },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url)
  const incidentId = url.searchParams.get('id')
  if (!incidentId) {
    return NextResponse.json(
      { error: 'Incident Id es requerido' },
      { status: 400 },
    )
  }
  const userAuth = await getUser()
  if (!userAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.incident.delete({
      where: {
        id: incidentId,
      },
    })
    return new NextResponse('Eliminada con exito', { status: 204 }) 
  } catch (error) {
    console.error('Error eliminando incidencia:', error)
    return NextResponse.json(
      { error: 'Error eliminando incidencia' },
      { status: 500 },
    )
  }
}
