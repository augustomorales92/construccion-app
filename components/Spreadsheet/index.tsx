'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Pencil, Shovel } from 'lucide-react'
import { useState } from 'react'
import Table from './Table'

interface SpreadsheetDialogProps {
  title?: string
  isAdmin?: boolean
  isCreation?: boolean
  initialData?: string[][]
}

export default function SpreadsheetDialog({
  title,
  isAdmin,
  isCreation,
  initialData = [],
}: SpreadsheetDialogProps) {
  const [isEditing, setIsEditing] = useState(isCreation ?? false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Shovel className="w-4 h-4 mr-2" />
          {title ?? 'Ver'}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] max-h-[90vh] p-0 overflow-auto">
        <DialogTitle className="px-4 pt-4">
          <div>Hoja de Materiales</div>
        </DialogTitle>
        <div className="px-4 flex items-center justify-between">
          <DialogDescription>
            {isEditing ? 'Edita los datos' : 'Visualiza los datos'}
          </DialogDescription>
          {isAdmin && (
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Pencil className="w-4 h-4 mr-2" />
              {isEditing ? 'Guardar' : 'Editar'}
            </Button>
          )}
        </div>
        <div className="p-4">
          <Table
            initialData={initialData}
            isAdmin={isAdmin}
            isEditing={isEditing}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
