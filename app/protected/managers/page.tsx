'use client'

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
import { useEffect, useState } from 'react'

export default function Customers() {
  const [customers, setCustomers] = useState<Manager[]>([])
  const [customerInEdition, setCustomerInEdition] = useState<Manager | null>(
    null,
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)

  useEffect(() => {
    // Aquí normalmente harías una llamada a la API
    setCustomers([
      {
        id: '1',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '123-456-7890',
      },
      {
        id: '2',
        name: 'María García',
        email: 'maria@example.com',
        phone: '098-765-4321',
      },
    ])
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (customerInEdition) {
      setCustomerInEdition({ ...customerInEdition, [name]: value })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customerInEdition) {
      if (customerInEdition.id) {
        // Editar cliente existente
        setCustomers(
          customers.map((c) =>
            c.id === customerInEdition.id ? customerInEdition : c,
          ),
        )
      } else {
        // Agregar nuevo cliente
        const newCustomer = {
          ...customerInEdition,
          id: (customers.length + 1).toString(),
        }
        setCustomers([...customers, newCustomer])
      }
      setCustomerInEdition(null)
      setIsDialogOpen(false)
      // Aquí enviarías el email al nuevo cliente si es un cliente nuevo
      if (!customerInEdition.id) {
        console.log(`Enviando email de registro a ${customerInEdition.email}`)
      }
    }
  }

  const startEdition = (customer: Manager) => {
    setCustomerInEdition(customer)
    setIsDialogOpen(true)
  }

  const startCreation = () => {
    setCustomerInEdition({ id: '0', name: '', email: '', phone: '' })
    setIsDialogOpen(true)
  }

  const confirmDeletion = (id: string) => {
    setCustomerToDelete(id)
    setIsAlertDialogOpen(true)
  }

  const deleteCustomer = () => {
    if (customerToDelete) {
      setCustomers(customers.filter((c) => c.id !== customerToDelete))
      setCustomerToDelete(null)
      setIsAlertDialogOpen(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-custom md:h-custom">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-3xl font-bold ">
          Gestión de Encargados
        </h1>
        <Button onClick={startCreation}>Nuevo Encargado</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {customerInEdition?.id
                ? 'Editar Cliente'
                : 'Agregar Nuevo Cliente'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="nombre" className="text-right">
                  Nombre
                </label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={customerInEdition?.name || ''}
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
                  value={customerInEdition?.email || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="telefono" className="text-right">
                  Teléfono
                </label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={customerInEdition?.phone || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {customerInEdition?.id ? 'Guardar Cambios' : 'Agregar Cliente'}
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
            <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={deleteCustomer}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="overflow-x-auto hidden md:block">
        <Card>
          <CardContent>
            <CardHeader></CardHeader>
            <Table>
              <TableCaption>Lista de Encargados registrados</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
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
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDeletion(customer.id)}
                      >
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
        {customers.map((customer) => (
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
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => confirmDeletion(customer.id)}
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
