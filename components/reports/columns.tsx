'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import type { Certificates, Incidents } from '@/lib/types'

export type StatusVariant = 'PENDING' | 'APPROVED' | 'REJECTED'
export type Report = Incidents | Certificates

const getStatusBadge = (status: Report['status']) => {
  const variants: Record<StatusVariant, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    APPROVED: 'bg-green-100 text-green-800 hover:bg-green-100',
    REJECTED: 'bg-red-100 text-red-800 hover:bg-red-100',
  }

  return (
    <Badge className={`text-xs ${variants[status as StatusVariant]}`} variant="outline">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export const columns = ({
  onView,
}: {
  onView: (report: Report) => void
}): ColumnDef<Report>[] => [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => (
      <div className="text-xs md:text-sm">{row.original.issuedAt!.toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: 'autor',
    header: 'Autor',
    cell: ({ row }) => (
      <div className="text-xs md:text-sm">{row.original.projectId}</div>
    ),
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(row.original)}
        className="hover:bg-secondary h-8 w-8 p-0"
      >
        <Eye className="h-3 w-3 md:h-4 md:w-4" />
      </Button>
    ),
  },
]
