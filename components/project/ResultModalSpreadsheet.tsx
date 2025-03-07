"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProcessedData } from "./types"
import SpreadsheetDialog from "../Spreadsheet"


interface ResultModalProps {
  data: ProcessedData
  isOpen: boolean
  onClose: () => void
}

export default function ResultModalSpreadsheet({ data, isOpen, onClose }: ResultModalProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [spreadsheetData, setSpreadsheetData] = useState<string[][]>([])

  // Convertir los datos procesados al formato que espera SpreadsheetDialog
  useEffect(() => {
    if (data) {
      const rows: string[][] = []

      // Para cada sección, añadir una fila de encabezado y luego los ítems
      Object.entries(data.sections).forEach(([sectionName, { letter, items }]) => {
        // Añadir fila de encabezado de sección
        rows.push([
          letter,
          sectionName,
          "", // UT
          "", // CANT
          "", // PRECIO UNIT
          "", // SUBTOTAL
          "", // ACLM ANT
          "", // ACTUAL
          "", // ACLM
        ])

        // Añadir los ítems de la sección
        items.forEach((item) => {
          rows.push([
            item.code,
            item.description,
            item.unit,
            item.quantity.toString(),
            item.price.toString(),
            item.subtotal.toString(),
            "", // ACLM ANT (vacío por defecto)
            "", // ACTUAL (vacío por defecto)
            "", // ACLM (vacío por defecto)
          ])
        })
      })

      // Añadir fila de total
      rows.push(["", "TOTAL", "", "", "", data.total.toString(), "", "", ""])

      setSpreadsheetData(rows)
    }
  }, [data])

  const handleValidation = (valid: boolean) => {
    setIsValid(valid)
    // Aquí podrías enviar la validación a un servidor si es necesario
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] p-0 overflow-auto">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Resultados de la Conversión</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {isValid === true && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700">¡Datos validados correctamente!</p>
            </div>
          )}

          {isValid === false && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">Se ha marcado que los datos no son correctos.</p>
            </div>
          )}

          {/* Usamos el componente SpreadsheetDialog con los datos procesados */}
          <div className="border border-border bg-background overflow-x-auto">
            <SpreadsheetDialog title="Hoja de Materiales" initialData={spreadsheetData} isAdmin={false} />
          </div>
        </div>

        <DialogFooter className="border-t p-4 flex justify-end space-x-4">
          {isValid === null && (
            <>
              <Button variant="destructive" onClick={() => handleValidation(false)} className="flex items-center">
                <X className="h-4 w-4 mr-2" />
                No es correcto
              </Button>
              <Button variant="default" onClick={() => handleValidation(true)} className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Validar datos
              </Button>
            </>
          )}
          {isValid !== null && (
            <Button variant="default" onClick={onClose}>
              Cerrar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

