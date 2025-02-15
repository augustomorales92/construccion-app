import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Certificates, Construction } from './types'

interface CardProps {
  construction: Construction
  onClick: () => void
}
export default function CardComponent({ construction, onClick }: CardProps) {
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
    <Card className="overflow-hidden" onClick={onClick}>
      <CardHeader className="p-0">
        <Image
          src={construction.images[0] || '/images/placeholder.svg'}
          alt={`Imagen de ${construction.name}`}
          className="w-full h-48 object-cover"
          width={500}
          height={200}
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl mb-2">{construction.name}</CardTitle>
        <p>
          <strong>Cliente:</strong> {construction.cliente}
        </p>
        <div className="mt-2">
          <p className="font-bold">Avance:</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${calculateProgress(construction.certificados)}%`,
              }}
              role="progressbar"
              aria-valuenow={calculateProgress(construction.certificados)}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          <p>
            {calculateProgress(construction.certificados).toFixed(2)}%
            completado
          </p>
        </div>
        <p>
          <strong>Presupuesto:</strong> $
          {construction.presupuesto?.toLocaleString()}
        </p>
        <p>
          <strong>Total gastado:</strong> $
          {calculateTotalAmount(construction.certificados)?.toLocaleString()}
        </p>
        <p>
          <strong>Tiempo estimado:</strong> {construction.tiempoEstimado}
        </p>
      </CardContent>
    </Card>
  )
}
