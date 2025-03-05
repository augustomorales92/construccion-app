import {
  getConstructionById,
  getIncidentsByConstructionId,
} from '@/actions/constructions'
import CardDetails from '@/components/landing/Details'
import { notFound } from 'next/navigation'

export default async function Details({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  let construction = null
  let incidents = null

  if (id !== 'new') {
    ;[construction, incidents] = await Promise.all([
      getConstructionById(id),
      getIncidentsByConstructionId(Number.parseInt(id)),
    ])
    if (!construction) {
      notFound()
    }
  }

  return <CardDetails construction={construction} incidents={incidents} />
}
