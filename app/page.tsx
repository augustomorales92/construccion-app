'use client'

import CardGrid from '@/components/landing/CardGrid'
import FavoriteWorks from '@/components/landing/FavoriteWorks'
import HeroBanner from '@/components/landing/HeroBanner'

export default function Home() {
  return (
    <>
      <div className="min-h-screen w-full bg-background">
        <HeroBanner />
        <FavoriteWorks />
        <CardGrid />
      </div>
    </>
  )
}
