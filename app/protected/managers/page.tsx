import { getManagers } from '@/actions/people'
import Managers from './content'

async function Content() {
  const managers = await getManagers()
  return <Managers managers={managers.data} />
}

export default function Page() {
  return <Content />
}
