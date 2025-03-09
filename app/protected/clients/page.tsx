import { getCustomers } from '@/actions/people'
import Customers from './content'

async function Content() {
  const customers = await getCustomers()
  return <Customers customers={customers.data} />
}

export default function Page() {
  return <Content />
}
