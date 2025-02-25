import getUser from '@/actions/auth'
import { getConstructions } from '@/actions/constructions'
import cleanEnergy from '@/public/images/constru.jpg'
import Image from 'next/image'
import SearchBar from './SearchBar'

export default async function HeroBanner() {
  const [constructions, user] = await Promise.all([
    getConstructions(),
    getUser(),
  ])
  const favorites = user?.user_metadata.favorites || []
  return (
    <div className="relative w-full h-[25rem]">
      <Image
        src={cleanEnergy}
        alt="Banner image of a bridge"
        fill
        objectFit="cover"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="w-full max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            Busca tu obra
          </h1>

          <SearchBar constructions={constructions} favorites={favorites}/>
        </div>
      </div>
    </div>
  )
}
