import { getClients, getConstructionById, getManagers } from '@/actions/constructions'
import { notFound } from 'next/navigation'
import EditProjectForm from './EditProjectForm'

export default async function EditConstruction({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  let construction = null
  const [param, clients, managers] = await Promise.all([
    params,
    getClients(),
    getManagers(),
  ])
  const id = param.id
  if (id !== 'new') {
    construction = await getConstructionById(id)

    if (!construction) {
      notFound()
    }
  }

  return <EditProjectForm project={construction} clients={clients} id={id} managers={managers} />
}
