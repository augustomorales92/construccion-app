'use client'

import { useUserStore } from '@/store/userStore'
import { User } from '@supabase/supabase-js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'

interface UserProviderProps {
  user: User | null
  children: React.ReactNode
}

const queryClient = new QueryClient()

export function UserProvider({ user, children }: UserProviderProps) {
  const setUser = useUserStore((state) => state.setUser)

  useEffect(() => {
    if (user) {
      setUser(user)
    } else {
      setUser(null)
    }
  }, [user, setUser])

  return (
    <QueryClientProvider client={queryClient}>{children} </QueryClientProvider>
  )
}
