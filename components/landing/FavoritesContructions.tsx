'use client'

import { getFavoriteProjects } from '@/actions/constructions'
import useUser from '@/hooks/use-user'
import useFetchQuery from '@/hooks/useFetchQuery'
import CardGridSkeleton from '../skeletons/card-grid'
import CardGrid from './CardGrid'

const FavoritesContructions = () => {
  const { user, favorites } = useUser()

  const query = useFetchQuery(
    ['constructions', favorites],
    () => getFavoriteProjects(favorites),
    {
      staleTime: 5 * 60 * 1000,
      enabled: !!user && !!favorites?.length,
    },
  )

  if (!user || !favorites?.length) return null

  return (
    <div className="py-8 mx-auto container">
      <div className="flex justify-between items-center mb-4 px-8">
        <h2 className="text-2xl font-bold">Obras Favoritas</h2>
      </div>
      {query.isLoading ? (
        <CardGridSkeleton count={3} />
      ) : query.data?.length ? (
        <CardGrid
          constructions={query.data}
          favorites={favorites}
          userLogged={!!user}
        />
      ) : null}
    </div>
  )
}

export default FavoritesContructions
