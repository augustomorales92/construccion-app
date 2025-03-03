import getUser from '@/actions/auth'
import prisma from '@/lib/db'
import { generateAccessCode, getProjectNumber } from '@/lib/utils'
import { createFirstProjectSchema, editProjectSchema } from '@/schemas'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const projectId = url.searchParams.get('id')
    if (!projectId) {
      return NextResponse.json({ error: 'ID no encontrado' }, { status: 400 })
    }
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
          include: {
            certificateItems: true,
          },
        },
        items: true,
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

    const { name, description, address, budget, items = [] } = parsedData.data
    const accessCode = generateAccessCode(8)
    const projectNumber = getProjectNumber(name)

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

      const createdItems = await tx.item.createManyAndReturn({
        data: items.map((item) => ({
          section: item.section,
          description: item.description,
          unit: item.unit,
          quantity: item.quantity,
          price: item.price,
          projectId: project.id,
        })),
      })

      await tx.certificateItemProgress.createMany({
        data: createdItems.map((item) => ({
          certificateId: newCertificate.id,
          itemId: item.id,
        })),
      })

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

    const { newItems, itemsToUpdate, itemsToDelete, projectData, isSheet } =
      parsedData.data

    const updatedProject = await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id: projectData.id },
        include: {
          certificates: {
            where: { version: 1 },
            include: {
              certificateItems: true,
            },
          },
          items: true,
        },
      })

      if (!project) {
        throw new Error('Proyecto no encontrado')
      }

      const certificate = project.certificates[0]
      if (!certificate) {
        throw new Error('Certificado versión 1 no encontrado')
      }

      await tx.project.update({
        where: { id: projectData.id },
        data: { ...projectData },
      })

      if (isSheet) {
        const itemIdsToDelete = project.items.map((item) => item.id)

        await tx.certificateItemProgress.deleteMany({
          where: { itemId: { in: itemIdsToDelete } },
        })

        await tx.item.deleteMany({
          where: { projectId: projectData.id },
        })

        for (const itemData of newItems || []) {
          const newItem = await tx.item.create({
            data: {
              projectId: projectData.id,
              section: itemData.section,
              description: itemData.description,
              unit: itemData.unit,
              quantity: itemData.quantity,
              price: itemData.price,
            },
          })

          await tx.certificateItemProgress.create({
            data: {
              certificateId: certificate.id,
              itemId: newItem.id,
            },
          })
        }
      } else {
        // Si es una edit desde el front usamos los array
        for (const itemData of newItems || []) {
          const newItem = await tx.item.create({
            data: {
              projectId: projectData.id,
              section: itemData.section,
              description: itemData.description,
              unit: itemData.unit,
              quantity: itemData.quantity,
              price: itemData.price,
            },
          })

          await tx.certificateItemProgress.create({
            data: {
              certificateId: certificate.id,
              itemId: newItem.id,
            },
          })
        }

        for (const itemData of itemsToUpdate || []) {
          await tx.item.update({
            where: { id: itemData.id },
            data: {
              section: itemData.section,
              description: itemData.description,
              unit: itemData.unit,
              quantity: itemData.quantity,
              price: itemData.price,
            },
          })
        }

        if (itemsToDelete?.length) {
          await tx.certificateItemProgress.deleteMany({
            where: { itemId: { in: itemsToDelete } },
          })

          await tx.item.deleteMany({
            where: { id: { in: itemsToDelete } },
          })
        }
      }
      return tx.project.findUnique({
        where: { id: projectData.id },
        include: { items: true },
      })
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
    const { projectId } = await req.json()

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId es obligatorio' },
        { status: 400 },
      )
    }

    const userProject = await prisma.userProject.findFirst({
      where: {
        projectId,
        userId: userAuth.id,
      },
    })

    if (!userProject) {
      return NextResponse.json(
        { error: 'No tienes acceso a este proyecto' },
        { status: 403 },
      )
    }

    await prisma.project.delete({
      where: { id: projectId },
    })

    return NextResponse.json(
      { message: 'Projecto eliminado correctamente' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error eliminando projecto:', error)
    return NextResponse.json(
      { error: 'Error eliminando projecto' },
      { status: 500 },
    )
  }
}
