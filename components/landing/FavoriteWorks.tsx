'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import Card from './Card'
import { Construction } from './types'

export default function FavoriteWorks() {
  const [favoriteCards, setFavoriteCards] = useState<Construction[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Obras Favoritas</h2>
        <Button variant="outline" onClick={toggleExpand}>
          {isExpanded ? 'Ocultar' : 'Mostrar'}
        </Button>
      </div>
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCards.length > 0 ? (
            favoriteCards.map((card) => (
              <Card key={card.id} construction={card} onClick={() => {}} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No tienes obras favoritas aún.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
