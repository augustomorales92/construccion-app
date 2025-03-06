'use client'

import { useUserStore } from '@/store/userStore'
import { User } from '@supabase/supabase-js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

interface UserProviderProps {
  user: User | null
  children: React.ReactNode
}

const queryClient = new QueryClient()

export function UserProvider({
  user: initialUser,
  children,
}: UserProviderProps) {
  const setUser = useUserStore((state) => state.setUser)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else if (initialUser) {
      setUser(initialUser)
    }

    setHydrated(true)
  }, [setUser, initialUser])

  if (!hydrated) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>{children} </QueryClientProvider>
  )
}
