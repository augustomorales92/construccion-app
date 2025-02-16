'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { User } from '@supabase/supabase-js'
import Cookies from 'js-cookie'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  FileText,
  Heart,
  MessageSquare,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import CertificateModal from './CertificateModal'
import { ConstructionIncidentsTimeline } from './IncidentsTimeline'
import PasswordModal from './PasswordModal'
import { WhatsAppShareLinkPopover } from './ShareComponent'
import { Certificates, Construction, Incidents } from './types'

interface CardProps {
  construction: Construction | null
  incidents: Incidents[]
  user: User | null
  isIncorrectPassword?: boolean
  isFavorite?: boolean
}

export default function CardComponent({
  construction,
  incidents,
  user,
  isIncorrectPassword,
  isFavorite,
}: CardProps) {
  const router = useRouter()
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [PasswordModalOpen, setPasswordModalOpen] = useState(false)
  const userRole = user?.role
  const imagesLength = construction?.images?.length || 1

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % imagesLength)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex(
      (prevIndex) => (prevIndex - 1 + imagesLength) % imagesLength,
    )
  }

  const calcularTotalGastado = () => {
    return construction?.certificados?.reduce(
      (total, cert) => total + cert.montoGastado,
      0,
    )
  }

  const calcularAvancePromedio = () => {
    if (!construction?.certificados?.length) return 0
    return (
      construction?.certificados?.reduce(
        (total, cert) => total + cert.avance,
        0,
      ) / construction?.certificados.length
    )
  }

  const handleAddCertificado = () => {
    setModalOpen(true)
  }

  const onCertificateAdded = (
    ConstructionId?: string,
    newCertificate?: Certificates,
  ) => {
    // Add the new certificado to the Construction
    console.log('Certificado added:', ConstructionId, newCertificate)
    setModalOpen(false)
  }

  const handleAddFavorite = () => {
    if (!userRole) {
      Cookies.set('favorite', String(construction?.id))
      router.push('/sign-in')
    }
  }

  useEffect(() => {
    if (isIncorrectPassword) {
      setPasswordModalOpen(true)
    }
    Cookies.remove('password')
  }, [isIncorrectPassword])

  return (
    <div className="container mx-auto py-4">
      <div className={`${isIncorrectPassword ? 'blur-md' : ''}`}>
        <div
          className={`mb-4 flex justify-between items-center ${userRole === 'ADMIN' ? 'flex-col' : 'flex-row'} sm:flex-row gap-2 w-full`}
        >
          <span className="flex w-full ">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </span>
          {userRole === 'ADMIN' && (
            <span className="flex items-center gap-4 w-full justify-between sm:justify-end">
              <Link href={`/Constructions/${construction?.id}/editar`}>
                <Button variant="outline" className="flex items-center">
                  <Edit className="mr-1 h-4 w-4" /> Editar Construction
                </Button>
              </Link>
              <Link
                href={`/mensajes?Construction=${construction?.id}&role=${userRole}`}
              >
                <Button variant="outline" className="flex items-center">
                  <MessageSquare className="mr-1 h-4 w-4" /> Enviar Mensaje
                </Button>
              </Link>
              <WhatsAppShareLinkPopover id={String(construction?.id)} />
            </span>
          )}
          <ConstructionIncidentsTimeline incidents={incidents} />
        </div>

        <h1 className="text-3xl font-bold mb-6">{construction?.name}</h1>

        <Card className="mb-8">
          <CardContent className="p-0 relative">
            <div className="relative h-[25rem] w-full">
              {construction?.images.map((foto, index) => (
                <Image
                  key={index}
                  width={500}
                  height={500}
                  src={foto || '/images/placeholder.svg'}
                  alt={`Foto ${index + 1} de la Construction`}
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentPhotoIndex ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
            </div>
            {isFavorite ? (
              <span className="absolute translate-x-1/5 top-6 right-6 transform -translate-y-1/2">
                <Heart className="h-6 w-6 text-red-500 fill-red-500" />
              </span>
            ) : (
              <span
                className="absolute translate-x-1/5 top-6 right-6 transform -translate-y-1/2"
                onClick={handleAddFavorite}
              >
                <Heart className="h-4 w-4 mr-1" />
              </span>
            )}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 transform -translate-y-1/2"
              onClick={prevPhoto}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 transform -translate-y-1/2"
              onClick={nextPhoto}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Detalles de la Construction
              </h2>
              <p>
                <strong>Cliente:</strong> {construction?.cliente}
              </p>
              <p>
                <strong>Presupuesto:</strong> $
                {construction?.presupuesto.toLocaleString()}
              </p>
              <p>
                <strong>Total gastado:</strong> $
                {calcularTotalGastado()?.toLocaleString()}
              </p>
              <p>
                <strong>Tiempo estimado:</strong> {construction?.tiempoEstimado}
              </p>
              <div className="mt-4">
                <p className="font-bold">Avance:</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${calcularAvancePromedio()}%` }}
                    role="progressbar"
                    aria-valuenow={calcularAvancePromedio()}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
                <p>{calcularAvancePromedio().toFixed(2)}% completado</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Descripción</h2>
              <p>{construction?.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Materiales Comprados
              </h2>
              <ul className="list-disc list-inside">
                {construction?.materialesComprados.map((material, index) => (
                  <li key={index}>{material}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="flex items-center">
                  <h2 className="text-xl font-semibold">Certificados</h2>
                </span>
                {userRole === 'ADMIN' && (
                  <Button
                    variant="outline"
                    onClick={() => handleAddCertificado()}
                    className="min-w-36"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Certificado
                  </Button>
                )}
              </div>
              {construction?.certificados?.length ? (
                <ul className="space-y-2">
                  {construction?.certificados.map((certificado) => (
                    <li
                      key={certificado.id}
                      className="flex justify-between items-center"
                    >
                      <span>Certificado #{certificado.id}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(certificado.archivo, '_blank')
                        }
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay certificados disponibles.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {modalOpen && (
        <CertificateModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onCertificateAdded={(newCertificate) =>
            onCertificateAdded(construction?.id, newCertificate)
          }
        />
      )}
      {PasswordModalOpen && (
        <PasswordModal
          isOpen={PasswordModalOpen}
          onClose={() => {
            router.push('/')
          }}
          card={construction}
        />
      )}
    </div>
  )
}
