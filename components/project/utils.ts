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

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value)
}

export const convertDataToSpreadsheetFormat = (data:ProcessedData)=> {
  const spreadsheetData: string[][] = []

  Object.entries(data.sections).forEach(([sectionName, { letter, items }]) => {
    spreadsheetData.push([letter, sectionName, "", "", "", "", ""])

    items.forEach((item) => {
      spreadsheetData.push([
        item.code,
        item.section,
        item.description,
        item.unit,
        item.quantity.toString(),
        item.price.toLocaleString("es-AR"),
        formatCurrency(item.subtotal).replace("ARS", "").trim(),
      ])
    })
  })

  spreadsheetData.push(["", "", "", "", "", "TOTAL:", formatCurrency(data.total).replace("ARS", "").trim()])

  return spreadsheetData
}