'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { createWork } from '@/actions/constructions'
import { Button } from '@/components/ui/button'

interface FormValues {
  name: string
  description?: string
  address?: string
  budget?: number
  phoneManager?: string
}

export default function CreateWorkPage() {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    startTransition(async () => {
      await createWork(data)
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Nueva Obra</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Nombre de la Obra:
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('name', { required: 'El nombre es obligatorio' })}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Descripción:
          </label>
          <textarea
            id="description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('description')}
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
            Dirección:
          </label>
          <input
            type="text"
            id="address"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('address')}
          />
        </div>
        <div>
          <label htmlFor="budget" className="block text-gray-700 text-sm font-bold mb-2">
            Presupuesto:
          </label>
          <input
            type="number"
            id="budget"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('budget', { valueAsNumber: true })}
          />
        </div>
        <div>
          <label htmlFor="phoneManager" className="block text-gray-700 text-sm font-bold mb-2">
            Teléfono del Encargado:
          </label>
          <input
            type="text"
            id="phoneManager"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('phoneManager')}
          />
        </div>
        <Button
          type="submit"
          variant={'default'}
          disabled={isPending}
        >
          Crear Obra
        </Button>
      </form>
    </div>
  )
}