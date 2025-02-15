import CardGrid from '@/components/landing/CardGrid'
import FavoriteWorks from '@/components/landing/FavoriteWorks'
import HeroBanner from '@/components/landing/HeroBanner'
import { Suspense } from 'react'

export default function Home() {
  return (
    <>
      <div className="min-h-screen w-full bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <HeroBanner />
        </Suspense>
        {false && <FavoriteWorks />}
        <CardGrid />
      </div>
    </>
  )
}
