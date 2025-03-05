import { redirect } from 'next/navigation'

export default function Redirect({ url }: { url?: string }) {
  return redirect(url ?? '/')
}
