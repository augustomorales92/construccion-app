'use client'

import { signOutAction } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { User } from '@supabase/supabase-js'
import {
  BrickWall,
  Briefcase,
  Home,
  Menu,
  MessageSquare,
  User as UserIcon,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeSwitcher } from '../theme-switcher'
import Frame from './navbar'

const NavItem = ({
  href,
  children,
  isMobile = false,
  onClick = () => {},
}: {
  href: string
  children: React.ReactNode
  isMobile?: boolean
  onClick?: () => void
}) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`flex ${isActive && 'bg-slate-500 dark:bg-slate-100/50 text-background'} h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50`}
      onClick={onClick}
      prefetch={true}
    >
      {children}
    </Link>
  )
}

export default function Layout({
  children,
  user,
}: {
  children: React.ReactNode
  user: User | null
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const navItems = user
    ? user.role === 'ADMIN'
      ? [
          { href: '/home', label: 'Inicio', icon: Home },
          { href: '/obras', label: 'Obras', icon: Briefcase },
          { href: '/mensajes', label: 'Mensajes', icon: MessageSquare },
          { href: '/clientes', label: 'Clientes', icon: Users },
          { href: '/perfil', label: 'Perfil', icon: UserIcon },
        ]
      : [
          { href: '/', label: 'Inicio', icon: Home },
          { href: '/mensajes', label: 'Mensajes', icon: MessageSquare },
          { href: '/perfil', label: 'Perfil', icon: UserIcon },
        ]
    : []

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header para desktop */}
      <header className="border-b border-b-foreground/10 shadow-md hidden md:block">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex gap-2 items-center" prefetch={true}>
            <BrickWall className="w-7 h-7" />
            <span className="text-lg">Busca tu obra</span>
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
