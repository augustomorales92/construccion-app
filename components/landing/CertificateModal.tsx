'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Certificates } from '@/lib/types'

interface CertificadoModalProps {
  isOpen: boolean
  onClose: () => void
  certificate?: Certificates | null
}

export default function CertificateModal({
  isOpen,
  onClose,
  certificate,
}: CertificadoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle>Certificado</DialogTitle>
      <DialogContent>{JSON.stringify(certificate)}</DialogContent>
    </Dialog>
  )
}
