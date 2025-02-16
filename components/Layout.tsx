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
import { ThemeSwitcher } from './theme-switcher'

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
      className={`flex items-center p-2 ${
        isActive ? 'text-blue-600 ' : 'text-gray-700 dark:text-gray-200'
      } hover:bg-background/20 rounded-md ${isMobile ? 'text-lg' : ''}`}
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
          { href: '/obras', label: 'Inicio', icon: Home },
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
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    isMobile
                    onClick={toggleMobileMenu}
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    {item.label}
                  </NavItem>
                ))}
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
        <nav className=" shadow-md md:hidden fixed top-[64px] left-0 right-0 z-50">
          <div className="container mx-auto px-4 py-2 bg-background">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                isMobile
                onClick={toggleMobileMenu}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.label}
              </NavItem>
            ))}
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="sm">
                Cerrar sesión
              </Button>
            </form>
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
