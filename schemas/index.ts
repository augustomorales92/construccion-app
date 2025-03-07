import * as z from 'zod'

export const incidentSchema = z.object({
  description: z.string(),
  projectId: z.string(),
  date: z.coerce.date(),
})

export const managerSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  projectIds: z.array(z.string()).optional(),
})

export const customerSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  projectIds: z.array(z.string()).optional(),
})

export const projectSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  description: z.string().optional(),
  address: z.string().optional(),
  budget: z.number().optional(),
  projectNumber: z.string().optional(),
  accessCode: z.string(),
  managerId: z.string().optional(),
})

const itemSchema = z.object({
  id: z.string().optional(),
  section: z.string().min(1, 'La sección es obligatoria'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  unit: z.string().min(1, 'La unidad es obligatoria'),
  quantity: z.number().positive('La cantidad debe ser mayor a 0'),
  price: z.number().positive('El precio debe ser mayor a 0'),
  progresItem: z.number().min(0).max(100),
})

export const editProjectSchema = z.object({
  projectData: z.object({
    id: z.string(),
    name: z.string().min(1, 'El nombre del proyecto es obligatorio').optional(),
    budget: z.number().positive('El presupuesto debe ser mayor a 0').optional(),
    description: z.string().optional(),
    address: z.string().optional(),
  }),

  newItems: z.array(itemSchema).optional(),

  itemsToUpdate: z
    .array(
      z.object({
        id: z.string(),
        section: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        unit: z.string().min(1).optional(),
        quantity: z.number().positive().optional(),
        price: z.number().positive().optional(),
        progressItem: z.number().optional(),
      }),
    )
    .optional(),

  itemsToDelete: z.array(z.string()).optional(),
  isSheet: z.boolean(),
})

const updatedItemSchema = z.object({
  itemId: z.string(),
  progress: z.number().min(0).max(100),
  notes: z.string().optional(),
  photos: z.array(z.string()).optional(),
})

export const updateProgressSchema = z.object({
  projectId: z.string(),
  date: z.string(),
  updatedItems: z.array(updatedItemSchema),
})

export const createFirstProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  address: z.string().optional(),
  budget: z.number(),
  items: z
    .array(
      z.object({
        section: z.string(),
        description: z.string(),
        unit: z.string(),
        quantity: z.number(),
        price: z.number(),
        progressItem: z.number().optional(),
      }),
    )
    .optional(),
})

export const updateCertificateStatusSchema = z.object({
  certificateId: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
})
