'use client'

import CardDetails from '@/components/landing/Details'
import CardDetailSkeleton from '@/components/skeletons/card-detail'
import useUser from '@/hooks/use-user'
import useFetchQuery from '@/hooks/useFetchQuery'
import { getConstructionById } from '@/services/projects'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  password?: string
  id: string
}

export default function Content({ id, password }: Props) {
  const router = useRouter()
  const { user, favorites, isAdmin } = useUser()
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const isFavorite = favorites.includes(id)
  const backUrl = '/'
  
  const { data, isLoading } = useFetchQuery(
    ['construction', id],
    () => getConstructionById(id),
    { staleTime: Infinity },
  )

  useEffect(() => {
    if (!isLoading) {
      const hasPasswordCookie = Cookies.get(`password_${id}`) === 'true'
      const isCorrectPassword =
        user || password === data?.construction?.password

      if (isCorrectPassword) {
        Cookies.set(`password_${id}`, 'true', { expires: 1 })
      }

      const isIncorrectPassword =
        !user && password !== data?.construction?.password

      if (user) {
        const isAdmin = user.user_metadata.role === 'ADMIN'
        if (!isAdmin && (isIncorrectPassword || !isFavorite)) {
          router.push(backUrl)
        }
      } else {
        if (isIncorrectPassword) {
          router.push(backUrl)
        }
      }

      if (
        !hasPasswordCookie &&
        !isAdmin &&
        !isFavorite &&
        isIncorrectPassword
      ) {
        setShowPasswordModal(true)
      }
    }
  }, [user, password, data, isFavorite, isLoading, router, backUrl, id])

  if (isLoading) {
    return <CardDetailSkeleton />
  }

  return (
    <>
      <CardDetails
        construction={data?.construction}
        incidents={data?.incidents}
        isFavorite={isFavorite}
        backUrl={backUrl}
        showPasswordModal={showPasswordModal}
      />
    </>
  )
}
