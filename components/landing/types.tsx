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
  name: string
  customer?: string
  progressPercent: number
  budget: number
  materialsPurchased: string[]
  estimatedTime: string
  description: string
  images: string[]
  certificates: Certificates[]
  phoneManager: string
  status?:string
}
