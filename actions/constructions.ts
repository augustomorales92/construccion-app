'use server'

import { Incidents } from '@/components/landing/types'
import getUser from './auth'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'

const constructions = [
  {
    id: '1',
    name: 'Casa Moderna',
    customer: 'Juan Pérez',
    progressPercent: 30,
    budget: 500000,
    materialsPurchased: ['Cemento', 'Ladrillos', 'Acero'],
    estimatedTime: '6 meses',
    description: 'Construcción de una casa moderna de dos pisos.',
    images: ['/images/placeholder.svg?height=200&width=300'],
    certificates: [],
    accessCode: '1234',
    phoneManager: '#234234234234',
  },
  {
    id: '2',
    name: 'Oficina Comercial',
    customer: 'Empresas XYZ',
    progressPercent: 60,
    budget: 750000,
    materialsPurchased: ['Vidrio', 'Aluminio', 'Cableado'],
    estimatedTime: '4 meses',
    description:
      'Remodelación de oficinas comerciales en el centro de la ciudad.',
    images: ['/images/placeholder.svg?height=200&width=300'],
    certificates: [],
    accessCode: '3456',
    phoneManager: '#2352543534',
  },
  {
    id: '3',
    name: 'Edificio 3 plantas',
    cliente: 'Empresas XYZ',
    progressPercent: 60,
    budget: 750000,
    materialsPurchased: ['Vidrio', 'Aluminio', 'Cableado'],
    estimatedTime: '8 meses',
    description:
      'Construccion de un edificio de 3 plantas en el centro de la ciudad.',
    images: ['/images/placeholder.svg?height=200&width=300'],
    certificates: [],
    paccessCodeassword: '1111',
    phoneManager: '#5432349',
  },
]

const sampleIncidents: Incidents[] = [
  {
    id: '1',
    date: '2023-05-15',
    content: 'Inicio de la excavación para los cimientos.',
  },
  {
    id: '2',
    date: '2023-05-20',
    content:
      'Retraso debido a lluvias intensas. Trabajo suspendido por 2 días.',
  },
  {
    id: '3',
    date: '2023-06-01',
    content: 'Finalización de la colocación de cimientos.',
  },
  {
    id: '4',
    date: '2023-06-15',
    content: 'Inicio de la construcción de la estructura principal.',
  },
  {
    id: '5',
    date: '2023-07-01',
    content:
      'Problema con el suministro de materiales. Retraso estimado de 1 semana.',
  },
  {
    id: '6',
    date: '2023-07-15',
    content: 'Finalización de la estructura principal.',
  },
  {
    id: '7',
    date: '2023-08-01',
    content: 'Inicio de trabajos de instalación eléctrica y fontanería.',
  },
  {
    id: '8',
    date: '2023-08-20',
    content:
      'Inspección de seguridad realizada. Todos los estándares cumplidos.',
  },
  {
    id: '9',
    date: '2023-09-01',
    content: 'Inicio de trabajos de acabado interior.',
  },
  {
    id: '10',
    date: '2023-09-15',
    content:
      'Retraso en la entrega de materiales para acabados. Impacto estimado de 3 días.',
  },
]

export async function getConstructions() {
  // Aquí iría la lógica para obtener todas las obras de la base de datos
  return constructions
}

export async function getMyConstructions() {
  // Aquí iría la lógica para obtener todas las obras de la base de datos
  return constructions
}
export async function getFavoriteConstructions() {
  const user = await getUser()
  const favorites = user?.user_metadata.favorites || []
  // Aquí iría la lógica para obtener las obras favoritas de la base de datos
  return constructions.filter((obra) => favorites.includes(obra.id))
}

export async function verifyPassword(
  constructionId: string | undefined,
  password: string,
) {
  const construction = constructions.find((c) => c.id === constructionId)
  return construction?.accessCode === password
}

export async function getConstructionById(id: string) {
  // Aquí iría la lógica para obtener una obra específica de la base de datos

  return constructions.find((obra) => obra.id === id) || null
}

export async function getIncidentsByConstructionId(
  id: number,
): Promise<Incidents[]> {
  // Aquí iría la lógica para obtener todas las incidencias de una obra específica
  return sampleIncidents
}

interface FormDataValues {
  name: string
  description?: string
  address?: string
  budget?: number
  phoneManager?: string
}

export async function createWork(
  formData: FormDataValues,
): Promise<{ success: boolean; error?: string }> {
  const userAuth = await getUser()

  if (!userAuth) {
    return { success: false, error: 'Unauthorized' }
  }

  const { email, id: userId } = userAuth
  const { name, description, address, budget, phoneManager } = formData

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Buscar el usuario por email
      const existingUser = await tx.user.findUnique({
        where: { email: email! },
      })

      let user
      if (!existingUser) {
        // 2. Si el usuario no existe, créalo
        user = await tx.user.create({
          data: {
            id: userId,
            email: email!,
            role: userAuth.user_metadata?.role || null,
          },
        })
      } else {
        // 3. Si el usuario existe, usa el usuario existente
        user = existingUser
      }

      // 4. Crear la obra
      const work = await tx.work.create({
        data: {
          name,
          description: description || null,
          address: address || null,
          budget,
          phoneManager: phoneManager || null,
        },
      })

      // 5. Crear la relación UserWork
      await tx.userWork.create({
        data: {
          userId: user.id,
          workId: work.id,
        },
      })
    })

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error creating work and user:', error)
    return { success: false, error: 'Failed to create work and user' }
  }
}

export async function getWorksByUser() {
  const userAuth = await getUser()

  if (!userAuth) {
    return { success: false, error: 'Unauthorized' }
  }

  const { id: userId } = userAuth
  try {
    const userWithWorks = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        works: {
          include: {
            work: true,
          },
        },
      },
    })

    if (!userWithWorks) {
      return null
    }

    const works = userWithWorks.works.map((userWork) => userWork.work)

    return works
  } catch (error) {
    console.error('Error getting works by user:', error)
    throw new Error('Failed to get works by user')
  }
}

export async function getUsersByWork(workId: string) {
  try {
    const workWithUsers = await prisma.work.findUnique({
      where: {
        id: workId,
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!workWithUsers) {
      return null
    }

    const users = workWithUsers.users.map((userWork) => userWork.user)

    return users
  } catch (error) {
    console.error('Error getting users by work:', error)
    throw new Error('Failed to get users by work')
  }
}
