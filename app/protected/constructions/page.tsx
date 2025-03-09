import { getMyConstructions } from '@/actions/constructions'
import Grid from './grid'
import SearchBar from './SearchBar'

export default async function Constructions() {
  const constructions = await getMyConstructions()

  return (
    <div className="min-h-custom md:h-custom w-full bg-background container">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 md:p-6 gap-4">
        <h2 className="text-2xl font-bold">Mis Obras</h2>
        <SearchBar />
      </div>
      <Grid constructions={constructions} />
    </div>
  )
}
