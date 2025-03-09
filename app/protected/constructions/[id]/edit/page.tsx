import { getProjectById } from '@/actions/constructions'
import { getCustomers, getManagers } from '@/actions/people'
import { notFound } from 'next/navigation'
import EditProjectForm from './EditProjectForm'

export default async function EditConstruction({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  let construction = null
  const [data, clients, managers] = await Promise.all([
    getProjectById(params),
    getCustomers(),
    getManagers(),
  ])

  if (data?.project === null) {
    notFound()
  }

  return (
    <EditProjectForm
      project={construction}
      clients={clients?.data}
      managers={managers?.data}
      isNewProject={data?.id === 'new'}
    />
  )
}
