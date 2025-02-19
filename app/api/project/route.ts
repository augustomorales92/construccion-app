import getUser from '@/actions/auth'
import prisma from '@/lib/db'
import { generateAccessCode } from '@/lib/utils'
import { createFirstProjectSchema, editProjectSchema } from '@/schemas'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const projectId = url.searchParams.get('id')
  if (!projectId) {
    return NextResponse.json({ error: 'ID no encontrado' }, { status: 400 })
  }
  try {
    const userAuth = await getUser()
    if (!userAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        certificates: {
          orderBy: { version: 'desc' },
          take: 1,
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

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error obteniendo proyecto:', error)
    return NextResponse.json(
      { error: 'Error obteniendo proyecto' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const userAuth = await getUser()
    if (!userAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsedData = createFirstProjectSchema.safeParse(body)
    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsedData.error.format() },
        { status: 400 },
      )
    }

    const {
      name,
      description,
      address,
      budget,
      projectNumber,
      items = [],
    } = parsedData.data
    const accessCode = generateAccessCode(8)

    const newProject = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name,
          description: description || null,
          address: address || null,
          budget,
          accessCode,
          projectNumber,
        },
      })
      await tx.userProject.create({
        data: {
          userId: userAuth.id,
          projectId: project.id,
        },
      })

      const newCertificate = await tx.certificate.create({
        data: {
          version: 1,
          status: 'APPROVED',
          projectId: project.id,
        },
      })

      let createdItems = []
      if (items.length > 0) {
        await tx.item.createMany({
          data: items.map((item) => ({
            section: item.section,
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            price: item.price,
            weight: item.weight,
          })),
        })

        createdItems = await tx.item.findMany({
          where: {
            description: { in: items.map((item) => item.description) },
          },
        })

        await tx.certificateItemProgress.createMany({
          data: createdItems.map((item) => ({
            certificateId: newCertificate.id,
            itemId: item.id,
          })),
        })
      }

      return { project, certificate: newCertificate, items }
    })

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('Error creando proyecto:', error)
    return NextResponse.json(
      { error: 'Error creando proyecto' },
      { status: 500 },
    )
  }
}

export async function PUT(req: Request) {
  try {
    const userAuth = await getUser()
    if (!userAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsedData = editProjectSchema.safeParse(body)

    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsedData.error.format() },
        { status: 400 },
      )
    }

    const { projectId, items } = parsedData.data

    const updatedProject = await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id: projectId },
        include: {
          certificates: {
            where: { version: 1 },
            include: {
              certificateItems: true,
            },
          },
        },
      })

      if (!project) {
        throw new Error('Proyecto no encontrado')
      }

      const certificate = project.certificates[0]
      if (!certificate) {
        throw new Error('Certificado versión 1 no encontrado')
      }

      const validItemIds = new Set(
        certificate.certificateItems.map((item) => item.itemId),
      )

      // filtro los que pertenecen a la version 1, los unicos editables o borrables
      const itemsToUpdate = items.filter(
        (item) => item.id && validItemIds.has(item.id),
      )
      const itemsToCreate = items.filter((item) => !item.id)

      //   creo relaciones por cada item creado , verificar esto en db
      for (const itemData of itemsToCreate) {
        const newItem = await tx.item.create({
          data: {
            section: itemData.section,
            description: itemData.description,
            unit: itemData.unit,
            quantity: itemData.quantity,
            price: itemData.price,
            weight: itemData.weight,
          },
        })

        await tx.certificateItemProgress.create({
          data: {
            certificateId: certificate.id,
            itemId: newItem.id,
          },
        })
      }

      // actualizo cada item
      for (const itemData of itemsToUpdate) {
        await tx.item.update({
          where: { id: itemData.id },
          data: {
            section: itemData.section,
            description: itemData.description,
            unit: itemData.unit,
            quantity: itemData.quantity,
            price: itemData.price,
            weight: itemData.weight,
          },
        })
      }

      return project
    })

    return NextResponse.json(updatedProject, { status: 200 })
  } catch (error) {
    console.error('Error editando proyecto:', error)
    return NextResponse.json(
      { error: 'Error editando proyecto' },
      { status: 500 },
    )
  }
}

export async function DELETE(req: Request) {
  const userAuth = await getUser()
  if (!userAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { itemId, projectId } = await req.json()

    if (!itemId || !projectId) {
      return NextResponse.json(
        { error: 'Faltan datos: itemId y projectId son obligatorios' },
        { status: 400 },
      )
    }

    await prisma.$transaction(async (tx) => {
      const certificate = await tx.certificate.findFirst({
        where: {
          projectId,
          version: 1,
        },
        include: {
          certificateItems: true,
        },
      })

      if (!certificate) {
        throw new Error('Certificado versión 1 no encontrado')
      }

      const isItemLinked = certificate.certificateItems.some(
        (item) => item.itemId === itemId,
      )

      if (!isItemLinked) {
        return NextResponse.json(
          {
            error:
              'Este item no pertenece a la versión 1 y no puede eliminarse',
          },
          { status: 403 },
        )
      }

      await tx.certificateItemProgress.deleteMany({
        where: {
          certificateId: certificate.id,
          itemId,
        },
      })

      // Si el item no está en otros certificados, eliminarlo
      const itemStillExists = await tx.certificateItemProgress.count({
        where: { itemId },
      })

      if (itemStillExists === 0) {
        await tx.item.delete({ where: { id: itemId } })
      }
    })

    return NextResponse.json(
      { message: 'Item eliminado correctamente' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error eliminando item:', error)
    return NextResponse.json(
      { error: 'Error eliminando item' },
      { status: 500 },
    )
  }
}
