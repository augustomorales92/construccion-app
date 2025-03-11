'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Row } from '@tanstack/react-table'
import { ArrowLeft, Download, PenLine } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { DataTable } from '../data-table'
import { EditReportDialog } from './edit-report-dialog'
import { downloadPdf } from '@/app/api/pdf-generate/utils'

// Tipos
type Status = 'pendiente' | 'aprobado' | 'rechazado'
type ReportType = 'diario' | 'quincenal'

interface Report {
  id: string
  fecha: string
  tipo: ReportType
  contenido: string
  estado: Status
  autor: string
  certificateId?: string // Añado para probar
}

// Datos de ejemplo
const historicalReports: Report[] = [
  {
    id: '1',
    fecha: '2024-02-20',
    tipo: 'diario',
    contenido: 'Reporte diario del equipo A',
    estado: 'aprobado',
    autor: 'Juan Pérez',
  },
  {
    id: '2',
    fecha: '2024-02-21',
    tipo: 'diario',
    contenido: 'Reporte con errores de formato',
    estado: 'rechazado',
    autor: 'María García',
  },
  {
    id: '3',
    fecha: '2024-03-15',
    tipo: 'quincenal',
    contenido: 'Certificado hierro Nort',
    estado: 'aprobado',
    autor: 'Carlos López',
    certificateId: 'CERT-001',
  },
  {
    id: '4',
    fecha: '2024-02-15',
    tipo: 'quincenal',
    contenido: 'Certificado con información incompleta',
    estado: 'rechazado',
    autor: 'Ana Martínez',
  },
]

// Columnas para la tabla
const columns = ({
  onEdit,
  onDownload,
}: {
  onEdit: (report: Report) => void
  onDownload?: (certificateId: string) => void
}) => [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }: { row: Row<Report> }) => (
      <div className="text-xs md:text-sm">{row.getValue('fecha')}</div>
    ),
  },
  {
    accessorKey: 'autor',
    header: 'Autor',
    cell: ({ row }: { row: Row<Report> }) => (
      <div className="text-xs md:text-sm">{row.getValue('autor')}</div>
    ),
  },
  {
    accessorKey: 'contenido',
    header: 'Contenido',
    cell: ({ row }: { row: Row<Report> }) => (
      <div className="text-xs md:text-sm max-w-[200px] truncate">
        {row.getValue('contenido')}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }: { row: Row<Report> }) => {
      const report = row.original as Report

      if (report.estado === 'rechazado') {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(report)}
            className="hover:bg-secondary h-8 w-8 p-0"
          >
            <PenLine className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        )
      }
      // pongo el id del certificado coomo string para probar
      if (
        report.estado === 'aprobado' &&
        report.tipo === 'quincenal' &&
        report.certificateId &&
        onDownload
      ) {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload('39d3e958-066e-4711-b868-1902567b8a1f')}
            // onClick={() => onDownload(report.certificateId!)}
            className="hover:bg-secondary h-8 w-8 p-0"
          >
            <Download className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        )
      }

      return null
    },
  },
]

export default function HistoryPage() {
  const [reports, setReports] = useState<Report[]>(historicalReports)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEdit = (report: Report) => {
    setSelectedReport(report)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = (updatedReport: Report) => {
    setReports(
      reports.map((report) =>
        report.id === updatedReport.id ? updatedReport : report,
      ),
    )
    setIsEditDialogOpen(false)
  }

  const filterReports = (tipo: ReportType, estado: Status) => {
    return reports.filter(
      (report) => report.tipo === tipo && report.estado === estado,
    )
  }

  return (
    <div className="container mx-auto py-4 md:py-10 px-2 md:px-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/protected">
          <Button variant="ghost" size="sm" className="text-xs md:text-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <h1 className="text-xl md:text-2xl font-bold">Historial de Reportes</h1>
      </div>

      <Tabs defaultValue="diarios" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="diarios" className="text-xs md:text-sm">
            Reportes Diarios
          </TabsTrigger>
          <TabsTrigger value="quincenales" className="text-xs md:text-sm">
            Certificados Quincenales
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diarios" className="space-y-6">
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3">
              Aprobados
            </h3>
            <DataTable
              columns={columns({ onEdit: handleEdit })}
              data={filterReports('diario', 'aprobado')}
            />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3">
              Rechazados
            </h3>
            <DataTable
              columns={columns({ onEdit: handleEdit })}
              data={filterReports('diario', 'rechazado')}
            />
          </div>
        </TabsContent>

        <TabsContent value="quincenales" className="space-y-6">
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3">
              Aprobados
            </h3>
            <DataTable
              columns={columns({
                onEdit: handleEdit,
                onDownload: downloadPdf,
              })}
              data={filterReports('quincenal', 'aprobado')}
            />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3">
              Rechazados
            </h3>
            <DataTable
              columns={columns({ onEdit: handleEdit })}
              data={filterReports('quincenal', 'rechazado')}
            />
          </div>
        </TabsContent>
      </Tabs>

      {selectedReport && (
        <EditReportDialog
          report={selectedReport}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}
