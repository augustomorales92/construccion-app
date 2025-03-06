import { getProjectById } from '@/actions/constructions'
import CardDetails from '@/components/landing/Details'
import { notFound } from 'next/navigation'

export default async function Details({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  let construction = null

  if (id !== 'new') {
    construction = await getProjectById(id)

    if (!construction) {
      notFound()
    }
  }

  return <CardDetails construction={construction} />
}
