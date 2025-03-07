'use client'

import useUser from '@/hooks/use-user'
import cleanEnergy from '@/public/images/constru.webp'
import Image from 'next/image'
import SearchBar from './SearchBar'

export default function HeroBanner() {
  const { favorites } = useUser()

  return (
    <div className="relative w-full h-[25rem]">
      <Image
        src={cleanEnergy}
        alt="Banner image of a bridge"
        fill
        objectFit="cover"
        priority
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="w-full max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            Busca tu obra
          </h1>

          <SearchBar favorites={favorites} />
        </div>
      </div>
    </div>
  )
}
