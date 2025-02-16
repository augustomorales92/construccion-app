import getUser from '@/actions/auth'
import {
  getConstructionById,
  getIncidentsByConstructionId,
} from '@/actions/constructions'
import CardDetails from '@/components/landing/Details'

export default async function Details({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const [construction, incidents, user] = await Promise.all([
    getConstructionById(id),
    getIncidentsByConstructionId(Number.parseInt(id)),
    getUser(),
  ])

  return (
    <CardDetails
      construction={construction}
      incidents={incidents}
      user={user}
    />
  )
}
