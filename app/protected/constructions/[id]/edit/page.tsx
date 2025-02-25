import { getClients, getConstructionById, getManagers } from '@/actions/constructions'
import { notFound } from 'next/navigation'
import EditProjectForm from './EditProjectForm'
import getUser from '@/actions/auth'

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
    getUser()
  ])
  const id = param.id
  if (id !== 'new') {
    construction = await getConstructionById(id)

    if (!construction) {
      notFound()
    }
  }

  const isAdmin = user?.user_metadata.role === 'ADMIN'

  return <EditProjectForm project={construction} clients={clients} id={id} managers={managers} isAdmin={isAdmin}/>
}
