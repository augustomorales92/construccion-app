import { cookies } from 'next/headers'
import Content from '../content'

export default async function Details({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [urlParams, cookieStore] = await Promise.all([params, cookies()])
  const id = urlParams.id
  const password = cookieStore.get('password')?.value

  return <Content id={id} password={password} />
}
