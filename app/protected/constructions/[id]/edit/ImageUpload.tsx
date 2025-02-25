import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'

type Props = {
  images: File[]
  setImages: (images: File[]) => void
}

export default function ImageUpload({ images, setImages }: Props) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 5 - images.length)
      setImages([...images, ...newImages])
      /* setObraData((prev) => ({
        ...prev,
        imagenes: [
          ...prev.imagenes,
          ...newImages.map((file) => URL.createObjectURL(file)),
        ],
      })) */
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newImages = Array.from(e.dataTransfer.files).slice(
        0,
        5 - images.length,
      )
      setImages([...images, ...newImages])
      /* setObraData((prev) => ({
        ...prev,
        imagenes: [
          ...prev.imagenes,
          ...newImages.map((file) => URL.createObjectURL(file)),
        ],
      }))
      */
    }
  }

  return (
    <div className='py-2 flex flex-col gap-2 mt-2'>
      <Label htmlFor="imagenes">Imágenes</Label>
      <div className="mt-2">
        <Input
          id="imagenes"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <Label
          htmlFor="imagenes"
          className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <span className="relative font-medium text-blue-600 hover:underline focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                Subir imágenes
              </span>
              <p className="pl-1">o arrastrar y soltar</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 5 MB</p>
          </div>
        </Label>
        {images.length > 0 && (
          <div className="mt-2">
            <p>{images.length} imagen(es) seleccionada(s)</p>
          </div>
        )}
      </div>
    </div>
  )
}
