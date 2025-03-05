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
import { Construction } from '../../lib/types'

interface PasswordModalProps {
  isOpen: boolean
  onClose: () => void
  card?: Construction | null
}

const MAX_ATTEMPTS = 3
const BLOCK_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

// Function to get the current date in YYYY-MM-DD format
const getToday = (): string => new Date().toISOString().split('T')[0]

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
    const today = getToday()
    const attemptsKey = `attempts_${today}`
    const blockExpirationKey = `blockExpiration_${today}`

    const storedAttempts = localStorage.getItem(attemptsKey)
    const storedBlockExpiration = localStorage.getItem(blockExpirationKey)

    if (storedAttempts) {
      setAttempts(Number.parseInt(storedAttempts))
    }
    if (storedBlockExpiration) {
      const expiration = Number.parseInt(storedBlockExpiration)
      if (Date.now() < expiration) {
        setIsBlocked(true)
        setBlockExpiration(expiration)
      } else {
        localStorage.removeItem(blockExpirationKey)
        localStorage.removeItem(attemptsKey)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isBlocked) return

    const today = getToday()
    const attemptsKey = `attempts_${today}`
    const blockExpirationKey = `blockExpiration_${today}`

    try {
      const response = await verifyPassword(card?.id, password)

      if (response) {
        onClose()
        Cookies.set('password', password, { expires: 1 })
        router.push(`/constructions/${card?.id}`)
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        localStorage.setItem(attemptsKey, newAttempts.toString())

        if (newAttempts >= MAX_ATTEMPTS) {
          const expiration = Date.now() + BLOCK_DURATION_MS
          setIsBlocked(true)
          setBlockExpiration(expiration)
          localStorage.setItem(blockExpirationKey, expiration.toString())
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
              Intentos restantes: {MAX_ATTEMPTS - attempts}
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
