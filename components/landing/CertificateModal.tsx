"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

interface CertificadoModalProps {
  isOpen: boolean
  onClose: () => void
  onCertificateAdded: (certificate: { id: number; avance: number; montoGastado: number; archivo: string }) => void
}

export default function CertificateModal({ isOpen, onClose, onCertificateAdded }: CertificadoModalProps) {
  const [avance, setAvance] = useState("")
  const [montoGastado, setMontoGastado] = useState("")
  const [archivo, setArchivo] = useState<File | null>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setArchivo(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (avance && montoGastado && archivo) {
      onCertificateAdded({
        id: Date.now(),
        avance: Number.parseFloat(avance),
        montoGastado: Number.parseFloat(montoGastado),
        archivo: URL.createObjectURL(archivo),
      })
      setAvance("")
      setMontoGastado("")
      setArchivo(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Certificado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="avance">Avance (%)</Label>
            <Input id="avance" type="number" value={avance} onChange={(e) => setAvance(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="montoGastado">Monto Gastado</Label>
            <Input
              id="montoGastado"
              type="number"
              value={montoGastado}
              onChange={(e) => setMontoGastado(e.target.value)}
              required
            />
          </div>
          <div
            className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Input id="archivo" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
            <Label htmlFor="archivo" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1">Arrastra y suelta un PDF aquí, o haz clic para seleccionar</p>
            </Label>
            {archivo && <p className="mt-2 text-sm text-gray-500">{archivo.name}</p>}
          </div>
          <Button type="submit" className="w-full">
            Agregar Certificado
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

