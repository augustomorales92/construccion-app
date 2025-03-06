import { useUserStore } from '@/store/userStore'

export default function useUser() {
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)

  const isAdmin = user?.user_metadata?.role === 'ADMIN'
  const favorites = user?.user_metadata?.favorites || []

  return { user, setUser, isAdmin, favorites }
}
