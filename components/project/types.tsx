// Definir la estructura de los datos
export interface Item {
  section: string
  description: string
  unit: string
  quantity: number
  price: number
}

export interface ProcessedItem extends Item {
  code: string
  subtotal: number
}

export interface ProcessedData {
  sections: {
    [key: string]: {
      letter: string
      items: ProcessedItem[]
    }
  }
  total: number
}

export type SpreadsheetData = string[][]