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
  const [construction, incidents] = await Promise.all([
    getConstructionById(Number.parseInt(id)),
    getIncidentsByConstructionId(Number.parseInt(id)),
  ])

  return <CardDetails construction={construction} incidents={incidents} />
}
