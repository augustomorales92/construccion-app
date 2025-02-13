import Image from "next/image"
import { CardType } from "./types"

  
interface CardProps {
    card: CardType
    onClick: () => void
  }
export default function Card({ card, onClick }: CardProps) {
  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden cursor-pointer" onClick={onClick}>
      <div className="relative h-48">
        <Image src={card.image || "/placeholder.svg"} alt={card.title} layout="fill" objectFit="cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
        <p className="text-muted-foreground">{card.description}</p>
      </div>
    </div>
  )
}