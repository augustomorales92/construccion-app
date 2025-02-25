"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"

interface Report {
  id: string
  fecha: string
  tipo: "diario" | "quincenal"
  contenido: string
  estado: "pendiente" | "aprobado" | "rechazado"
  autor: string
}

interface EditReportDialogProps {
  report: Report
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (report: Report) => void
}

export function EditReportDialog({ report, open, onOpenChange, onUpdate }: EditReportDialogProps) {
  const [contenido, setContenido] = useState(report.contenido)

  const handleSubmit = () => {
    onUpdate({
      ...report,
      contenido,
      estado: "pendiente", // Vuelve a estado pendiente para nueva revisión
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar {report.tipo === "diario" ? "Reporte" : "Certificado"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="autor" className="text-sm font-medium">
              Autor
            </Label>
            <p id="autor" className="text-xs md:text-sm text-muted-foreground">
              {report.autor}
            </p>
          </div>
          <div>
            <Label htmlFor="fecha" className="text-sm font-medium">
              Fecha
            </Label>
            <p id="fecha" className="text-xs md:text-sm text-muted-foreground">
              {report.fecha}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contenido" className="text-sm font-medium">
              Contenido
            </Label>
            <Textarea
              id="contenido"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="text-xs md:text-sm"
              rows={5}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="text-xs md:text-sm">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="text-xs md:text-sm">
              <CheckCircle className="mr-2 h-4 w-4" />
              Enviar a revisión
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

