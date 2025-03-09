'use client'

import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from '@/actions/people'
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
import { Customer } from '@/lib/types'
import { Edit, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

type Props = {
  customers?: Customer[]
}

export default function Customers({ customers }: Props) {
  const [isPending, startTransition] = useTransition()
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (selectedCustomer) {
      setSelectedCustomer({ ...selectedCustomer, [name]: value })
    }
  }

  const startEdition = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDialogOpen(true)
  }

  const startCreation = () => {
    setSelectedCustomer({ id: '0', name: '', email: '', phone: '' })
    setIsDialogOpen(true)
  }

  const confirmDeletion = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsAlertDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedCustomer) return

    startTransition(async () => {
      try {
        const isNewCustomer = selectedCustomer.id === '0'
        const response = await (isNewCustomer
          ? createCustomer(selectedCustomer)
          : updateCustomer(selectedCustomer.id, selectedCustomer))

        if (!response.success) {
          throw new Error('Error en la operación')
        }

        toast.success(
          `Cliente ${isNewCustomer ? 'creado' : 'actualizado'} correctamente`,
        )
        setIsDialogOpen(false)
        setSelectedCustomer(null)
      } catch (error) {
        console.error('Error creating/updating customer:', error)
        toast.error(
          'Ocurrió un error al procesar la operación. Por favor, intente nuevamente.',
        )
      }
    })
  }

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const response = await deleteCustomer(selectedCustomer?.id)

        if (!response.success) {
          throw new Error('Error al eliminar')
        }

        toast.success('Cliente eliminado correctamente')
        setIsAlertDialogOpen(false)
      } catch (error) {
        console.error('Error deleting customer:', error)
        toast.error('Error al eliminar el cliente')
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-custom md:h-custom">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-3xl font-bold">Gestión de Clientes</h1>
        <Button onClick={startCreation} disabled={isPending}>
          Nuevo Cliente
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer?.id === '0'
                ? 'Agregar Nuevo Cliente'
                : 'Editar Cliente'}
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
                  value={selectedCustomer?.name || ''}
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
                  value={selectedCustomer?.email || ''}
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
                  value={selectedCustomer?.phone || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? 'Procesando...'
                  : selectedCustomer?.id === '0'
                    ? 'Agregar Cliente'
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
              ¿Está seguro de que desea eliminar este cliente?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el cliente y todos sus datos asociados.
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
              <TableCaption>Lista de clientes registrados</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers?.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => startEdition(customer)}
                        disabled={isPending}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDeletion(customer)}
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
        {customers?.map((customer) => (
          <Card key={customer.id}>
            <CardHeader>
              <CardTitle>{customer.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Email:</strong> {customer.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {customer.phone}
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdition(customer)}
                  disabled={isPending}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => confirmDeletion(customer)}
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
