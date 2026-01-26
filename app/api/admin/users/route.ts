import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/admin/users - Liste de tous les utilisateurs
export async function GET() {
  try {
    const session = await requireAdmin()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé. Accès admin requis.' },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        phone: true,
        vehicleType: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            trips: true,
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Admin users list error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    )
  }
}
