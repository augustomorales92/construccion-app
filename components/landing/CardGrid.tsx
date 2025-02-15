'use client'

import { getConstructions } from '@/actions/constructions'
import { useEffect, useState } from 'react'
import Card from './Card'
import PasswordModal from './PasswordModal'
import { Construction } from './types'

export default function CardGrid() {
  const [selectedCard, setSelectedCard] = useState<Construction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cards, setCards] = useState<Construction[]>([])

  useEffect(() => {
    const fetchCards = async () => {
      const initialCards = await getConstructions()
      setCards(initialCards)
    }

    fetchCards()
  }, [])

  const handleCardClick = (card: Construction) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }

  return (
    <div className=" container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card
            key={card.id}
            construction={card}
            onClick={() => handleCardClick(card)}
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
