import { Item, ProcessedData, ProcessedItem } from "./types"

// PorccesData para el componente de Vercel (mas lindo)
export const processData = (data: Item[]): ProcessedData => {
  const groupedData =Object.groupBy(data, ({ section }: Item) => section)

  // Asignar letras a las secciones
  const sections: Record<string, { letter: string; items: ProcessedItem[] }> = {}
  let nextLetter = 'A'

  // Procesar cada sección y sus ítems
  Object.keys(groupedData).forEach((sectionName) => {
    const letter = nextLetter
    nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1)

    // Procesar los ítems de esta sección
    const items = (groupedData[sectionName] || []).map((item: Item, index: number) => ({
      ...item,
      code: `${letter}.${index + 1}`,
      subtotal: item.quantity * item.price,
    }))

    sections[sectionName] = { letter, items }
  })

  const total = data.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return { sections, total }
}

// PrepareData para el componente spreedSheet
export const prepareData = (data: Item[]): string[][] => {
  const groupedData = Object.groupBy(data, ({ section }: Item) => section)

  let nextLetter = "A"
  const rows: string[][] = []

  Object.entries(groupedData).forEach(([sectionName, items]) => {
    const letter = nextLetter
    nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1)

    // Agregar fila de encabezado para la sección
    rows.push([
      letter,
      sectionName,
      "", // UT
      "", // CANT
      "", // PRECIO UNIT
      "", // SUBTOTAL
      "", // ACLM ANT
      "", // ACTUAL
      "", // ACLM
    ])

    // Agregar los ítems
    items?.forEach((item, index) => {
      rows.push([
        `${letter}.${index + 1}`,
        item.description,
        item.unit,
        item.quantity.toString(),
        item.price.toString(),
        (item.quantity * item.price).toString(),
        "", // ACLM ANT
        "", // ACTUAL
        "", // ACLM
      ])
    })
  })

  // Agregar fila de total
  const total = data.reduce((sum, item) => sum + item.quantity * item.price, 0)
  rows.push(["", "TOTAL", "", "", "", total.toString(), "", "", ""])

  return rows
}