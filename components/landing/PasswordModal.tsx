'use client'

import { verifyPassword } from '@/actions/constructions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Construction } from './types'

interface PasswordModalProps {
  isOpen: boolean
  onClose: () => void
  card: Construction | null
}

export default function PasswordModal({
  isOpen,
  onClose,
  card,
}: PasswordModalProps) {
  const [password, setPassword] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockExpiration, setBlockExpiration] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedAttempts = localStorage.getItem(`attempts_${card?.id}`)
    const storedBlockExpiration = localStorage.getItem(
      `blockExpiration_${card?.id}`,
    )

    if (storedAttempts) setAttempts(Number.parseInt(storedAttempts))
    if (storedBlockExpiration) {
      const expiration = Number.parseInt(storedBlockExpiration)
      if (Date.now() < expiration) {
        setIsBlocked(true)
        setBlockExpiration(expiration)
      } else {
        localStorage.removeItem(`blockExpiration_${card?.id}`)
        localStorage.removeItem(`attempts_${card?.id}`)
      }
    }
  }, [card?.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isBlocked) return

    try {
      const response = await verifyPassword(card?.id, password)

      if (response) {
        onClose()
        Cookies.set('password', password)
        router.push(`/constructions/${card?.id}`)
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        localStorage.setItem(`attempts_${card?.id}`, newAttempts.toString())

        if (newAttempts >= 3) {
          const expiration = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
          setIsBlocked(true)
          setBlockExpiration(expiration)
          localStorage.setItem(
            `blockExpiration_${card?.id}`,
            expiration.toString(),
          )
        }

        setPassword('')
        toast.error('Contraseña incorrecta. Intente nuevamente.')
      }
    } catch (error) {
      console.error('Error al verificar la contraseña:', error)
    }
  }

  const remainingTime = blockExpiration
    ? Math.max(0, blockExpiration - Date.now())
    : 0
  const hours = Math.floor(remainingTime / (1000 * 60 * 60))
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ingrese la contraseña para ver {card?.name}</DialogTitle>
        </DialogHeader>
        {isBlocked ? (
          <p>
            Acceso bloqueado. Intente nuevamente en {hours} horas y {minutes}{' '}
            minutos.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
            />
            <p className="text-sm text-gray-500 mb-4">
              Intentos restantes: {3 - attempts}
            </p>
            <DialogFooter>
              <Button type="submit" disabled={isBlocked}>
                Acceder
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
