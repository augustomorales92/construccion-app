'use server'

import { StatusVariant } from '@/components/reports/columns'
import prisma from '@/lib/db'
import { PartialConstruction } from '@/lib/types'
import { revalidate, unstable_cache } from '@/lib/unstable_cache'
import { projectSchema } from '@/schemas'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'
import getUser from './auth'

export const getMyConstructions = unstable_cache(
  async (userId: string) => {
    if (!userId) {
      return null
    }

    try {
      const projects = await prisma.project.findMany({
        where: {
          users: {
            some: {
              userId: userId,
            },
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
      return projects
    } catch (error) {
      console.log(error)
      throw new Error('Failed to get my projects')
    }
  },
  ['projects'],
  { revalidate: revalidate },
)

export async function verifyPassword(
  constructionId: string | undefined,
  password: string,
) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: constructionId,
      },
      select: {
        accessCode: true,
      },
    })
    return project?.accessCode === password
  } catch (error) {
    console.error('Error verifying password:', error)
    return false
  }
}

export async function createProject(
  formData: FormData,
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

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const address = formData.get('address') as string
  const budget = Number(formData.get('budget'))
  const projectNumber = formData.get('projectNumber') as string

  const accessCode = uuidv4()
  try {
    await prisma.$transaction(async (tx) => {
      await tx.project.create({
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

export async function getUsersByProject(workId: string) {
  try {
    const workWithUsers = await prisma.project.findUnique({
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

export async function updateProject(formData: FormData) {
  // Aquí iría la lógica para actualizar una obra existente en la base de datos
  console.log('Actualizando obra:', Object.fromEntries(formData))
}

export async function getProjectsByQuery(
  query: string,
): Promise<PartialConstruction[] | null> {
  try {
    const projects = await prisma.project.findMany({
      where: {
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
      select: {
        id: true,
        name: true,
        projectNumber: true,
        address: true,
      },
    })

    return projects
  } catch (error) {
    console.error('Error getting projects by query:', error)
    return null
  }
}

export const getProjectById = unstable_cache(
  async (id: string) => {
    try {
      if (id === 'new') {
        return { project: undefined, id }
      }
      const project = await prisma.project.findUnique({
        where: {
          id,
        },
        include: {
          certificates: true,
          incidents: {
            orderBy: {
              createdAt: 'desc',
            },
          },
          items: true,
          customer: true,
          manager: true,
        },
      })
      return { project, id }
    } catch (error) {
      console.error('Error getting project by id:', error)
      return null
    }
  },
  ['project'],
  { revalidate: revalidate },
)

export async function getFavoriteProjects(favorites: string[]) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        id: {
          in: favorites,
        },
      },
    })
    return projects
  } catch (error) {
    console.error('Error getting favorite projects:', error)
    return []
  }
}

export const getPendingReports = unstable_cache(
  async (userId: string) => {
    try {
      const projectsIds = await prisma.project.findMany({
        where: {
          users: {
            some: {
              userId: userId,
            },
          },
        },
        select: {
          id: true,
        },
      })

      const incidents = await prisma.incident.findMany({
        where: {
          projectId: {
            in: projectsIds.map((project) => project.id),
          },
          status: 'PENDING',
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const certificates = await prisma.certificate.findMany({
        where: {
          projectId: {
            in: projectsIds.map((project) => project.id),
          },
          status: 'PENDING',
        },
        orderBy: {
          issuedAt: 'desc',
        },
      })

      return { incidents, certificates }
    } catch (error) {
      console.error('Error getting incidents:', error)
      return null
    }
  },
  ['incidents'],
  { revalidate: revalidate },
)
export async function updateReportStatus(
  id: string,
  status: StatusVariant,
  isCertificate?: boolean,
) {
  try {
    const updatedReport = isCertificate
      ? await prisma.certificate.update({
          where: {
            id,
          },
          data: {
            status,
          },
        })
      : await prisma.incident.update({
          where: {
            id,
          },
          data: {
            status,
          },
        })

    revalidatePath('/protected')
    return { success: true, updatedReport }
  } catch (error) {
    console.error('Error updating report status:', error)
    return { success: false, error: 'Failed to update report status' }
  }
}
