import { Incidents } from './types'

export const clientsSample = [
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
]

export const managerSample = [
  {
    id: '1',
    name: 'Pedro',
    email: '',
    phone: '',
  },
  {
    id: '2',
    name: 'Luis',
    email: '',
    phone: '',
  },
]

export const constructions = [
  {
    id: '1',
    name: 'Casa Moderna',
    description: 'Construcción de una casa moderna de dos pisos.',
    address: 'Calle 123, Ciudad de Ejemplo',
    budget: 500000,
    progressTotal: 30,
    totalCertifiedAmount: 150000,
    accessCode: 'ABC-2023-XY',
    projectNumber: 'CM-2023-XY',
    images: ['/images/placeholder.svg?height=200&width=300'],
    files: [],
    customer: clientsSample[1],
    manager: managerSample[0],
    status: 'En progreso',
  },
  {
    id: '2',
    name: 'Oficina Comercial',
    description:
      'Remodelación de oficinas comerciales en el centro de la ciudad.',
    address: 'Avenida Principal, Ciudad de Ejemplo',
    budget: 750000,
    progressTotal: 60,
    totalCertifiedAmount: 450000,
    accessCode: 'OC-2023-XY',
    projectNumber: 'OC-2023-XY',
    images: ['/images/placeholder.svg?height=200&width=300'],
    files: [],
    customer: clientsSample[1],
    manager: managerSample[0],
    status: 'En progreso',
  },
  {
    id: '3',
    name: 'Edificio 3 plantas',
    description:
      'Construcción de un edificio de 3 plantas en el centro de la ciudad.',
    address: 'Avenida Principal, Ciudad de Ejemplo',
    budget: 1500000,
    progressTotal: 90,
    totalCertifiedAmount: 1350000,
    accessCode: 'E3P-2023-XY',
    projectNumber: 'E3P-2023-XY',
    images: ['/images/placeholder.svg?height=200&width=300'],
    files: [],
    customer: clientsSample[1],
    manager: managerSample[0],
    status: 'En progreso',
  },
]

const date = new Date()

export const sampleIncidents: Incidents[] = [
  {
    id: '1',
    issuedAt: date,
    description: 'Inicio de la excavación para los cimientos.',
    status: 'APPROVED',
  },
  {
    id: '2',
    issuedAt: date,
    description:
      'Retraso debido a lluvias intensas. Trabajo suspendido por 2 días.',
    status: 'APPROVED',
  },
  {
    id: '3',
    issuedAt: date,
    description: 'Finalización de la colocación de cimientos.',
    status: 'APPROVED',
  },
  {
    id: '4',
    issuedAt: date,
    description: 'Inicio de la construcción de la estructura principal.',
    status: 'APPROVED',
  },
  {
    id: '5',
    issuedAt: date,
    description:
      'Problema con el suministro de materiales. Retraso estimado de 1 semana.',
    status: 'APPROVED',
  },
  {
    id: '6',
    issuedAt: date,
    description: 'Finalización de la estructura principal.',
    status: 'APPROVED',
  },
  {
    id: '7',
    issuedAt: date,
    description: 'Inicio de trabajos de instalación eléctrica y fontanería.',
    status: 'APPROVED',
  },
  {
    id: '8',
    issuedAt: date,
    description:
      'Inspección de seguridad realizada. Todos los estándares cumplidos.',
    status: 'APPROVED',
  },
  {
    id: '9',
    issuedAt: date,
    description: 'Inicio de trabajos de acabado interior.',
    status: 'APPROVED',
  },
  {
    id: '10',
    issuedAt: date,
    description:
      'Retraso en la entrega de materiales para acabados. Impacto estimado de 3 días.',
    status: 'PENDING',
  },
]
