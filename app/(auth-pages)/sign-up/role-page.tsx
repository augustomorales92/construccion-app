import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Briefcase,
  Building,
  FileText,
  MessageCircle,
  Smartphone,
  User,
} from 'lucide-react'
import type React from 'react'

interface RoleSelectionProps {
  role: string | null
  setRole: (role: string) => void
}

export default function RoleSelection({ role, setRole }: RoleSelectionProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        ¿Sos cliente o contratista?
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <RoleCard
          title="Cliente"
          description="Gestiona tus proyectos y comunícate con tu contratista"
          icon={<User className="w-12 h-12 mb-4" />}
          features={[
            {
              icon: <Building className="w-5 h-5" />,
              text: 'Ver tus obras en curso',
            },
            {
              icon: <FileText className="w-5 h-5" />,
              text: 'Hacer seguimiento diario',
            },
            {
              icon: <MessageCircle className="w-5 h-5" />,
              text: 'Comunicarte con tu contratista',
            },
          ]}
          onClick={() => setRole('USER')}
          selected={role === 'USER'}
        />
        <RoleCard
          title="Contratista"
          description="Administra tus proyectos y mantén todo organizado"
          icon={<Briefcase className="w-12 h-12 mb-4" />}
          features={[
            {
              icon: <FileText className="w-5 h-5" />,
              text: 'Manejo de certificados',
            },
            {
              icon: <Smartphone className="w-5 h-5" />,
              text: 'Seguimiento diario vía WhatsApp',
            },
            {
              icon: <Building className="w-5 h-5" />,
              text: 'Toda tu info en un solo lugar',
            },
          ]}
          onClick={() => setRole('ADMIN')}
          selected={role === 'ADMIN'}
        />
      </div>
    </div>
  )
}

interface RoleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  features: { icon: React.ReactNode; text: string }[]
  onClick: () => void
  selected: boolean
}

function RoleCard({
  title,
  description,
  icon,
  features,
  onClick,
  selected,
}: RoleCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="text-center">
        <CardTitle className="text-lg md:text-2xl mb-2">
          <span className='flex items-center justify-around'>
            {icon}
            {title}
          </span>
        </CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-3">
              {feature.icon}
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
        <Button
          className="w-full mt-6"
          variant={selected ? 'default' : 'outline'}
        >
          {selected ? 'Seleccionado' : `Elegir como ${title}`}
        </Button>
      </CardContent>
    </Card>
  )
}
