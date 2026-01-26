import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/trips/[id] - Détail d'un trajet
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            company: true,
            phone: true,
            vehicleType: true,
            email: true,
          },
        },
        bookings: {
          include: {
            booker: {
              select: {
                id: true,
                name: true,
                phone: true,
                company: true,
              },
            },
          },
        },
      },
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trajet non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ trip })
  } catch (error) {
    console.error('Get trip error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du trajet' },
      { status: 500 }
    )
  }
}
