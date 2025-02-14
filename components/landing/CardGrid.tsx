'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Card from './Card'
import PasswordModal from './PasswordModal'
import { CardType } from './types'

const initialCards: CardType[] = [
  {
    id: 1,
    title: 'Card 1',
    description: 'Descripción de la card 1',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 2,
    title: 'Card 2',
    description: 'Descripción de la card 2',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 3,
    title: 'Card 3',
    description: 'Descripción de la card 3',
    image: '/placeholder.svg?height=200&width=300',
  },
  // Añade más cards según sea necesario
]

export default function CardGrid() {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filteredCards, setFilteredCards] = useState(initialCards)
  const params = useSearchParams()

  const searchQuery = params.get('query') || ''

  useEffect(() => {
    if (searchQuery) {
      const filtered = initialCards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredCards(filtered)
    } else {
      setFilteredCards(initialCards)
    }
  }, [searchQuery])

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }

  return (
    <div className=" container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <Card
            key={card.id}
            card={card}
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
