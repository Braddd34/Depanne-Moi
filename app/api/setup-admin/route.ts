import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { secret } = await request.json()
    
    // Sécurité basique
    if (secret !== 'setup-admin-now-123') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    console.log('🚀 Démarrage de la configuration admin...')

    // Créer le compte admin
    const email = 'm.elfakir@outlook.fr'
    const password = 'Admin145896'
    const hashedPassword = await bcrypt.hash(password, 10)

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    let result

    if (existingUser) {
      console.log('Mise à jour utilisateur existant...')
      result = await prisma.user.update({
        where: { email },
        data: {
          role: 'ADMIN',
          password: hashedPassword,
        },
      })
    } else {
      console.log('Création nouveau compte admin...')
      result = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Mehdi El Fakir',
          phone: '+33600000000',
          role: 'ADMIN',
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Compte admin créé avec succès',
      admin: {
        email: result.email,
        name: result.name,
        role: result.role,
      },
    })

  } catch (error: any) {
    console.error('Erreur setup admin:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
