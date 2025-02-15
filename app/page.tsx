'use client'

import CardGrid from '@/components/landing/CardGrid'
import FavoriteWorks from '@/components/landing/FavoriteWorks'
import HeroBanner from '@/components/landing/HeroBanner'
import { Suspense } from 'react'

export default function Home() {
  return (
    <>
      <div className="min-h-screen w-full bg-background">
        <HeroBanner />
        <FavoriteWorks />
        <Suspense fallback={<div>Loading...</div>}>
          <CardGrid />
        </Suspense>
      </div>
    </>
  )
}
