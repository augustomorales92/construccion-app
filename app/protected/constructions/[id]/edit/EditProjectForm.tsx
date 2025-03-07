'use client'

import type React from 'react'

import { createProject, updateProject } from '@/actions/constructions'
import { Combobox, type ComboboxOption } from '@/components/projects/combobox'
import MonthPickerList from '@/components/projects/month-picker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Construction, Customer, Manager } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import FileUpload from './FileUpload'
import ImageUpload from './ImageUpload'

type Props = {
  project: Construction | null
  clients: Customer[] | null
  managers: Manager[] | null
  isAdmin?: boolean
  isNewProject?: boolean
}

export default function EditProjectForm({
  project,
  clients,
  managers,
  isAdmin,
  isNewProject,
}: Props) {
  const [projectData, setProjectData] = useState<Construction>(
    project || {
      id: '',
      name: '',
      description: '',
      address: '',
      budget: 0,
      progressTotal: 0,
      totalCertifiedAmount: 0,
      accessCode: '',
      projectNumber: '',
      estimatedTime: '',
      images: [] as string[],
      files: [] as string[],
      customer: {} as Customer,
      certificates: [],
      manager: {} as Manager,
    },
  )
  const [images, setImage] = useState<File[]>([])
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const router = useRouter()

  // Convert clients and managers to ComboboxOption format
  const clientOptions: ComboboxOption<Customer>[] = useMemo(() => {
    if (!clients) return []
    return clients.map((client) => ({
      value: client.id,
      label: client.name,
      data: client,
    }))
  }, [clients])

  const managerOptions: ComboboxOption<Manager>[] = useMemo(() => {
    if (!managers) return []
    return managers.map((manager) => ({
      value: manager.id,
      label: manager.name,
      data: manager,
    }))
  }, [managers])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setProjectData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClientChange = (
    value: string,
    option?: ComboboxOption<Customer>,
  ) => {
    if (option && option.data) {
      setProjectData((prev) => ({
        ...prev,
        customer: option.data,
      }))
    }
  }

  const handleManagerChange = (
    value: string,
    option?: ComboboxOption<Manager>,
  ) => {
    if (option && option.data) {
      setProjectData((prev) => ({
        ...prev,
        manager: option.data,
      }))
    }
  }

  const handleMonthSelect = (date: Date | null, formattedValue: string) => {
    setProjectData((prev) => ({ ...prev, estimatedTime: formattedValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()

    // Handle regular fields
    Object.entries(projectData).forEach(([key, value]) => {
      if (key === 'customer' || key === 'manager') {
        // Handle nested objects
        if (value && typeof value === 'object' && 'id' in value) {
          formData.append(`${key}Id`, value.id.toString())
        }
      } else if (Array.isArray(value)) {
        // Handle arrays
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item)
        })
      } else if (value !== undefined && value !== null) {
        // Handle primitive values
        formData.append(key, value.toString())
      }
    })

    // Handle file uploads
    images.forEach((img, index) => {
      formData.append(`imagen${index}`, img)
    })

    if (excelFile) {
      formData.append('excel', excelFile)
    }

    try {
      if (projectData.id) {
        await updateProject(formData)
      } else {
        await createProject(formData)
      }
      router.push('/obras')
      router.refresh()
    } catch (error) {
      console.error('Error saving project:', error)
      // Handle error (could add toast notification here)
    }
  }

  return (
    <div className="container mx-auto px-4 my-2 min-h-custom md:h-custom">
      <Card className="p-4 border-none shadow-sm">
        <CardHeader className="p-2">
          <CardTitle className="mb-4 flex justify-between items-center p-2">
            <Button
              variant="ghost"
              onClick={() =>
                router.push(
                  isNewProject
                    ? '/protected/constructions'
                    : `/protected/constructions/${project?.id}`,
                )
              }
              className="flex items-center"
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <h1 className="text-2xl font-bold">
              {isNewProject ? 'Agregar Nueva Obra' : 'Editar Obra'}
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre" className="text-sm font-medium">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={projectData.name}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cliente" className="text-sm font-medium">
                  Cliente
                </Label>
                <Combobox
                  options={clientOptions}
                  value={projectData.customer?.id || ''}
                  onChange={handleClientChange}
                  placeholder="Seleccione un cliente"
                  emptyMessage="No se encontraron clientes"
                  searchPlaceholder="Buscar cliente..."
                  renderOption={(option) => (
                    <div className="flex flex-col">
                      <span>{option.data.name}</span>
                      {/*  
                      {option.data.company && (
                        <span className="text-xs text-muted-foreground">{option.data.company}</span>
                      )}
                     {option.data.email && (
                        <span className="text-xs text-muted-foreground hidden">{option.data.email}</span>
                      )} */}
                    </div>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="manager" className="text-sm font-medium">
                  Encargado
                </Label>
                <Combobox
                  options={managerOptions}
                  value={projectData.manager?.id || ''}
                  onChange={handleManagerChange}
                  placeholder="Seleccione un encargado"
                  emptyMessage="No se encontraron encargados"
                  searchPlaceholder="Buscar encargado..."
                  renderOption={(option) => (
                    <div className="flex flex-col">
                      <span>{option.data.name}</span>
                      {/*  {option.data.role && <span className="text-xs text-muted-foreground">{option.data.role}</span>}
                      {option.data.department && (
                        <span className="text-xs text-muted-foreground hidden">{option.data.department}</span>
                      )} */}
                    </div>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="avance" className="text-sm font-medium">
                  Avance (%)
                </Label>
                <Input
                  id="avance"
                  name="avance"
                  type="number"
                  min="0"
                  max="100"
                  value={projectData.progressTotal || 0}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="presupuesto" className="text-sm font-medium">
                  Presupuesto
                </Label>
                <Input
                  id="presupuesto"
                  name="presupuesto"
                  type="number"
                  min="0"
                  value={projectData.budget || 0}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="tiempoEstimado" className="text-sm font-medium">
                  Tiempo Estimado
                </Label>
                <MonthPickerList
                  initialValue={projectData.estimatedTime}
                  onSelectMonth={handleMonthSelect}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="descripcion" className="text-sm font-medium">
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={projectData.description || ''}
                  onChange={handleInputChange}
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Imágenes
                </Label>
                <ImageUpload images={images} setImages={setImage} />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Archivos
                </Label>
                <FileUpload
                  excelFile={excelFile}
                  setExcelFile={setExcelFile}
                  isNewProject={isNewProject}
                  isAdmin={isAdmin}
                />
              </div>
            </div>

            <div className="flex justify-end items-center gap-4 pt-4 border-t">
              <Link
                href={
                  isNewProject
                    ? '/protected/constructions'
                    : `/protected/constructions/${project?.id}`
                }
              >
                <Button
                  type="button"
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <span>Cancelar</span>
                </Button>
              </Link>

              <Button type="submit">
                {isNewProject ? 'Agregar Obra' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
