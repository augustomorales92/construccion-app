"use client"

import { useState } from "react"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { ViewDetailsDialog } from "./view-details-dialog"
import { Button } from "@/components/ui/button"
import { ClipboardList } from "lucide-react"
import Link from "next/link"

// Tipos de datos
type Status = "pendiente" | "aprobado" | "rechazado"

interface Report {
  id: string
  fecha: string
  tipo: "diario" | "quincenal"
  contenido: string
  estado: Status
  autor: string
}

// Datos de ejemplo
const initialReports: Report[] = [
  {
    id: "1",
    fecha: "2024-02-24",
    tipo: "diario",
    contenido: "Reporte de actividades diarias del equipo A",
    estado: "pendiente",
    autor: "Juan Pérez",
  },
  {
    id: "2",
    fecha: "2024-02-24",
    tipo: "diario",
    contenido: "Reporte de actividades diarias del equipo B",
    estado: "pendiente",
    autor: "María García",
  },
  {
    id: "3",
    fecha: "2024-02-15",
    tipo: "quincenal",
    contenido: "Certificado quincenal de cumplimiento",
    estado: "pendiente",
    autor: "Carlos López",
  },
  {
    id: "4",
    fecha: "2024-02-15",
    tipo: "quincenal",
    contenido: "Certificado quincenal de calidad",
    estado: "pendiente",
    autor: "Ana Martínez",
  },
]

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const dailyReports = reports.filter((report) => report.tipo === "diario")
  const biweeklyReports = reports.filter((report) => report.tipo === "quincenal")

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report)
    setIsDialogOpen(true)
  }

  const handleUpdateStatus = (id: string, newStatus: Status) => {
    setReports(reports.map((report) => (report.id === id ? { ...report, estado: newStatus } : report)))
    setIsDialogOpen(false)
  }

  return (
    <div className="container mx-auto py-4 md:py-10 px-2 md:px-4 space-y-6 md:space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">Reportes Pendientes</h1>
        <Link href="protected/history">
          <Button variant="outline" size="sm" className="text-xs md:text-sm">
            <ClipboardList className="h-4 w-4 mr-2" />
            Ver Historial
          </Button>
        </Link>
      </div>

      <section>
        <h2 className="text-base md:text-lg font-semibold mb-3">Reportes Diarios</h2>
        <DataTable columns={columns({ onView: handleViewDetails })} data={dailyReports} />
      </section>

      <section>
        <h2 className="text-base md:text-lg font-semibold mb-3">Certificados Quincenales</h2>
        <DataTable columns={columns({ onView: handleViewDetails })} data={biweeklyReports} />
      </section>

      {selectedReport && (
        <ViewDetailsDialog
          report={selectedReport}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  )
}

