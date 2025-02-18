import getUser, { toggleFavorite } from '@/actions/auth'
import { getFavoriteConstructions } from '@/actions/constructions'
import CardGrid from '@/components/landing/CardGrid'
import { Button } from '@/components/ui/button'
import { InfoIcon } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const [user, toggle, constructions] = await Promise.all([
    getUser(),
    toggleFavorite(),
    getFavoriteConstructions(),
  ])

  if (!user) {
    return redirect('/sign-in')
  }

  const favorites = user.user_metadata.favorites || []
  const isAdmin = user.user_metadata.role === 'ADMIN'

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className=" container flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
        {isAdmin && (
          <Link href="/protected/create-project">
            <Button variant={'default'}>Crear Obra</Button>
          </Link>
        )}
      </div>

      <CardGrid
        toggle={toggle}
        constructions={constructions}
        favorites={favorites}
      />
    </div>
  )
}
