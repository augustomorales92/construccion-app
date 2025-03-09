'use client'

import { Button } from '@/components/ui/button'
import { Certificates, Incidents } from '@/lib/types'
import { ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { columns } from './columns'
import { DataTable } from './data-table'
import { ViewDetailsDialog } from './view-details-dialog'
import type { Report } from './columns'

type Props = {
  reports: { incidents: Incidents[]; certificates: Certificates[] } | null
}

export default function ReportsPage({ reports }: Props) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report)
    setIsDialogOpen(true)
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
        <h2 className="text-base md:text-lg font-semibold mb-3">
          Reportes Diarios
        </h2>
        <DataTable
          columns={columns({ onView: handleViewDetails })}
          data={reports?.incidents || []}
        />
      </section>

      <section>
        <h2 className="text-base md:text-lg font-semibold mb-3">
          Certificados Quincenales
        </h2>
        <DataTable
          columns={columns({ onView: handleViewDetails })}
          data={reports?.certificates || []}
        />
      </section>

      {selectedReport && (
        <ViewDetailsDialog
          report={selectedReport}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  )
}
