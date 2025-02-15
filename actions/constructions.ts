"use server";

import { Incidents } from "@/components/landing/types";

const constructions = [
  {
    id: 1,
    name: "Casa Moderna",
    cliente: "Juan Pérez",
    avance: 30,
    presupuesto: 500000,
    materialesComprados: ["Cemento", "Ladrillos", "Acero"],
    tiempoEstimado: "6 meses",
    description: "Construcción de una casa moderna de dos pisos.",
    images: ["/images/placeholder.svg?height=200&width=300"],
    certificados: [],
    password: "1234",
  },
  {
    id: 2,
    name: "Oficina Comercial",
    cliente: "Empresas XYZ",
    avance: 60,
    presupuesto: 750000,
    materialesComprados: ["Vidrio", "Aluminio", "Cableado"],
    tiempoEstimado: "4 meses",
    description:
      "Remodelación de oficinas comerciales en el centro de la ciudad.",
    images: ["/images/placeholder.svg?height=200&width=300"],
    certificados: [],
    password: "3456",
  },
];

const sampleIncidents: Incidents[] = [
  {
    id: "1",
    date: "2023-05-15",
    content: "Inicio de la excavación para los cimientos.",
  },
  {
    id: "2",
    date: "2023-05-20",
    content:
      "Retraso debido a lluvias intensas. Trabajo suspendido por 2 días.",
  },
  {
    id: "3",
    date: "2023-06-01",
    content: "Finalización de la colocación de cimientos.",
  },
  {
    id: "4",
    date: "2023-06-15",
    content: "Inicio de la construcción de la estructura principal.",
  },
  {
    id: "5",
    date: "2023-07-01",
    content:
      "Problema con el suministro de materiales. Retraso estimado de 1 semana.",
  },
  {
    id: "6",
    date: "2023-07-15",
    content: "Finalización de la estructura principal.",
  },
  {
    id: "7",
    date: "2023-08-01",
    content: "Inicio de trabajos de instalación eléctrica y fontanería.",
  },
  {
    id: "8",
    date: "2023-08-20",
    content:
      "Inspección de seguridad realizada. Todos los estándares cumplidos.",
  },
  {
    id: "9",
    date: "2023-09-01",
    content: "Inicio de trabajos de acabado interior.",
  },
  {
    id: "10",
    date: "2023-09-15",
    content:
      "Retraso en la entrega de materiales para acabados. Impacto estimado de 3 días.",
  },
];

export async function getConstructions() {
  // Aquí iría la lógica para obtener todas las obras de la base de datos
  return constructions;
}

export async function verifyPassword(constructionId: number, password: string) {
  const construction = constructions.find((c) => c.id === constructionId);
  return construction?.password === password;
}

export async function getConstructionById(id: number) {
  // Aquí iría la lógica para obtener una obra específica de la base de datos

  return constructions.find((obra) => obra.id === id) || null;
}

export async function getIncidentsByConstructionId(
  id: number,
): Promise<Incidents[]> {
  // Aquí iría la lógica para obtener todas las incidencias de una obra específica
  console.log(id);
  return sampleIncidents;
}
