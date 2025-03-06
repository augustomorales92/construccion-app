'use client'

import { updateProfileAction } from '@/actions/auth'
import { FormMessage, type Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useUser from '@/hooks/use-user'
import Link from 'next/link'
import { useActionState } from 'react'



export function ProfileForm() {
  const { user } = useUser()
  const updateProfile = updateProfileAction.bind(null, user?.id as string)
  const [state, formAction] = useActionState(updateProfile, null)

  return (
    <form
      action={formAction}
      className="flex flex-col w-full gap-2 [&>input]:mb-4"
    >
      <Label htmlFor="name">Nombre</Label>
      <Input
        type="text"
        name="name"
        placeholder="Tu nombre"
        defaultValue={/* user?.name || */ ''}
        required
      />
      <Label htmlFor="email">Email</Label>
      <Input
        type="email"
        name="email"
        placeholder="tu@email.com"
        defaultValue={user?.email || ''}
        required
      />
      <Label htmlFor="phone">Teléfono</Label>
      <Input
        type="tel"
        name="phone"
        placeholder="+34600000000"
        defaultValue={user?.phone || ''}
        required
      />
      <SubmitButton>Actualizar perfil</SubmitButton>
      {state && <FormMessage message={state as Message} />}
      <div className="mt-4">
        <Link href="/protected/reset-password">
          <Button variant="outline" className="w-full">
            Cambiar contraseña
          </Button>
        </Link>
      </div>
    </form>
  )
}
