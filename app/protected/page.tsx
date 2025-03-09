import { handleSSRQueries } from '@/actions/auth'
import { getPendingReports } from '@/actions/constructions'
import ReportsPage from '@/components/reports'
import { Suspense } from 'react'

async function Content() {
  const reports = await handleSSRQueries(getPendingReports)
  return (
    <div className="flex-1 w-full flex flex-col gap-12 h-full">
      <ReportsPage reports={reports} />
    </div>
  )
}

export default function ProtectedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  )
}
