import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/db'

//  ESTA RUT ALA CREE PARA RECUPERAR EL TOKEN EN POSTMAN Y QUE ME DEJE INTERACTUAR COMO AUTH USER

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 },
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json(
      {
        message: 'Login exitoso',
        user: data.user,
        session: data.session,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const certificates = await prisma.user.findMany({
      include: { projects: true },
    })
    return NextResponse.json(certificates)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error obteniendo certificados' },
      { status: 500 },
    )
  }
}
