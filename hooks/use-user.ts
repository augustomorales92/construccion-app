import { useUserStore } from '@/store/userStore'

export default function useUser() {
  const { user, setUser } = useUserStore()

  const isAdmin = user?.user_metadata.role === 'ADMIN'
  const favorites = user?.user_metadata.favorites || []

  return { user, setUser, isAdmin, favorites }
}
