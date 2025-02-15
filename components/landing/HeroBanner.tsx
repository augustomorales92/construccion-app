"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import cleanEnergy from "@/public/images/constru.jpg"
import Form from 'next/form'
import Image from "next/image"


export default function HeroBanner() {

  return (
    <div className="relative w-full h-[400px]">
      <Image
        src={cleanEnergy}
        alt="Banner image of a bridge"
        fill
        objectFit="cover"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="w-full max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">Busca tu obra</h1>
            <Form action='' className="w-full flex gap-2">
            <Input
              type="search"
              placeholder="Buscar obras..."
              className="flex-grow w-full"
              name="query"
           
              />
            <Button type="submit" variant="secondary">
              Buscar
            </Button>
              </Form>
        </div>
      </div>
    </div>
  )
}


