import { getProjectById } from '@/actions/constructions'
import CardDetails from '@/components/landing/Details'
import { notFound } from 'next/navigation'

export default async function Details({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const data = await getProjectById(params)

  if (data?.project === null) {
    notFound()
  }

  return <CardDetails construction={data?.project} />
}
