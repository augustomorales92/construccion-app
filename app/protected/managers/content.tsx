'use client'

import { createManager, deleteManager, updateManager } from '@/actions/people'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Manager } from '@/lib/types'
import { Edit, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

type Props = {
  managers?: Manager[]
}

export default function Managers({ managers }: Props) {
  const [isPending, startTransition] = useTransition()
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (selectedManager) {
      setSelectedManager({ ...selectedManager, [name]: value })
    }
  }

  const startEdition = (manager: Manager) => {
    setSelectedManager(manager)
    setIsDialogOpen(true)
  }

  const startCreation = () => {
    setSelectedManager({ id: '0', name: '', email: '', phone: '' })
    setIsDialogOpen(true)
  }

  const confirmDeletion = (manager: Manager) => {
    setSelectedManager(manager)
    setIsAlertDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedManager) return

    startTransition(async () => {
      try {
        const isNewCustomer = selectedManager.id === '0'
        const response = await (isNewCustomer
          ? createManager(selectedManager)
          : updateManager(selectedManager.id, selectedManager))

        if (!response.success) {
          throw new Error('Error en la operación')
        }

        toast.success(
          `Encargado ${isNewCustomer ? 'creado' : 'actualizado'} correctamente`,
        )
        setIsDialogOpen(false)
        setSelectedManager(null)
      } catch (error) {
        console.error('Error creating/updating manager:', error)
        toast.error(
          'Ocurrió un error al procesar la operación. Por favor, intente nuevamente.',
        )
      }
    })
  }

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const response = await deleteManager(selectedManager?.id)

        if (!response.success) {
          throw new Error('Error al eliminar')
        }

        toast.success('Encargado eliminado correctamente')
        setIsAlertDialogOpen(false)
      } catch (error) {
        console.error('Error deleting manager:', error)
        toast.error('Error al eliminar el encarcago')
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-custom md:h-custom">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-3xl font-bold">Gestión de Encargados</h1>
        <Button onClick={startCreation} disabled={isPending}>
          Nuevo Encargado
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedManager?.id === '0'
                ? 'Agregar Nuevo Encargado'
                : 'Editar Encargado'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Nombre
                </label>
                <Input
                  id="name"
                  name="name"
                  value={selectedManager?.name || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={selectedManager?.email || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-right">
                  Teléfono
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={selectedManager?.phone || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? 'Procesando...'
                  : selectedManager?.id === '0'
                    ? 'Agregar Encargado'
                    : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Está seguro de que desea eliminar este encargado?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el encargado y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="overflow-x-auto hidden md:block">
        <Card>
          <CardContent>
            <Table>
              <TableCaption>Lista de encargados registrados</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers?.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell>{manager.name}</TableCell>
                    <TableCell>{manager.email}</TableCell>
                    <TableCell>{manager.phone}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => startEdition(manager)}
                        disabled={isPending}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDeletion(manager)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 md:hidden">
        {managers?.map((manager) => (
          <Card key={manager.id}>
            <CardHeader>
              <CardTitle>{manager.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Email:</strong> {manager.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {manager.phone}
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdition(manager)}
                  disabled={isPending}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => confirmDeletion(manager)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
