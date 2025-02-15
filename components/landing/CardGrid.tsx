'use client'

import { getConstructions } from '@/actions/constructions'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Card from './Card'
import PasswordModal from './PasswordModal'
import { Construction } from './types'

export default function CardGrid() {
  const [selectedCard, setSelectedCard] = useState<Construction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cards, setCards] = useState<Construction[]>([])
  const [filteredCards, setFilteredCards] = useState<Construction[]>([])
  const params = useSearchParams()

  const searchQuery = params.get('query') || ''

  useEffect(() => {
    const fetchCards = async () => {
      const initialCards = await getConstructions()
      setCards(initialCards)
      setFilteredCards(initialCards) // Initialize filteredCards with all cards
    }

    fetchCards()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = cards.filter(
        (card) =>
          card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredCards(filtered)
    } else {
      // If searchQuery is empty, reset filteredCards to all cards
      setFilteredCards(cards)
    }
  }, [searchQuery, cards])

  const handleCardClick = (card: Construction) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }

  return (
    <div className=" container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
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
