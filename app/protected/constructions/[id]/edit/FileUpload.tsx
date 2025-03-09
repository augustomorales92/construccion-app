'use client'
import FileUploader from '@/components/project/FileUploader'
import SpreadsheetDialog from '@/components/Spreadsheet'
import { Label } from '@/components/ui/label'

type Props = {
  excelFile: File | null
  setExcelFile: (file: File | null) => void
  isNewProject?: boolean
  isAdmin?: boolean
}

export default function UploadFile({
  excelFile,
  setExcelFile,
  isNewProject,
  isAdmin,
}: Props) {
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setExcelFile(e.target.files[0])
    }
  }

  return (
    <div className="py-2 flex flex-col gap-2 mt-2">
      <span className="w-full flex items-center justify-between">
        <Label htmlFor="excel">Desglose de Materiales (Excel)</Label>
        <SpreadsheetDialog
          title={
            isNewProject ? 'Añadir materiales manualmente' : 'Editar Materiales'
          }
          isCreation={isNewProject}
          isAdmin={isAdmin}
        />
      </span>
      <FileUploader />
      {/* <div className="mt-2">
        <Input
          id="excel"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleExcelUpload}
          className="hidden"
        />
        <Label
          htmlFor="excel"
          className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md"
        >
          <div className="space-y-1 text-center">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <span className="relative font-medium text-blue-600 hover:underline focus-within:outline-hidden focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                Subir archivo Excel
              </span>
            </div>
            <p className="text-xs text-gray-500">XLSX, XLS hasta 10 MB</p>
          </div>
        </Label>
        {excelFile && (
          <div className="mt-2">
            <p>Archivo seleccionado: {excelFile.name}</p>
          </div>
        )}
      </div> */}
    </div>
  )
}
