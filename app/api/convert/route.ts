import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se ha proporcionado ningún archivo" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const pythonFormData = new FormData()
    const fileBlob = new Blob([buffer], { type: file.type })
    pythonFormData.append("file", fileBlob, file.name)

    const pythonServiceUrl = "https://converterfileobras-production.up.railway.app/convert"

    const response = await axios.post(pythonServiceUrl, pythonFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error al procesar el archivo:", error)

    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500
      const errorMessage = error.response?.data?.error || "Error al conectar con el microservicio Python"

      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

