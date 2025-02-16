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
  cliente: string
  avance: number
  presupuesto: number
  materialesComprados: string[]
  tiempoEstimado: string
  description: string
  images: string[]
  certificados: Certificates[]
  number: string
  
}
