import getUser from '@/actions/auth'
import {
  getConstructionById,
  getIncidentsByConstructionId,
} from '@/actions/constructions'
import CardDetails from '@/components/landing/Details'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Details({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const [construction, incidents, user, cookieStore] = await Promise.all([
    getConstructionById(id),
    getIncidentsByConstructionId(Number.parseInt(id)),
    getUser(),
    cookies(),
  ])

  const password = cookieStore.get('password')?.value
  const isIncorrectPassword = !user && password !== construction?.password
  const isFavorite = user?.user_metadata.favorites?.includes(id)

  if (
    isIncorrectPassword ||
    (user && user.user_metadata.role !== 'ADMIN' && !isFavorite)
  ) {
    return redirect('/')
  }

  return (
    <CardDetails
      construction={construction}
      incidents={incidents}
      user={user}
      isFavorite={isFavorite}
      isIncorrectPassword={isIncorrectPassword}
    />
  )
}
