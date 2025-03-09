'use client'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'
import Cell from './Cell'
import { columns } from './utils'

type EditableTableProps = {
  isAdmin?: boolean
  initialData?: string[][]
  isEditing?: boolean
  cols?: string[]
  MIN_ROWS?: number
}

export default function EditableTable({
  isAdmin = false,
  initialData = [],
  isEditing = false,
  cols = columns,
  MIN_ROWS = 25,
}: EditableTableProps) {
  const rowCount = Math.max(initialData.length, MIN_ROWS)
  const colCount = cols.length

  const [activeCell, setActiveCell] = useState<{
    row: number
    col: number
  } | null>(null)

  const [data, setData] = useState<string[][]>(() =>
    Array.from({ length: rowCount }, (_, rowIndex) => {
      const rowData = initialData[rowIndex] || []
      return Array.from(
        { length: colCount },
        (_, colIndex) => rowData[colIndex] ?? '',
      )
    }),
  )
  const [numRows, setNumRows] = useState(data.length)
  const [columnVisibility, setColumnVisibility] = useState(
    Array(colCount).fill(true),
  )

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
    <div className="w-full overflow-auto border border-border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="w-[40px] bg-muted text-center">#</TableHead>
            {cols.map((col, i) => {
              const isColumnVisible =
                columnVisibility[i] || isAdmin || isEditing
              return isColumnVisible ? (
                <TableHead
                  key={i}
                  className={`min-w-12 w-12 max-w-56 bg-muted border-l border-border`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="truncate">{col}</span>
                    {isAdmin && isEditing && (
                      <Checkbox
                        checked={columnVisibility[i]}
                        onCheckedChange={() => toggleColumnVisibility(i)}
                        className="flex-shrink-0"
                      />
                    )}
                  </div>
                </TableHead>
              ) : null
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: numRows }).map((_, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={rowIndex % 2 === 0 ? '' : 'bg-muted/30'}
            >
              <TableCell className="w-[40px] bg-muted text-center text-muted-foreground border-r border-border">
                {rowIndex + 1}
              </TableCell>
              {data[rowIndex]?.map((cellValue, colIndex) => {
                const shouldShowColumn =
                  isAdmin || isEditing || columnVisibility[colIndex]

                return shouldShowColumn ? (
                  <TableCell
                    key={colIndex}
                    className={`p-0 w-12 max-w-56 overflow-hidden`}
                  >
                    <Cell
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
                  </TableCell>
                ) : null
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
