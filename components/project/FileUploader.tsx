'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import { FileSpreadsheet, Upload, Loader2, AlertCircle } from 'lucide-react'
import ResultModal from './ResultModal'
import { convertDataToSpreadsheetFormat, processData } from './utils'
import { Item, SpreadsheetData, ProcessedData } from './types'
import ResultModalSpreadsheet from './ResultModalSpreadsheet'

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  // const [processedData, setProcessedData] = useState<ProcessedData | null>(null)
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [originalItems, setOriginalItems] = useState<Item[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      setLoading(true)
      setSpreadsheetData(null)
      // setProcessedData(null)
      setError(null)

      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error en la conversión del archivo')
      }

      const data = await res.json()
      console.log('Respuesta del servidor:', data)
      setOriginalItems(data)
      // Llamo a la fn para procesar los datos con groupBy
      const processed = processData(data)
      // setProcessedData(processed)
      
      // Invoco a la fn para acomodar con spreadsheet
      const preparedToSpreadSheet = convertDataToSpreadsheetFormat(processed)
      setSpreadsheetData(preparedToSpreadSheet)
      setShowModal(true)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = (isValidated: boolean | null) => {
    setShowModal(false)

    if (isValidated !== null) {
      console.log('Datos validados:', isValidated ? 'Correctos' : 'Incorrectos')
      console.log('Items originales guardados:', originalItems)

      setFile(null)
      // setProcessedData(null)
      setSpreadsheetData(null)
    }
  }

  // Funciones para drag and drop
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (
      droppedFile &&
      (droppedFile.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        droppedFile.type === 'application/vnd.ms-excel')
    ) {
      setFile(droppedFile)
      setError(null)
    } else {
      setError('Por favor, selecciona un archivo Excel (.xlsx, .xls)')
    }
  }

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="w-full">
      <div
        className={`p-8 border-2 border-dashed rounded-lg transition-colors duration-200 bg-white 
          ${isDragging ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:bg-gray-50'} 
          ${file ? 'border-blue-300' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          {loading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              <p className="text-gray-600">Procesando archivo...</p>
            </div>
          ) : (
            <>
              {file ? (
                <div className="flex flex-col items-center">
                  <FileSpreadsheet className="h-12 w-12 text-blue-500 mb-4" />
                  <p className="text-gray-700 font-medium mb-2">
                    Archivo seleccionado:
                  </p>
                  <p className="text-blue-600 mb-4">{file.name}</p>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    {isDragging
                      ? 'Suelta el archivo aquí'
                      : 'Arrastra y suelta un archivo Excel (.xlsx, .xls) aquí'}
                  </p>
                  <p className="text-blue-500 font-medium">
                    o haz clic para seleccionar
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {file && !loading && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleUpload}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center"
          >
            <Upload className="h-5 w-5 mr-2" />
            Verificar Archivo
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Modal usando spreadsheet */}
      {spreadsheetData && showModal && (
        <ResultModalSpreadsheet
          data={spreadsheetData}
          isOpen={showModal}
          onClose={handleModalClose}
        />
      )}
      {/* Modal de vercel (mas bonito) */}
      {/* {processedData && showModal && (
        <ResultModal data={processedData} isOpen={showModal} onClose={handleModalClose} />
      )} */}
    </div>
  )
}
