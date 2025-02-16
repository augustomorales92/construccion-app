'use client'

import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Card from './Card'
import PasswordModal from './PasswordModal'
import { Construction } from './types'

export default function CardGrid({
  toggle,
  constructions,
  favorites,
  isBlur,
}: {
  toggle?: boolean
  constructions: Construction[]
  favorites?: string[]
  isBlur?: boolean
}) {
  const [selectedCard, setSelectedCard] = useState<Construction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (toggle) Cookies.remove('favorite')
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
    <div className=" container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {constructions.map((card) => (
          <Card
            key={card.id}
            construction={card}
            onClick={() => !isBlur && handleCardClick(card)}
            isFavorite={favorites?.includes(card.id)}
            isBlur={isBlur}
          />
        ))}
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
