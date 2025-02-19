'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2 } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'

type Item = {
  id: string
  number: string
  concept: string
  unit: string
  quantity: number
  unitPrice: number
  subtotal: number
  progress: number
}

type Section = {
  id: string
  title: string
  items: Item[]
}

type Column = {
  key: keyof Item
  label: string
  isVisible: boolean
}

const initialColumns: Column[] = [
  { key: 'number', label: 'Nº', isVisible: true },
  { key: 'concept', label: 'CONCEPTO', isVisible: true },
  { key: 'unit', label: 'UT', isVisible: true },
  { key: 'quantity', label: 'CANT.', isVisible: true },
  { key: 'unitPrice', label: 'PRECIO UNIT.', isVisible: true },
  { key: 'subtotal', label: 'SUBTOTAL', isVisible: true },
  { key: 'progress', label: 'AVANCE%', isVisible: true },
]

const BudgetTable: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([])
  const [columns, setColumns] = useState<Column[]>(initialColumns)

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: `Section ${sections.length + 1}`,
      items: [],
    }
    setSections([...sections, newSection])
  }

  const addItem = (sectionId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const newItem: Item = createNewItem(section.items.length + 1)
          return { ...section, items: [...section.items, newItem] }
        }
        return section
      }),
    )
  }

  const createNewItem = (number: number): Item => ({
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    number: number.toString(),
    concept: '',
    unit: '',
    quantity: 0,
    unitPrice: 0,
    subtotal: 0,
    progress: 0,
  })

  const deleteItem = (sectionId: string, itemId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const updatedItems = section.items.filter(
            (item) => item.id !== itemId,
          )
          // Renumber the remaining items
          updatedItems.forEach((item, index) => {
            item.number = (index + 1).toString()
          })
          return { ...section, items: updatedItems }
        }
        return section
      }),
    )
  }

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId))
  }

  const updateItem = (
    sectionId: string,
    itemId: string,
    field: keyof Item,
    value: string | number,
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const updatedItems = section.items.map((item) => {
            if (item.id === itemId) {
              const updatedItem = { ...item, [field]: value }
              if (field === 'quantity' || field === 'unitPrice') {
                updatedItem.subtotal =
                  updatedItem.quantity * updatedItem.unitPrice
              }
              return updatedItem
            }
            return item
          })
          return { ...section, items: updatedItems }
        }
        return section
      }),
    )
  }

  const toggleColumnVisibility = (columnKey: keyof Item) => {
    setColumns(
      columns.map((column) =>
        column.key === columnKey
          ? { ...column, isVisible: !column.isVisible }
          : column,
      ),
    )
  }

  const handlePaste = (
    e: React.ClipboardEvent<HTMLDivElement>,
    sectionId: string,
  ) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const rows = pastedData.split('\n')

    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const updatedItems = [...section.items]
          rows.forEach((row, index) => {
            const values = row.split('\t')
            if (index < updatedItems.length) {
              // Update existing row
              const updatedItem = { ...updatedItems[index] }
              columns.forEach((column, colIndex) => {
                if (
                  column.key !== 'number' &&
                  values[colIndex - 1] !== undefined
                ) {
                  if (
                    column.key === 'quantity' ||
                    column.key === 'unitPrice' ||
                    column.key === 'progress'
                  ) {
                    updatedItem[column.key] =
                      Number.parseFloat(values[colIndex - 1]) || 0
                  } else if (column.key === 'subtotal') {
                    updatedItem.subtotal =
                      updatedItem.quantity * updatedItem.unitPrice
                  } else {
                    updatedItem[column.key] = values[colIndex - 1]
                  }
                }
              })
              updatedItems[index] = updatedItem
            } else {
              // Create new row with a unique ID
              const newItem = createNewItem(updatedItems.length + 1)
              columns.forEach((column, colIndex) => {
                if (
                  column.key !== 'number' &&
                  values[colIndex - 1] !== undefined
                ) {
                  if (
                    column.key === 'quantity' ||
                    column.key === 'unitPrice' ||
                    column.key === 'progress'
                  ) {
                    newItem[column.key] =
                      Number.parseFloat(values[colIndex - 1]) || 0
                  } else if (column.key === 'subtotal') {
                    newItem.subtotal = newItem.quantity * newItem.unitPrice
                  } else {
                    newItem[column.key] = values[colIndex - 1]
                  }
                }
              })
              updatedItems.push(newItem)
            }
          })
          return { ...section, items: updatedItems }
        }
        return section
      }),
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 w-full justify-between">
        <div className="mb-4 bg-gray-100 p-4 rounded-lg ">
          <h2 className="text-lg font-semibold ">Visibilidad</h2>
          <div className="flex flex-wrap gap-4">
            {columns
              .filter((e) => e.key !== 'number')
              .map((column) => (
                <div key={column.key} className="flex items-center">
                  <Checkbox
                    id={`column-${column.key}`}
                    checked={column.isVisible}
                    onCheckedChange={() => toggleColumnVisibility(column.key)}
                  />
                  <label htmlFor={`column-${column.key}`} className="ml-2">
                    {column.label}
                  </label>
                </div>
              ))}
          </div>
        </div>
        <Button onClick={addSection} className="mb-4" type="button">
          Add Section
        </Button>
      </div>
      {sections.map((section) => (
        <div key={section.id} className="mb-8">
          <div className="flex items-center justify-between">
            <Input
              value={section.title}
              onChange={(e) =>
                setSections(
                  sections.map((s) =>
                    s.id === section.id ? { ...s, title: e.target.value } : s,
                  ),
                )
              }
              className="text-xl font-bold w-1/2 mb-2"
            />
            <Button
              onClick={() => deleteSection(section.id)}
              type="button"
              variant="destructive"
            >
              delete section
            </Button>
          </div>
          <div
            onPaste={(e) => handlePaste(e, section.id)}
            tabIndex={0}
            className="focus:outline-none overflow-x-auto"
          >
            <Table className="border-collapse">
              <TableHeader>
                <TableRow className="bg-gray-200">
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className="border border-gray-300 px-2 py-1"
                    >
                      {column.label}
                    </TableHead>
                  ))}
                  <TableHead className="border border-gray-300 px-2 py-1">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {section.items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <TableCell
                        key={`${item.id}-${column.key}`}
                        className="border border-gray-300 p-0"
                      >
                        {column.key === 'subtotal' ? (
                          <div className="px-2 py-1">
                            {item.subtotal.toFixed(2)}
                          </div>
                        ) : (
                          <Input
                            type={
                              column.key === 'quantity' ||
                              column.key === 'unitPrice' ||
                              column.key === 'progress'
                                ? 'number'
                                : 'text'
                            }
                            value={item[column.key]}
                            onChange={(e) =>
                              updateItem(
                                section.id,
                                item.id,
                                column.key,
                                column.key === 'quantity' ||
                                  column.key === 'unitPrice' ||
                                  column.key === 'progress'
                                  ? Number.parseFloat(e.target.value)
                                  : e.target.value,
                              )
                            }
                            className="border-none h-full w-full px-2 py-1"
                            readOnly={column.key === 'number'}
                          />
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="border border-gray-300 p-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem(section.id, item.id)}
                        className="h-full w-full"
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center">
              <Button
                onClick={() => addItem(section.id)}
                className="mt-2"
                variant="outline"
                type="button"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Row
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BudgetTable
