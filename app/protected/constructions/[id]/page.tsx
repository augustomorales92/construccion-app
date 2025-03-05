import getUser from '@/actions/auth'
import {
  getConstructionById,
  getIncidentsByConstructionId,
} from '@/actions/constructions'
import CardDetails from '@/components/landing/Details'
import { notFound, redirect } from 'next/navigation'

export default async function Details({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [user, param] = await Promise.all([getUser(), params])
  const id = param.id

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

  const isFavorite = user?.user_metadata.favorites?.includes(id)
  if (user && user.user_metadata.role !== 'ADMIN' && !isFavorite) {
    return redirect('/')
  }

  return (
    <CardDetails
      construction={construction}
      incidents={incidents}
      isFavorite={isFavorite}
    />
  )
}
