'use server'
import jwt from 'jsonwebtoken'
import { config } from './config'

const SECRET_KEY = config.JWT_SECRET || 'clave-super-secreta'

export const generateInvitationToken = async (role: string, obraId: string) => {
  return jwt.sign({ role, obraId }, SECRET_KEY, { expiresIn: '7d' })
}

export const generateWhatsappMessage = async (obraId: string) => {
  const role = 'CLIENT'

  const token = await generateInvitationToken(role, obraId)

  return `Hola, te invito a seguir todos los avances que estamos realizando en la obra. Haz click en el siguiente enlace para ver detalles: ${process.env.NEXT_PUBLIC_BASE_URL}/?token=${token}`
}
