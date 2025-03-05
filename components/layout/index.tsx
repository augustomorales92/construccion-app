import getUser from '@/actions/auth'
import { UserProvider } from '@/contexts/session'
import Layout from './Layout'

interface Props {
  children: React.ReactNode
}

export default async function LayoutPage({ children }: Props) {
  const user = await getUser()

  return (
    <UserProvider user={user}>
      <Layout>{children}</Layout>
    </UserProvider>
  )
}
