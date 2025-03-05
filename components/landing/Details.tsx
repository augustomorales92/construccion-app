'use client'
import { toggleUserFavorite } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import useUser from '@/hooks/use-user'
import Cookies from 'js-cookie'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  FileText,
  Heart,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Certificates, Construction, Incidents } from '../../lib/types'
import SpreadsheetDialog from '../Spreadsheet'
import CertificateModal from './CertificateModal'
import { ConstructionIncidentsTimeline } from './IncidentsTimeline'
import PasswordModal from './PasswordModal'
import { WhatsAppShareLinkPopover } from './ShareComponent'

interface CardProps {
  construction?: Construction | null
  incidents?: Incidents[] | null
  isFavorite?: boolean
  backUrl?: string
  showPasswordModal?: boolean
}

export default function CardComponent({
  construction,
  incidents,
  isFavorite,
  backUrl,
  showPasswordModal,
}: CardProps) {
  const router = useRouter()
  const { user, isAdmin } = useUser()
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const pathname = usePathname()
  const isProtected = pathname.includes('/protected')
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
    return construction?.certificates?.reduce(
      (total, cert) => total + cert.montoGastado,
      0,
    )
  }

  const calcularAvancePromedio = () => {
    if (!construction?.certificates?.length) return 0
    return (
      construction?.certificates?.reduce(
        (total, cert) => total + cert.avance,
        0,
      ) / construction?.certificates.length
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

  const toggleFavorite = async () => {
    if (user) {
      await toggleUserFavorite(String(construction?.id))
    } else {
      Cookies.set('favorite', String(construction?.id))
      router.push('/sign-in')
    }
  }

  return (
    <div className="container mx-auto py-4">
      <div className={`${showPasswordModal ? 'blur-md' : ''}`}>
        <div
          className={`mb-4 flex justify-between items-center ${
            isAdmin ? 'flex-col' : 'flex-row'
          } sm:flex-row gap-2 w-full`}
        >
          <span className="flex w-full ">
            <Button
              variant="ghost"
              onClick={() => router.push(backUrl ?? '/protected/constructions')}
              className="flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </span>

          <span className="grid grid-cols-2 md:flex items-center gap-4 w-full justify-between sm:justify-end">
            {isAdmin && (
              <>
                <Link
                  href={`/protected/constructions/${construction?.id}/edit`}
                  className="flex items-center w-full"
                >
                  <Button
                    variant="outline"
                    className="flex items-center w-full"
                  >
                    <Edit className="mr-1 h-4 w-4" /> Editar
                  </Button>
                </Link>
                <WhatsAppShareLinkPopover id={String(construction?.id)} />
              </>
            )}
            <ConstructionIncidentsTimeline incidents={incidents || []} />
          </span>
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
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
                    index === currentPhotoIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
            {!isProtected && (
              <span
                className="absolute translate-x-1/5 top-6 right-6 transform -translate-y-1/2"
                onClick={toggleFavorite}
              >
                <Heart
                  className={`h-6 w-6 ${
                    isFavorite ? 'text-red-500 fill-red-500' : 'text-black'
                  }`}
                />
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
                <strong>Cliente:</strong> {construction?.customer.name}
              </p>
              <p>
                <strong>Presupuesto:</strong> $
                {construction?.budget.toLocaleString()}
              </p>
              <p>
                <strong>Total gastado:</strong> $
                {calcularTotalGastado()?.toLocaleString()}
              </p>
              <p>
                <strong>Tiempo estimado:</strong> {construction?.estimatedTime}
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
            <CardContent className="p-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold ">Materiales Comprados</h2>

              <SpreadsheetDialog isAdmin={isAdmin} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="flex items-center">
                  <h2 className="text-xl font-semibold">certificates</h2>
                </span>
                {isAdmin && (
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
              {construction?.certificates?.length ? (
                <ul className="space-y-2">
                  {construction?.certificates.map((certificado) => (
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
                <p>No hay certificates disponibles.</p>
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
      {showPasswordModal && (
        <PasswordModal
          isOpen={showPasswordModal}
          onClose={() => {
            //router.push('/')
          }}
          card={construction}
        />
      )}
    </div>
  )
}
