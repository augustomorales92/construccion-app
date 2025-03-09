import { handleSSRQueries } from '@/actions/auth'
import { getProjectById } from '@/actions/constructions'
import { getCustomers, getManagers } from '@/actions/people'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import EditProjectForm from './EditProjectForm'

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const [data, clients, managers] = await Promise.all([
    getProjectById(id),
    handleSSRQueries(getCustomers),
    handleSSRQueries(getManagers),
  ])

  if (data?.project === null) {
    notFound()
  }

  return (
    <EditProjectForm
      project={data?.project}
      clients={clients?.data}
      managers={managers?.data}
      isNewProject={id === 'new'}
    />
  )
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content params={params} />
    </Suspense>
  )
}
