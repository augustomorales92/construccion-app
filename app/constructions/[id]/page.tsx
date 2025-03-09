import getUser from '@/actions/auth'
import { getProjectById } from '@/actions/constructions'
import CardDetailSkeleton from '@/components/skeletons/card-detail'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import Content from '../content'

async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const [data, user, cookieStore] = await Promise.all([
    getProjectById(params),
    getUser(),
    cookies(),
  ])

  const id = data?.id
  const project = data?.project
  const userFavorites = user?.user_metadata?.favorites || []

  if (!project) {
    redirect('/')
  }

  // Verificar acceso
  const password = cookieStore.get('password')?.value
  const isCorrectPassword = password === project.accessCode
  const isFavorite = userFavorites.includes(id)
  let showPasswordModal = false

  const hasAccess = isCorrectPassword || isFavorite || !project.accessCode

  if (!hasAccess) {
    if (!password && project?.accessCode) {
      showPasswordModal = true
    } else {
      redirect('/')
    }
  }

  return (
    <Content
      project={project}
      isFavorite={isFavorite}
      showPasswordModal={showPasswordModal}
    />
  )
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<CardDetailSkeleton />}>
      <ProjectPage params={params} />
    </Suspense>
  )
}
