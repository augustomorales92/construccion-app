"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle } from "lucide-react"
import type { JSX } from "react"

interface Item {
  section: string
  description: string
  unit: string
  quantity: number
  price: number
  code?: string
  subtotal?: number
}

interface ResultModalProps {
  data: Item[]
  isOpen: boolean
  onClose: () => void
}

export default function ResultModal({ data, isOpen, onClose }: ResultModalProps) {
  const [processedData, setProcessedData] = useState<Item[]>([])
  const [sectionMap, setSectionMap] = useState<Map<string, string>>(new Map())
  const [isValid, setIsValid] = useState<boolean | null>(null)

  useEffect(() => {
    if (data && Array.isArray(data)) {
      // Procesar los datos para añadir códigos y subtotales
      const sections = new Map<string, string>()
      const sectionCounts = new Map<string, number>()

      // Asignar letras a las secciones
      let nextLetter = "A"
      data.forEach((item) => {
        if (!sections.has(item.section)) {
          sections.set(item.section, nextLetter)
          sectionCounts.set(item.section, 0)
          nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1)
        }
      })

      setSectionMap(sections)

      // Procesar cada ítem
      const processed = data.map((item) => {
        const sectionLetter = sections.get(item.section) || "?"
        const count = (sectionCounts.get(item.section) || 0) + 1
        sectionCounts.set(item.section, count)

        return {
          ...item,
          code: `${sectionLetter}.${count}`,
          subtotal: item.quantity * item.price,
        }
      })

      setProcessedData(processed)
    }
  }, [data])

  if (!isOpen) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const handleValidation = (valid: boolean) => {
    setIsValid(valid)
    // Aquí podrías enviar la validación a un servidor si es necesario
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  const total = processedData.reduce((sum, item) => sum + (item.subtotal || 0), 0)

  // Agrupar los datos por sección para mostrar encabezados
  const groupedData: JSX.Element[] = []
  let currentSection = ""

  processedData.forEach((item, index) => {
    // Si es una nueva sección, añadir encabezado
    if (item.section !== currentSection) {
      currentSection = item.section
      const sectionLetter = sectionMap.get(item.section) || "?"

      // Añadir fila de encabezado de sección
      groupedData.push(
        <tr key={`section-${sectionLetter}`} className="bg-gray-100">
          <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">{sectionLetter}</td>
          <td colSpan={6} className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
            {item.section}
          </td>
        </tr>,
      )
    }

    // Añadir fila de datos
    groupedData.push(
      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.code}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.section}</td>
        <td className="px-6 py-4 text-sm text-gray-500">{item.description}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
          {item.quantity.toLocaleString("es-AR")}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(item.price)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
          {formatCurrency(item.subtotal || 0)}
        </td>
      </tr>,
    )
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Resultados de la tabla</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-auto flex-grow p-4">
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

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nº
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sección
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Descripción
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Unidad
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cantidad
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Precio
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groupedData}

                {/* Fila de total */}
                <tr className="bg-gray-200">
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                    TOTAL:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                    {formatCurrency(total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t p-4 flex justify-end space-x-4">
          {isValid === null && (
            <>
              <button
                onClick={() => handleValidation(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                No es correcto
              </button>
              <button
                onClick={() => handleValidation(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Validar datos
              </button>
            </>
          )}
          {isValid !== null && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

