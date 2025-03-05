import { Incidents } from './types'

export const clientsSample = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '123-456-7890',
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria@example.com',
    phone: '098-765-4321',
  },
]

export const managerSample = [
  {
    id: 1,
    name: 'Pedro',
    email: '',
    phone: '',
  },
  {
    id: 2,
    name: 'Luis',
    email: '',
    phone: '',
  },
]

export const constructions = [
  {
    id: '1',
    name: 'Casa Moderna',
    customer: clientsSample[0],
    progressPercent: 30,
    budget: 500000,
    materialsPurchased: ['Cemento', 'Ladrillos', 'Acero'],
    estimatedTime: '6 meses',
    description: 'Construcción de una casa moderna de dos pisos.',
    images: ['/images/placeholder.svg?height=200&width=300'],
    certificates: [],
    password: '1234',
    ref: '#234234234234',
    manager: managerSample[0],
    status: 'En progreso',
  },
  {
    id: '2',
    name: 'Oficina Comercial',
    customer: clientsSample[1],
    progressPercent: 60,
    budget: 750000,
    materialsPurchased: ['Vidrio', 'Aluminio', 'Cableado'],
    estimatedTime: '4 meses',
    description:
      'Remodelación de oficinas comerciales en el centro de la ciudad.',
    images: ['/images/placeholder.svg?height=200&width=300'],
    certificates: [],
    password: '3456',
    ref: '#2352543534',
    manager: managerSample[1],
    status: 'En progreso',
  },
  {
    id: '3',
    name: 'Edificio 3 plantas',
    customer: clientsSample[1],
    progressPercent: 60,
    budget: 750000,
    materialsPurchased: ['Vidrio', 'Aluminio', 'Cableado'],
    estimatedTime: '8 meses',
    description:
      'Construcción de un edificio de 3 plantas en el centro de la ciudad.',
    images: ['/images/placeholder.svg?height=200&width=300'],
    certificates: [],
    password: '1111',
    ref: '#5432349',
    manager: managerSample[0],
    status: 'En progreso',
  },
]

export const sampleIncidents: Incidents[] = [
  {
    id: '1',
    date: '2023-05-15',
    content: 'Inicio de la excavación para los cimientos.',
  },
  {
    id: '2',
    date: '2023-05-20',
    content:
      'Retraso debido a lluvias intensas. Trabajo suspendido por 2 días.',
  },
  {
    id: '3',
    date: '2023-06-01',
    content: 'Finalización de la colocación de cimientos.',
  },
  {
    id: '4',
    date: '2023-06-15',
    content: 'Inicio de la construcción de la estructura principal.',
  },
  {
    id: '5',
    date: '2023-07-01',
    content:
      'Problema con el suministro de materiales. Retraso estimado de 1 semana.',
  },
  {
    id: '6',
    date: '2023-07-15',
    content: 'Finalización de la estructura principal.',
  },
  {
    id: '7',
    date: '2023-08-01',
    content: 'Inicio de trabajos de instalación eléctrica y fontanería.',
  },
  {
    id: '8',
    date: '2023-08-20',
    content:
      'Inspección de seguridad realizada. Todos los estándares cumplidos.',
  },
  {
    id: '9',
    date: '2023-09-01',
    content: 'Inicio de trabajos de acabado interior.',
  },
  {
    id: '10',
    date: '2023-09-15',
    content:
      'Retraso en la entrega de materiales para acabados. Impacto estimado de 3 días.',
  },
]
