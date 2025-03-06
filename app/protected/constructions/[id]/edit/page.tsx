import getUser from '@/actions/auth'
import {
  getClients,
  getManagers,
  getProjectById,
} from '@/actions/constructions'
import { notFound } from 'next/navigation'
import EditProjectForm from './EditProjectForm'

export default async function EditConstruction({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  let construction = null
  const [param, clients, managers, user] = await Promise.all([
    params,
    getClients(),
    getManagers(),
    getUser(),
  ])
  const id = param.id
  const isNewProject = id === 'new'
  if (!isNewProject) {
    construction = await getProjectById(id)

    if (!construction) {
      notFound()
    }
  }

  const isAdmin = user?.user_metadata.role === 'ADMIN'

  return (
    <EditProjectForm
      project={construction}
      clients={clients}
      managers={managers}
      isAdmin={isAdmin}
      isNewProject={isNewProject}
    />
  )
}
