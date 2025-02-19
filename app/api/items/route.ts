import prisma from '@/lib/db'
import { itemsSchema } from '@/schemas'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const items = await prisma.item.findMany({
        include: { certificateItems: true },
      })
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error obteniendo items' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsedData = itemsSchema.safeParse(body)
    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsedData.error.format() },
        { status: 400 },
      )
    }

    if (!Array.isArray(body)) {
      const newItem = await prisma.item.create({ data: body })
      return NextResponse.json(newItem, { status: 201 })
    }

    const newItems = await prisma.item.createMany({ data: body })

    return NextResponse.json(
      { success: true, count: newItems.count },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: 'Error creando item' }, { status: 500 })
  }
}
