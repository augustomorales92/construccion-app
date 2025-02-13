"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardType } from "./types"

interface PasswordModalProps {
    isOpen: boolean
    onClose: () => void
    card: CardType
  }

export default function PasswordModal({ isOpen, onClose, card }: PasswordModalProps) {
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Aquí puedes agregar la lógica para verificar la contraseña
    console.log("Contraseña ingresada:", password)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ingrese la contraseña para ver {card.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <DialogFooter>
            <Button type="submit">Acceder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

