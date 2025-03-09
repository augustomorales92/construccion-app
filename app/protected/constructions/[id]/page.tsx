import { getProjectById } from '@/actions/constructions'
import CardDetails from '@/components/landing/Details'
import { notFound } from 'next/navigation'

export default async function Details({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const data = await getProjectById(id)

  if (data?.project === null) {
    notFound()
  }

  return <CardDetails construction={data?.project} />
}
