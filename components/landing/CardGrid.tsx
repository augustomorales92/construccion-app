
'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Construction } from '../../lib/types'
import Card from './Card'
import PasswordModal from './PasswordModal'

export default function CardGrid({
  constructions,
  favorites,
  isBlur,
  userLogged,
}: {
  constructions?: Construction[]
  favorites?: string[]
  isBlur?: boolean
  userLogged?: boolean
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
    if (userLogged) Cookies.remove('favorite')
  }, [])

  const handleCardClick = (card: Construction) => {
    if (favorites?.includes(card.id)) {
      router.push(`/constructions/${card.id}`)
    } else {
      setSelectedCard(card)
      setIsModalOpen(true)
    }
  }

  return (
    <div className=" py-8">
      <div className="overflow-hidden rounded-xl p-1" ref={emblaRef}>
        <div className="flex ">
          {constructions?.map((card) => (
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
