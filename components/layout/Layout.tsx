'use client'

import { signOutAction } from '@/actions/actions'
import { Button } from '@/components/ui/button'
import { User } from '@supabase/supabase-js'
import {
  BrickWall,
  Briefcase,
  ClipboardList,
  HardHat,
  Home,
  Menu,
  MessageSquare,
  User as UserIcon,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ThemeSwitcher } from '../theme-switcher'
import Frame from './navbar'

export default function Layout({
  children,
  user,
}: {
  children: React.ReactNode
  user: User | null
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navItems = user
    ? user.user_metadata.role === 'ADMIN'
      ? [
          {
            href: '/protected',
            label: 'Inicio',
            icon: Home,
          },
          { href: '/protected/constructions', label: 'Obras', icon: Briefcase },
          {
            href: '/protected/history',
            label: 'Historial',
            icon: ClipboardList,
          },
          { href: '/protected/clients', label: 'Clientes', icon: Users },
          { href: '/protected/managers', label: 'Encargados', icon: HardHat },
          { href: '/protected/profile', label: 'Perfil', icon: UserIcon },
        ]
      : [
          {
            href: '/',
            label: 'Inicio',
            icon: Home,
            targetHrefs: ['^/constructions/\\d+$'],
          },
          { href: '/mensajes', label: 'Mensajes', icon: MessageSquare },
          { href: '/protected/profile', label: 'Perfil', icon: UserIcon },
        ]
    : []

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header para desktop */}
      <header className="border-b border-b-foreground/10 shadow-md hidden md:block">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <Link href="/" className="flex gap-2 items-center" prefetch={true}>
            <BrickWall className="w-7 h-7" />
            <span className="text-lg">Busca tu obra</span>
          </Link>
          <nav className="flex space-x-4 items-center">
            {!user ? (
              <div className="flex gap-2">
                <Button asChild size="sm" variant={'default'}>
                  <Link href="/sign-in" prefetch={true}>
                    Iniciar sesión
                  </Link>
                </Button>
                <Button asChild size="sm" variant={'default'}>
                  <Link href="/sign-up" prefetch={true}>
                    Registrate
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <Frame tabs={navItems} />

                <form action={signOutAction}>
                  <Button type="submit" variant="ghost" size="sm">
                    Cerrar sesión
                  </Button>
                </form>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Header para móvil */}
      <header className="border-b border-b-foreground/10 shadow-md md:hidden">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <Link href="/" className="flex gap-2 items-center" prefetch={true}>
            <BrickWall className="w-4 h-4" />
            <span className="text-sm">Busca tu obra</span>
          </Link>
          {user ? (
            <Button
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-gray-700"
              variant="ghost"
              size="icon"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button asChild size="sm" variant={'default'} className="h-8">
                <Link href="/sign-in" prefetch={true} className="px-1">
                  <span className="text-xs">Iniciar sesión</span>
                </Link>
              </Button>
              <Button asChild size="sm" variant={'default'} className="h-8">
                <Link href="/sign-up" prefetch={true} className="px-1 h-6">
                  <span className="text-xs">Registrate</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Menú móvil */}
      {isMobileMenuOpen && user && (
        <nav className="shadow-md md:hidden fixed top-[64px] left-0 right-0 z-50">
          <div className="px-1 mx-auto bg-background flex flex-col">
            <Frame tabs={navItems} isMobile />
            <div className="px-4 py-2">
              <form action={signOutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  Cerrar sesión
                </Button>
              </form>
            </div>
          </div>
        </nav>
      )}

      {/* Contenido principal */}
      <main className="w-full flex flex-col min-h-custom items-center">
        <div className="flex-grow w-full overflow-auto">{children}</div>
      </main>

      {/* Footer */}
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 h-16">
        <p>© 2023 ConstructApp. Todos los derechos reservados.</p>
        <ThemeSwitcher />
      </footer>
    </div>
  )
}
