import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import { Certificates, Construction } from '../../lib/types'

interface CardProps {
  construction: Construction
  onClick: () => void
  isFavorite?: boolean
  isBlur?: boolean
}
export default function CardComponent({
  construction,
  onClick,
  isFavorite,
  isBlur,
}: CardProps) {
  const calculateTotalAmount = (certificados: Certificates[]) => {
    return certificados?.reduce((total, cert) => total + cert.montoGastado, 0)
  }

  const calculateProgress = (certificados: Certificates[]) => {
    if (!certificados?.length) return 0
    return (
      certificados?.reduce((total, cert) => total + cert.avance, 0) /
      certificados.length
    )
  }

  return (
    <Card
      className={`overflow-hidden shadow-md shadow-current ${isBlur ? 'blur-sm' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="p-0 relative">
        <Image
          src={construction.images[0] || '/images/placeholder.svg'}
          alt={`Imagen de ${construction.name}`}
          className="w-full h-48 object-cover"
          width={500}
          height={200}
        />
        {isFavorite && (
          <div className="absolute top-2 right-4">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl mb-2">{construction.name}</CardTitle>
        <p>
          <strong>Cliente:</strong> {construction.customer.name}
        </p>
        <div className="mt-2">
          <p className="font-bold">Avance:</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${calculateProgress(construction.certificates)}%`,
              }}
              role="progressbar"
              aria-valuenow={calculateProgress(construction.certificates)}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          <p>
            {calculateProgress(construction.certificates).toFixed(2)}%
            completado
          </p>
        </div>
        <p>
          <strong>Presupuesto:</strong> $
          {construction.budget?.toLocaleString()}
        </p>
        <p>
          <strong>Total gastado:</strong> $
          {calculateTotalAmount(construction.certificates)?.toLocaleString()}
        </p>
        <p>
          <strong>Tiempo estimado:</strong> {construction.estimatedTime}
        </p>
      </CardContent>
    </Card>
  )
}
