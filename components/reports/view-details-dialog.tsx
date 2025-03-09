import { updateReportStatus } from '@/actions/constructions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle, XCircle } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import type { Report, StatusVariant } from './columns'

interface ViewDetailsDialogProps {
  report: Report
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewDetailsDialog({
  report,
  open,
  onOpenChange,
}: ViewDetailsDialogProps) {
  const isCertificate = 'version' in report
  const [isPending, startTransition] = useTransition()

  const handleStatusUpdate = (id: string, status: StatusVariant) => {
    startTransition(async () => {
      try {
        const result = await updateReportStatus(id, status, isCertificate)

        if (result.success) {
          toast.success(
            `${isCertificate ? 'Certificado' : 'Incidente'} ${
              status === 'APPROVED' ? 'aprobado' : 'rechazado'
            } correctamente`,
          )
          onOpenChange(false)
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error('Error updating report status:', error)
        toast.error(
          'Ocurrió un error al actualizar el estado. Por favor, intente nuevamente.',
        )
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Detalles del {isCertificate ? 'Certificado' : 'Incidente'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Fecha</h4>
            <p className="text-sm text-muted-foreground">
              {report.issuedAt?.toLocaleDateString()}
            </p>
          </div>

          {isCertificate ? (
            <>
              <div>
                <h4 className="font-medium">Versión</h4>
                <p className="text-sm text-muted-foreground">
                  {report.version || 'N/A'}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Monto del Certificado</h4>
                <p className="text-sm text-muted-foreground">
                  {report.certificateAmount || 'N/A'}
                </p>
              </div>
            </>
          ) : (
            <div>
              <h4 className="font-medium">Descripción</h4>
              <p className="text-sm text-muted-foreground">
                {report.description}
              </p>
            </div>
          )}

          {report.status === 'PENDING' && (
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-red-50"
                onClick={() => handleStatusUpdate(report.id, 'REJECTED')}
                disabled={isPending}
              >
                <XCircle className="mr-2 h-4 w-4" />
                {isPending ? 'Procesando...' : 'Rechazar'}
              </Button>
              <Button
                className="bg-green-100 text-green-600 hover:bg-green-600 hover:text-green-100"
                onClick={() => handleStatusUpdate(report.id, 'APPROVED')}
                disabled={isPending}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isPending ? 'Procesando...' : 'Aprobar'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
