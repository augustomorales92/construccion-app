import { Label } from '@/components/ui/label'
import { UploadDropzone } from '@/lib/uploadthing'

type Props = {
  images: File[]
  setImages: (images: File[]) => void
}

export default function ImageUpload({ images, setImages }: Props) {
  return (
    <div className="py-2 flex flex-col gap-2 mt-2">
      <Label htmlFor="imagenes">Imágenes</Label>

      <div className="cursor-pointer flex items-center justify-center w-full h-full border-2 border-dashed rounded-md">
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log('Files: ', res)
            setImages([])
            alert('Upload Completed')
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`)
          }}
          className="border-none w-full h-full"
          content={{
            label: 'Selecciona o arrastra las imágenes',
            button({ ready }) {
              if (ready) return <div>Subir imagenes</div>
              return 'Subiendo...'
            },
            allowedContent: 'imagen (4MB)',
          }}
        />

        {images.length > 0 && (
          <div className="mt-2">
            <p>{images.length} imagen(es) seleccionada(s)</p>
          </div>
        )}
      </div>
    </div>
  )
}
