import getUser from '@/actions/auth'
import {
  getConstructions,
  getFavoriteConstructions,
} from '@/actions/constructions'
import CardGrid from '@/components/landing/CardGrid'
import HeroBanner from '@/components/landing/HeroBanner'
import { Suspense } from 'react'

export default async function Home() {

  const [constructions, user, favoritesConstructions] = await Promise.all([
    getConstructions(),
    getUser(),
    getFavoriteConstructions(),
  ])
  
  const favorites = user?.user_metadata.favorites || []
  return (
    <>
      <div className="h-full w-full bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <HeroBanner />
        </Suspense>
        {!!favorites.length && (
          <div className="py-8  mx-auto">
            <div className="flex justify-between items-center mb-4 px-8">
              <h2 className="text-2xl font-bold">Obras Favoritas</h2>
            </div>
            <CardGrid
              constructions={favoritesConstructions}
              favorites={favorites}
            />
          </div>
        )}
        <div>
          <CardGrid constructions={constructions} isBlur />
        </div>
      </div>
    </>
  )
}
