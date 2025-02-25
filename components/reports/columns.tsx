"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Report {
  id: string
  fecha: string
  tipo: "diario" | "quincenal"
  contenido: string
  estado: "pendiente" | "aprobado" | "rechazado"
  autor: string
}

const getStatusBadge = (status: Report["estado"]) => {
  const variants = {
    pendiente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    aprobado: "bg-green-100 text-green-800 hover:bg-green-100",
    rechazado: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  return (
    <Badge className={`text-xs ${variants[status]}`} variant="outline">
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
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => <div className="text-xs md:text-sm">{row.original.fecha}</div>,
  },
  {
    accessorKey: "autor",
    header: "Autor",
    cell: ({ row }) => <div className="text-xs md:text-sm">{row.original.autor}</div>,
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => getStatusBadge(row.original.estado),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" onClick={() => onView(row.original)} className="hover:bg-secondary h-8 w-8 p-0">
        <Eye className="h-3 w-3 md:h-4 md:w-4" />
      </Button>
    ),
  },
]

