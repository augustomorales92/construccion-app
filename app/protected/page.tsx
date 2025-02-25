import getUser from '@/actions/auth'
import ReportsPage from '@/components/reports'
import { InfoIcon } from 'lucide-react'

import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const [user] = await Promise.all([getUser()])

  if (!user) {
    return redirect('/sign-in')
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 min-h-custom md:h-custom h-full">
      <ReportsPage />
    </div>
  )
}
