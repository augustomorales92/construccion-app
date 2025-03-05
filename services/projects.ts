import { constructions, sampleIncidents } from '@/lib/constants'
import { Construction, Incidents } from '@/lib/types'
//import axios from 'axios'

interface ConstructionByIdResponse {
  construction: Construction | null
  incidents: Incidents[] | null
}

export const getConstructionById = async (
  id: string,
): Promise<ConstructionByIdResponse | null> => {
  const construction =
    constructions.find((construction) => construction.id === id) || null
  const incidents = sampleIncidents
  return { construction, incidents }
  /*  try {
    const data = await axios.get(`api/projects/${id}`)
    return data
  } catch (error) {
    console.error(error)
    return null
  } */
}

export const getConstructionsByQuery = async (
  query: string,
): Promise<Construction[]> => {
  return constructions.filter((construction) =>
    construction.name.toLowerCase().includes(query.toLowerCase()),
  )
/*   try {
    const data = await axios.get(`api/projects?query=${query}`)
    return data
    return null
  } catch (error) {
    console.error(error)
    return null
  } */
}

export async function getFavoriteConstructions(favorites: string[]) {
  return constructions.filter((construction) =>
    favorites.includes(construction.id),
  )

  /*   try {
    const data = await axios.get(`api/projects/favorites`)
    return data
    return null
  } catch (error) {
    console.error(error)
    return null
  } */
}