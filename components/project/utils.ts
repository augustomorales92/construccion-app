import { Item, ProcessedData, ProcessedItem } from "./types"

export const processData = (data: Item[]): ProcessedData => {
  const groupedData =Object.groupBy(data, ({ section }: Item) => section)

  // Asignar letras a las secciones
  const sections: Record<string, { letter: string; items: ProcessedItem[] }> =
    {}
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

  // Calcular el total
  const total = data.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return { sections, total }
}
