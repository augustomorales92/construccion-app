'use server'


import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import getUser from './auth'
import { projectSchema } from '@/schemas'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { Incidents } from '@/lib/types'

const clientsSample = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "123-456-7890",
  },
  {
    id: 2,
    name: "María García",
    email: "maria@example.com",
    phone: "098-765-4321",
  },
];

const managerSample = [
  {
    id: 1,
    name: "Pedro",
    email: "",
    phone: "",
  },
  {
    id: 2,
    name: "Luis",
    email: "",
    phone: "",
  },
];

const constructions = [
  {
    id: "1",
    name: "Casa Moderna",
    customer: clientsSample[0],
    progressPercent: 30,
    budget: 500000,
    materialsPurchased: ["Cemento", "Ladrillos", "Acero"],
    estimatedTime: "6 meses",
    description: "Construcción de una casa moderna de dos pisos.",
    images: ["/images/placeholder.svg?height=200&width=300"],
    certificates: [],
    password: "1234",
    ref: "#234234234234",
    manager: managerSample[0],
    status: "En progreso",
  },
  {
    id: "2",
    name: "Oficina Comercial",
    customer: clientsSample[1],
    progressPercent: 60,
    budget: 750000,
    materialsPurchased: ["Vidrio", "Aluminio", "Cableado"],
    estimatedTime: "4 meses",
    description:
      "Remodelación de oficinas comerciales en el centro de la ciudad.",
    images: ["/images/placeholder.svg?height=200&width=300"],
    certificates: [],
    password: "3456",
    ref: "#2352543534",
    manager: managerSample[1],
    status: "En progreso",
  },
  {
    id: "3",
    name: "Edificio 3 plantas",
    customer: clientsSample[1],
    progressPercent: 60,
    budget: 750000,
    materialsPurchased: ["Vidrio", "Aluminio", "Cableado"],
    estimatedTime: "8 meses",
    description:
      "Construcción de un edificio de 3 plantas en el centro de la ciudad.",
    images: ["/images/placeholder.svg?height=200&width=300"],
    certificates: [],
    password: "1111",
    ref: "#5432349",
    manager: managerSample[0],
    status: "En progreso",
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
  const construction = constructions.find((c) => c.id === constructionId);
  return construction?.password === password;
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

type FormDataValues = z.infer<typeof projectSchema>

export async function createProject(
  formData: FormDataValues,
): Promise<{ success: boolean; error?: string }> {
  const userAuth = await getUser()

  if (!userAuth) {
    return { success: false, error: 'Unauthorized' }
  }

  const validatedData = projectSchema.safeParse(formData)

  if (!validatedData.success) {
    console.log(validatedData.error.flatten().fieldErrors)
    return {
      success: false,
      error: 'Invalid form data',
    }
  }

  const { name, description, address, budget, projectNumber } = formData

  const accessCode = uuidv4()
  try {
    await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name,
          description: description || null,
          address: address || null,
          budget,
          accessCode,
          projectNumber,
          users: {
            create: [
              {
                user: {
                  connect: {
                    id: userAuth.id,
                  },
                },
              },
            ],
          },
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

export async function getProjectsByUser() {
  const userAuth = await getUser()

  if (!userAuth) {
    return { success: false, error: 'Unauthorized' }
  }

  const { id: userId } = userAuth
  try {
    const userWithProjects = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        projects: {
          include: {
            project: true,
          },
        },
      },
    })

    if (!userWithProjects) {
      return null
    }

    const projects = userWithProjects.projects.map(
      (userProject) => userProject.project,
    )

    return projects
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

export async function getClients() {
  // Aquí iría la lógica para obtener todos los clientes de la base de datos
  return clientsSample;
}

export async function getManagers() {
  return managerSample;
}

export async function createProject(formData: FormData) {
  // Aquí iría la lógica para crear una nueva obra en la base de datos
  console.log("Creando nueva obra:", Object.fromEntries(formData));
}

export async function updateProject(formData: FormData) {
  // Aquí iría la lógica para actualizar una obra existente en la base de datos
  console.log("Actualizando obra:", Object.fromEntries(formData));
}
