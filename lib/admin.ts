import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

/**
 * Vérifie si l'utilisateur connecté est un administrateur
 * @returns true si admin, false sinon
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions)
  return session?.user?.role === 'ADMIN'
}

/**
 * Vérifie si l'utilisateur connecté est un administrateur et retourne la session
 * Renvoie null si non admin
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    return null
  }
  
  return session
}
