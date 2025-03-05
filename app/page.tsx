import CardGrid from '@/components/landing/CardGrid'
import FavoritesContructions from '@/components/landing/FavoritesContructions'
import HeroBanner from '@/components/landing/HeroBanner'
import { getMockedConstructions } from '@/lib/utils'
import { Suspense } from 'react'

export default function Home() {
  const constructions = getMockedConstructions()
  return (
    <>
      <div className="h-full w-full bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <HeroBanner />
        </Suspense>
        <FavoritesContructions />
        <div className="py-8 mx-auto container">
          <CardGrid constructions={constructions} isBlur />
        </div>
      </div>
    </>
  )
}
