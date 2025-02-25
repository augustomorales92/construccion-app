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

const MIN_ROWS = 30
const COLS = 10

interface CellPosition {
  row: number
  col: number
}

export default function SpreadsheetDialog({
  title,
  isAdmin,
  isCreation,
}: {
  title?: string
  isAdmin?: boolean
  isCreation?: boolean
}) {
  const initialData = Array(MIN_ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(''))
  const [data, setData] = useState<string[][]>(initialData)
  const [activeCell, setActiveCell] = useState<CellPosition | null>(null)
  const [numRows, setNumRows] = useState(MIN_ROWS)
  const [columnVisibility, setColumnVisibility] = useState(
    Array(COLS).fill(true),
  )
  const [isEditing, setIsEditing] = useState(isCreation ?? false)

  const updateCell = (row: number, col: number, value: string) => {
    if (!isEditing) return

    const newData = [...data]
    while (row >= newData.length) {
      newData.push(Array(COLS).fill(''))
    }
    newData[row][col] = value
    setData(newData)
    setNumRows(Math.max(MIN_ROWS, newData.length))
  }

  const getColumnLabel = (index: number) => String.fromCharCode(65 + index)

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
            <div
              className="grid"
              style={{
                gridTemplateColumns: `40px repeat(${COLS}, minmax(100px, 1fr))`,
              }}
            >
              <div className="border-r border-b border-border bg-muted" />
              {Array.from({ length: COLS }).map((_, i) => (
                <div
                  key={i}
                  className="border-r border-b border-border bg-muted px-2 py-1 text-sm font-medium text-muted-foreground flex items-center gap-2"
                >
                  {getColumnLabel(i)}
                  {isAdmin && isEditing && (
                    <Checkbox
                      checked={columnVisibility[i]}
                      onCheckedChange={() => toggleColumnVisibility(i)}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="grid" style={{ gridTemplateColumns: '40px 1fr' }}>
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

              <div
                className="grid auto-rows-[40px]"
                style={{
                  gridTemplateColumns: `repeat(${COLS}, minmax(100px, 1fr))`,
                }}
              >
                {data.map((row, rowIndex) =>
                  row.map((cellValue, colIndex) =>
                    columnVisibility[colIndex] ? (
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
                        readOnly={!isEditing}
                      />
                    ) : null,
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
