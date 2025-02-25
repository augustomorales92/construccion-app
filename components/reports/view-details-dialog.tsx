import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

interface ViewDetailsDialogProps {
  report: {
    id: string
    fecha: string
    tipo: "diario" | "quincenal"
    contenido: string
    estado: "pendiente" | "aprobado" | "rechazado"
    autor: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: (id: string, status: "aprobado" | "rechazado") => void
}

export function ViewDetailsDialog({ report, open, onOpenChange, onUpdateStatus }: ViewDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalles del {report.tipo === "diario" ? "Reporte" : "Certificado"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Fecha</h4>
            <p className="text-sm text-muted-foreground">{report.fecha}</p>
          </div>
          <div>
            <h4 className="font-medium">Autor</h4>
            <p className="text-sm text-muted-foreground">{report.autor}</p>
          </div>
          <div>
            <h4 className="font-medium">Contenido</h4>
            <p className="text-sm text-muted-foreground">{report.contenido}</p>
          </div>

          {report.estado === "pendiente" && (
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-600 hover:bg-red-50"
                onClick={() => onUpdateStatus(report.id, "rechazado")}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Rechazar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => onUpdateStatus(report.id, "aprobado")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprobar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

