
'use server'
import jwt from 'jsonwebtoken'
import { config } from './config'
import { isValidMail } from './utils'

const SECRET_KEY = config.JWT_SECRET || 'clave-super-secreta'

export const generateInvitationToken = async (email: string, role: string, obraId: string) => {
  return  jwt.sign({ email, role, obraId }, SECRET_KEY, { expiresIn: '7d' })
}

export const generateWhatsappMessage = async (
  email: string,
  type: string,
  obraId: string
) => {

  const validEmail = isValidMail(email)

  if ( !validEmail) return null

  const role = type === 'manager' ? 'MANAGER' : 'ADMIN'

  const token = await generateInvitationToken(email, role, obraId)

  return `Hola, te invito a unirte a ConstructApp. Registrate aquí: ${config.NEXT_PUBLIC_APP_URL}/auth/register?token=${token}`
}
