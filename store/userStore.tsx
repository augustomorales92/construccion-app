import { User } from '@supabase/supabase-js'
import { create } from 'zustand'

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => {
    set({ user })
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user))
    } else {
      sessionStorage.removeItem('user')
    }
  },
}))

export { useUserStore }
