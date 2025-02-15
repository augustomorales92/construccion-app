'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { AlertCircle, Calendar } from 'lucide-react'
import { useState } from 'react'
import { Incidents } from './types'


interface ConstructionIncidentsTimelineProps {
  incidents: Incidents[]
}

export function ConstructionIncidentsTimeline({
  incidents,
}: ConstructionIncidentsTimelineProps) {
  const [open, setOpen] = useState(false)

  // Ordenar incidencias por fecha, las más recientes primero
  const sortedIncidents = [...incidents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <AlertCircle className="mr-2 h-4 w-4" />
          Ver Incidencias
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Timeline de Incidencias</SheetTitle>
          <SheetDescription>
            Historial de incidencias relacionadas con la construcción
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <div className="space-y-8">
            {sortedIncidents.map((incident, index) => (
              <div key={incident.id} className="relative">
                {index !== sortedIncidents.length - 1 && (
                  <span className="absolute top-7 left-3 -bottom-9 w-px bg-gray-200" />
                )}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white">
                      <Calendar className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(incident.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      {incident.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
