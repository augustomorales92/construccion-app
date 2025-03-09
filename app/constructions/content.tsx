'use client'

import CardDetails from '@/components/landing/Details'
import { Construction } from '@/lib/types'
import { useState } from 'react'

type Props = {
  showPasswordModal?: boolean
  project?: Construction
  isFavorite?: boolean
}

export default function ClientContent({
  project,
  isFavorite,
  showPasswordModal,
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
