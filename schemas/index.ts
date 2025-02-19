import * as z from 'zod'

export const IssueSchema = z.object({
  description: z.string(),
  projectId: z.string(),
})

export const projectSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  description: z.string().optional(),
  address: z.string().optional(),
  budget: z.number().optional(),
  projectNumber: z.string().optional(),
  accessCode: z.string(),
})

export const itemSchema = z.object({
  id: z.string().optional(),
  section: z.string().optional(),
  description: z.string().optional(),
  unit: z.string().optional(),
  quantity: z.number().positive().optional(),
  price: z.number().positive().optional(),
  weight: z.number().positive().optional(),
})

export const editProjectSchema = z.object({
  projectId: z.string(),
  items: z.array(itemSchema),
});

export const calculateProgressSchema = z.object({
  projectId: z.string(),
});

const updatedItemSchema = z.object({
  itemId: z.string(),
  progress: z.number().min(0).max(100),
  notes: z.string().optional(),
  photos: z.array(z.string()).optional(),
});

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
  projectNumber: z.string(),
  items: z.array(
    z.object({
      section: z.string(),
      description: z.string(),
      unit: z.string(),
      quantity: z.number(),
      price: z.number(),
      weight: z.number(),
    })
  ).optional(),
});

export const itemsSchema = z.union([itemSchema, z.array(itemSchema)])

export const updateCertificateStatusSchema = z.object({
  certificateId: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});

