'use client'

import { getProjectById } from '@/actions/constructions'
import CardDetails from '@/components/landing/Details'
import CardDetailSkeleton from '@/components/skeletons/card-detail'
import useUser from '@/hooks/use-user'
import useFetchQuery from '@/hooks/useFetchQuery'
import { Construction } from '@/lib/types'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  showPasswordModal?: boolean
  project?: Construction
  isFavorite?: boolean  
}

export default function ClientContent({
  project,
  isFavorite,
  showPasswordModal
}: Props) {
  const [showModal, setShowPasswordModal] = useState(showPasswordModal)
  return (
    <CardDetails
      construction={project}
      isFavorite={isFavorite}
      backUrl="/"
      showPasswordModal={showModal}
      closePasswordModal={() => setShowPasswordModal(false)}
    />
  )
}