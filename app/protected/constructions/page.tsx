import getUser from '@/actions/auth'
import { getMyConstructions } from '@/actions/constructions'
import CardGrid from '@/components/landing/CardGrid'
import SearchBar from '@/components/landing/SearchBar'
import { Suspense } from 'react'

export default async function Constructions() {
  const [constructions, user] = await Promise.all([
    getMyConstructions(),
    getUser(),
  ])
  const isAdmin = user?.user_metadata.role === 'ADMIN'
  return (
    <div className="min-h-custom md:h-custom w-full bg-background">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 md:p-6 gap-4">
        <h2 className="text-2xl font-bold">Mis Obras</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <SearchBar constructions={constructions} />
        </Suspense>
      </div>
      <CardGrid constructions={constructions} isAdmin={isAdmin} />
    </div>
  )
}
