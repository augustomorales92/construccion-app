import getUser from '@/actions/auth'
import Layout from './Layout'

interface Props {
  children: React.ReactNode
}

export default async function LayoutPage({ children }: Props) {
  const user = await getUser()
  return <Layout user={user}>{children}</Layout>
}
