'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Construction } from '@/lib/types'
import { Heart } from 'lucide-react'
import Image from 'next/image'

interface CardProps {
  construction: Construction
  onClick: () => void
  isFavorite?: boolean
  isBlur?: boolean
}

export default function CardComponent({
  construction,
  onClick,
  isFavorite,
  isBlur,
}: CardProps) {
  return (
    <Card
      className={`overflow-hidden shadow-md shadow-current ${isBlur ? 'blur-sm' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="p-0 relative">
        <div className="relative w-full h-48">
          <Image
            src={construction.images[0] || '/images/placeholder.svg'}
            alt={`Imagen de ${construction.name}`}
            fill
            objectFit="cover"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
          />
        </div>
        {isFavorite && (
          <div className="absolute top-2 right-4">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl mb-2">{construction.name}</CardTitle>
        <p>
          <strong>Cliente:</strong> {construction.customer?.name}
        </p>
        <div className="mt-2">
          <p className="font-bold">Avance:</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${construction.progressTotal}%`,
              }}
              role="progressbar"
              aria-valuenow={construction.progressTotal || 0}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          <p>{construction.progressTotal?.toFixed(2)}% completado</p>
        </div>
        <p>
          <strong>Presupuesto:</strong> ${construction.budget?.toLocaleString()}
        </p>
        <p>
          <strong>Tiempo estimado:</strong> {construction.estimatedTime}
        </p>
      </CardContent>
    </Card>
  )
}
