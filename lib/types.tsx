export interface Certificates {
  id: number
  avance: number
  montoGastado: number
  archivo: string
}

export interface Incidents {
  id: string
  content: string
  date: string
}

export interface Construction {
  id: string
  ref: string
  name: string
  customer: Customer
  progressPercent: number
  budget: number
  materialsPurchased: string[]
  estimatedTime: string
  description: string
  images: string[]
  certificates: Certificates[]
  manager: Manager
  status: string
  password: string
}


export interface Customer {
  id: number
  name: string
  email: string
  phone: string
}

export interface Manager extends Customer {}