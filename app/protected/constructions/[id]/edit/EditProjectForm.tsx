'use client'

import { createProject, updateProject } from '@/actions/constructions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Construction, Customer, Manager } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import FileUpload from './FileUpload'
import ImageUpload from './ImageUpload'

type Props = {
  project: Construction | null
  clients: Customer[] | null
  managers: Manager[] | null
  id?: string
}

export default function EditProjectForm({
  project,
  clients,
  id,
  managers,
}: Props) {
  const [projectData, setProjectData] = useState<Construction>(
    project || {
      id: '',
      ref: '',
      name: '',
      customer: {} as Customer,
      progressPercent: 0,
      budget: 0,
      materialsPurchased: [] as string[],
      estimatedTime: '',
      description: '',
      images: [] as string[],
      certificates: [],
      manager: {} as Manager,
      status: '',
      password: '',
    },
  )
  const [images, setImage] = useState<File[]>([])
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const router = useRouter()

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setProjectData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(projectData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item)
        })
      } else {
        formData.append(key, value.toString())
      }
    })
    images.forEach((img, index) => {
      formData.append(`imagen${index}`, img)
    })

    if (excelFile) {
      formData.append('excel', excelFile)
    }

    if (projectData.id) {
      await updateProject(formData)
    } else {
      await createProject(formData)
    }
    router.push('/obras')
    router.refresh()
  }

  return (
    <div className="container mx-auto px-4 my-2 min-h-custom md:h-custom">
      <Card className="p-4">
        <CardHeader className="p-2 ">
          <CardTitle className="mb-4 flex justify-between items-center p-2">
            <Button
              variant="ghost"
              onClick={() =>
                router.push(id === 'new' ? '/protected/constructions' : `/protected/constructions/${id}`)
              }
              className="flex items-center"
              size="icon"
            >
              <ArrowLeft className=" h-4 w-4" />
            </Button>

            <h1 className="text-3xl font-bold">
              {projectData.id ? 'Editar Obra' : 'Agregar Nueva Obra'}
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4 flex flex-col justify-between h-full min-h-[60vh]">
            <div>
              <>
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={projectData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="cliente">Cliente</Label>
                  <div className="flex items-center space-x-2">
                    <select
                      id="cliente"
                      name="cliente"
                      value={projectData.customer.id}
                      onChange={handleInputChange}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Selecione un cliente</option>
                      {clients?.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                      <option value="new">Nuevo Cliente</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="manager">Encargado</Label>
                  <div className="flex items-center space-x-2">
                    <select
                      id="manager"
                      name="manager"
                      value={projectData.manager.id}
                      onChange={handleInputChange}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Selecciona al encargado</option>
                      {managers?.map((manager) => (
                        <option key={manager.id} value={manager.id}>
                          {manager.name}
                        </option>
                      ))}
                      <option value="new">Nuevo Encargado</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="avance">Avance (%)</Label>
                  <Input
                    id="avance"
                    name="avance"
                    type="number"
                    value={projectData.progressPercent}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="presupuesto">Presupuesto</Label>
                  <Input
                    id="presupuesto"
                    name="presupuesto"
                    type="number"
                    value={projectData.budget}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="tiempoEstimado">Tiempo Estimado</Label>
                  <Input
                    id="tiempoEstimado"
                    name="tiempoEstimado"
                    value={projectData.estimatedTime}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    value={projectData.description}
                    onChange={handleInputChange}
                  />
                </div>
                {id !== 'new' && (
                  <ImageUpload images={images} setImages={setImage} />
                )}
                <FileUpload excelFile={excelFile} setExcelFile={setExcelFile} />
              </>
            </div>
            <div className="flex justify-end items-center gap-4">
              <Link href={id === 'new' ? '/obras' : `/obras/${id}`}>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <span>Cancelar</span>
                </Button>
              </Link>

              <Button type="button" onClick={handleSubmit}>
                {projectData.id ? 'Guardar Cambios' : 'Agregar Obra'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
