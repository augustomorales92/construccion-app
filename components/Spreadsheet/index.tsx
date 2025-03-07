'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Pencil, Shovel } from 'lucide-react'
import { useState } from 'react'
import Cell from './Cell'

interface SpreadsheetDialogProps {
  title?: string
  isAdmin?: boolean
  isCreation?: boolean
  /**
   * Datos iniciales, por ejemplo:
   * [
   *   ["1", "Trazo y nivelación", "m2", "8583.72", "4.79", "41014.99", "5000", "300", "5300"],
   *   ["2", "Desmonte", "m3", "100", "10", "1000", "...", "...", "..."],
   *   ...
   * ]
   */
  initialData?: string[][]
}

export default function SpreadsheetDialog({
  title,
  isAdmin,
  isCreation,
  initialData = [],
}: SpreadsheetDialogProps) {
  const MIN_ROWS = 30
  // Definimos las columnas que quieres mostrar
  const columns = [
    'N°',
    'SECCIÓN',
    'CONCEPTO',
    'UT',
    'CANT.',
    'PRECIO UNIT.',
    'SUBTOTAL',
    'ACLM ANT',
    'ACTUAL',
    'ACLM',
  ]
  const colCount = columns.length

  const rowCount = Math.max(initialData.length, MIN_ROWS)

  const [data, setData] = useState<string[][]>(() =>
    Array.from({ length: rowCount }, (_, rowIndex) => {
      const rowData = initialData[rowIndex] || []
      return Array.from(
        { length: colCount },
        (_, colIndex) => rowData[colIndex] ?? '',
      )
    }),
  )

  const [activeCell, setActiveCell] = useState<{
    row: number
    col: number
  } | null>(null)
  const [numRows, setNumRows] = useState(data.length)
  const [columnVisibility, setColumnVisibility] = useState(
    Array(colCount).fill(true),
  )
  const [isEditing, setIsEditing] = useState(isCreation ?? false)

  const updateCell = (row: number, col: number, value: string) => {
    if (!isEditing) return

    const newData = [...data]

    while (row >= newData.length) {
      newData.push(Array(colCount).fill(''))
    }

    newData[row][col] = value
    setData(newData)

    setNumRows(Math.max(MIN_ROWS, newData.length))
  }

  const toggleColumnVisibility = (index: number) => {
    const newVisibility = [...columnVisibility]
    newVisibility[index] = !newVisibility[index]
    setColumnVisibility(newVisibility)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Shovel className="w-4 h-4 mr-2" />
          {title ?? 'Ver'}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] max-h-[90vh] p-0 overflow-auto">
        <DialogTitle className="px-4 pt-4">
          <div>Hoja de Materiales</div>
        </DialogTitle>
        <div className="px-4 flex items-center justify-between">
          <DialogDescription>
            {isEditing ? 'Edita los datos' : 'Visualiza los datos'}
          </DialogDescription>
          {isAdmin && (
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Pencil className="w-4 h-4 mr-2" />
              {isEditing ? 'Guardar' : 'Editar'}
            </Button>
          )}
        </div>

        <div className="p-4">
          <div className="border border-border bg-background overflow-x-auto">
            {/* Encabezado de columnas */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `40px repeat(${colCount}, minmax(100px, 1fr))`,
              }}
            >
              {/* Celda vacía arriba de la columna de filas */}
              <div className="border-r border-b border-border bg-muted" />

              {/* Nombre de cada columna */}
              {columns.map((colName, i) => (
                <div
                  key={i}
                  className="border-r border-b border-border bg-muted px-2 py-1 text-sm font-medium text-muted-foreground flex items-center gap-2"
                >
                  {colName}
                  {isAdmin && isEditing && (
                    <Checkbox
                      checked={columnVisibility[i]}
                      onCheckedChange={() => toggleColumnVisibility(i)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Cuerpo de la tabla */}
            <div className="grid" style={{ gridTemplateColumns: '40px 1fr' }}>
              {/* Columna de números de fila */}
              <div className="grid auto-rows-[40px]">
                {Array.from({ length: numRows }).map((_, i) => (
                  <div
                    key={i}
                    className="border-r border-b border-border bg-muted px-2 flex items-center justify-center text-sm text-muted-foreground"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Celdas de datos */}
              <div
                className="grid auto-rows-[40px]"
                style={{
                  gridTemplateColumns: `repeat(${
                    isAdmin || isEditing
                      ? colCount
                      : columnVisibility.filter(Boolean).length
                  }, minmax(100px, 1fr))`,
                }}
              >
                {data.map((row, rowIndex) =>
                  row
                    .map((cellValue, colIndex) => ({ cellValue, colIndex }))
                    .filter(
                      ({ colIndex }) =>
                        isAdmin || isEditing || columnVisibility[colIndex],
                    )
                    .map(({ cellValue, colIndex }) => (
                      <Cell
                        key={`${rowIndex}-${colIndex}`}
                        value={cellValue}
                        onChange={(value) =>
                          updateCell(rowIndex, colIndex, value)
                        }
                        isEven={rowIndex % 2 === 0}
                        isActive={
                          activeCell?.row === rowIndex &&
                          activeCell?.col === colIndex
                        }
                        onActivate={() =>
                          setActiveCell({ row: rowIndex, col: colIndex })
                        }
                        readOnly={!isEditing || !isAdmin}
                      />
                    )),
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
