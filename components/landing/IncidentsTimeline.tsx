"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AlertCircle, Calendar } from "lucide-react"
import { useState } from "react"
import type { Incidents } from "../../lib/types"

interface ConstructionIncidentsTimelineProps {
  incidents: Incidents[]
}

export function ConstructionIncidentsTimeline({ incidents }: ConstructionIncidentsTimelineProps) {
  const [open, setOpen] = useState(false)


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full max-w-xs">
          <AlertCircle className="mr-2 h-4 w-4" />
          Incidencias
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Timeline de Incidencias</SheetTitle>
          <SheetDescription>Historial de incidencias relacionadas con la construcción</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <div className="space-y-8">
            {incidents.map((incident, index) => (
              <div key={incident.id} className="relative">
                {index !== incidents.length - 1 && (
                  <span className="absolute top-8 left-4 -bottom-9 w-px bg-border" />
                )}
                <div className="flex items-start">
                  <div className="shrink-0 mr-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                      <Calendar className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {new Date(incident.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{incident.description}</div>
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

