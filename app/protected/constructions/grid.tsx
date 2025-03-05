'use client'

import Card from '@/components/landing/Card'
import { Construction } from '@/lib/types'
import useEmblaCarousel from 'embla-carousel-react'
import { useRouter } from 'next/navigation'

export default function Grid({
  constructions,
}: {
  constructions?: Construction[] | null
}) {
  const router = useRouter()

  const [_emblaRef] = useEmblaCarousel({
    slidesToScroll: 1,
    align: 'start',
    containScroll: 'trimSnaps',
  })

  const handleCardClick = (card: Construction) => {
    router.push(`/protected/constructions/${card.id}`)
  }

  return (
    <div className=" py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {constructions?.map((card) => (
        <div key={card.id}>
          <Card construction={card} onClick={() => handleCardClick(card)} />
        </div>
      ))}
    </div>
  )
}
