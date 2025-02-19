'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Construction } from '../../lib/types'
import Card from './Card'
import PasswordModal from './PasswordModal'

export default function CardGrid({
  toggle,
  constructions,
  favorites,
  isBlur,
  isAdmin,
}: {
  toggle?: boolean
  constructions: Construction[]
  favorites?: string[]
  isBlur?: boolean
  isAdmin?: boolean
}) {
  const [selectedCard, setSelectedCard] = useState<Construction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const [emblaRef] = useEmblaCarousel({
    slidesToScroll: 1,
    align: 'start',
    containScroll: 'trimSnaps',
  })

  useEffect(() => {
    if (toggle) Cookies.remove('favorite')
  }, [toggle])

  const handleCardClick = (card: Construction) => {
    if (isAdmin) {
      router.push(`/protected/constructions/${card.id}`)
    } else if (favorites?.includes(card.id)) {
      router.push(`/constructions/${card.id}`)
    } else {
      setSelectedCard(card)
      setIsModalOpen(true)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex rounded-xl">
          {constructions.map((card) => (
            <div
              key={card.id}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_33.33%] pl-4 first:pl-0 rounded-xl p-2"
            >
              <Card
                construction={card}
                onClick={() => !isBlur && handleCardClick(card)}
                isFavorite={favorites?.includes(card.id)}
                isBlur={isBlur}
              />
            </div>
          ))}
        </div>
      </div>
      {selectedCard && (
        <PasswordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          card={selectedCard}
        />
      )}
    </div>
  )
}
