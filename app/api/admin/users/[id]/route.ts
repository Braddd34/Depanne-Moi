import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/admin/users/[id] - Détails complets d'un utilisateur
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé. Accès admin requis.' },
        { status: 403 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        trips: {
          include: {
            bookings: {
              include: {
                booker: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        bookings: {
          include: {
            trip: {
              include: {
                driver: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Ne pas exposer le mot de passe
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Admin user detail error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des détails utilisateur' },
      { status: 500 }
    )
  }
}
