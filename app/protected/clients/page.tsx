import { handleSSRQueries } from '@/actions/auth'
import { getCustomers } from '@/actions/people'
import Customers from './content'

async function Content() {
  const customers = await handleSSRQueries(getCustomers)

  return <Customers customers={customers?.data} />
}

export default function Page() {
  return <Content />
}
