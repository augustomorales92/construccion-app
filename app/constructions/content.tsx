'use client'

import { getProjectById } from '@/actions/constructions'
import CardDetails from '@/components/landing/Details'
import CardDetailSkeleton from '@/components/skeletons/card-detail'
import useUser from '@/hooks/use-user'
import useFetchQuery from '@/hooks/useFetchQuery'
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
    () => getProjectById(id),
    { staleTime: Infinity },
  )

  useEffect(() => {
    if (isLoading || isAdmin) return

    const hasPasswordCookie = Cookies.get(`password_${id}`) === 'true'
    const isCorrectPassword = password === data?.accessCode

    if (isCorrectPassword) {
      Cookies.set(`password_${id}`, 'true', { expires: 1 })
    }

    const hasAccess = 
      (user && isFavorite) ||
      isCorrectPassword ||
      hasPasswordCookie

    if (!hasAccess) {
      if (!hasPasswordCookie && data?.accessCode) {
        setShowPasswordModal(true)
      } else {
        router.push(backUrl)
      }
    }
  }, [
    user,
    password,
    data,
    isFavorite,
    isLoading,
    isAdmin,
    router,
    backUrl,
    id
  ])

  if (isLoading) {
    return <CardDetailSkeleton />
  }

  return (
    <>
      <CardDetails
        construction={data}
        isFavorite={isFavorite}
        backUrl={backUrl}
        showPasswordModal={showPasswordModal}
      />
    </>
  )
}
