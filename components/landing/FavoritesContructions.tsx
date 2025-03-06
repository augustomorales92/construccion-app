'use client'

import { getFavoriteProjects } from '@/actions/constructions'
import useUser from '@/hooks/use-user'
import useFetchQuery from '@/hooks/useFetchQuery'
import CardGridSkeleton from '../skeletons/card-grid'
import CardGrid from './CardGrid'

export default function FavoritesContructions() {
  const { user, favorites } = useUser()
  const { data, isLoading } = useFetchQuery(
    ['constructions', favorites],
    () => getFavoriteProjects(favorites),
    {
      staleTime: 5 * 60 * 1000,
    },
  )

  if (!isLoading && (!favorites?.length || !data?.length)) return null

  return (
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
}
