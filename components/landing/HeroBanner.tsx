"use client"

import { useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface HeroBannerProps {
  onSearch: (query: string) => void
}

export default function HeroBanner({ onSearch }: HeroBannerProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  return (
    <div className="relative w-full h-[400px]">
      <Image
        src="/images/clean-energy.jpg"
        alt="Banner image of a bridge"
        layout="fill"
        objectFit="cover"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="w-full max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">Descubre Obras Increíbles</h1>
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Buscar obras..."
              className="flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch} variant="secondary">
              Buscar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


