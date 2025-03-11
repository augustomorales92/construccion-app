import axios from "axios"

export const downloadPdf = async (certificateId: string) => {
    try {
      const response = await axios.post(
        "/api/pdf-generate",
        { certificateId }, 
        {
          responseType: "blob", 
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
          },
        },
      )
  
      if (response.status !== 200) {
        throw new Error("Error al generar el PDF")
      }
  
      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `certificado-${certificateId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (error) {
      console.error("Error al descargar el PDF:", error)
      // Muestro toast con error
    }
  }