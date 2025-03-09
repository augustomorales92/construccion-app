import { ProgressUpdateStatus } from '@prisma/client'

export interface Certificates {
  id: string
  version: number | null
  status: ProgressUpdateStatus
  certificateAmount: number | null
  issuedAt: Date
  projectId: string
}

export interface Incidents {
  id: string
  description: string
  issuedAt: Date
  projectId?: string
  userId?: string
  createdAt?: Date
  updatedAt?: Date
  status: ProgressUpdateStatus
}

export interface Construction {
  id: string
  name: string
  description: string | null
  address: string | null
  budget: number | null
  progressTotal: number | null
  totalCertifiedAmount: number | null
  accessCode: string
  projectNumber: string | null
  estimatedTime?: string | null
  images: string[]
  files: string[]
  items?: Item[]
  certificates?: Certificates[]
  users?: User[]
  incidents?: Incidents[]
  customerId?: string | null
  managerId?: string | null
  notifications?: Notification[]
  customer?: Customer | null
  manager?: Manager | null
  messages?: Message[]
  createdAt?: Date
  updatedAt?: Date
}

export interface CertificateItems {
  id: string
  certificateId: string
  itemId: string
  progress: number
  date: Date
  notes: string | null
  photos: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Item {
  id: string
  section: string | null
  description: string | null
  unit: string | null
  price: number | null
  quantity: number | null
  progressItems?: number | null
  certificateItems?: CertificateItems[]
  projectId: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  image: string | null
  constructions: Construction[]
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  content: string
  userId: string
  constructionId: string
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  content: string
  userId: string
  constructionId: string
  createdAt: Date
  updatedAt: Date
}

export interface PartialConstruction {
  id: string
  name: string
  projectNumber: string | null
  address: string | null
}

export interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface Manager extends Customer {}
