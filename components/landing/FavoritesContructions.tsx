'use client'

import useUser from '@/hooks/use-user'
import useFetchQuery from '@/hooks/useFetchQuery'
import { constructions } from '@/lib/constants'
import CardGridSkeleton from '../skeletons/card-grid'
import CardGrid from './CardGrid'

export async function getFavoriteConstructions(favorites: string[]) {
  return constructions.filter((construction) =>
    favorites.includes(construction.id),
  )
}

export default function FavoritesContructions() {
  const { user, favorites } = useUser()
  const { data, isLoading } = useFetchQuery(['constructions', favorites], () =>
    getFavoriteConstructions(favorites),
  )
  return (
    !!favorites.length && (
      <div className="py-8  mx-auto container">
        <div className="flex justify-between items-center mb-4 px-8">
          <h2 className="text-2xl font-bold">Obras Favoritas</h2>
        </div>
        {isLoading ? (
          <CardGridSkeleton count={3} />
        ) : (
          <CardGrid
            constructions={data}
            favorites={favorites}
            userLogged={!!user}
          />
        )}
      </div>
    )
  )
}
