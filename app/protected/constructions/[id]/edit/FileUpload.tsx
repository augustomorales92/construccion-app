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

export default function UploadFile({ isNewProject, isAdmin }: Props) {
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
    </div>
  )
}
