import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const createBookingSchema = z.object({
  tripId: z.string(),
})

// POST /api/bookings - Réserver un trajet
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = createBookingSchema.parse(body)

    // Vérifier que le trajet existe et est disponible
    const trip = await prisma.trip.findUnique({
      where: { id: data.tripId },
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trajet non trouvé' },
        { status: 404 }
      )
    }

    if (trip.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Ce trajet n\'est plus disponible' },
        { status: 400 }
      )
    }

    if (trip.driverId === session.user.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas réserver votre propre trajet' },
        { status: 400 }
      )
    }

    // Vérifier qu'il n'y a pas déjà une réservation en attente
    const existingBooking = await prisma.booking.findFirst({
      where: {
        tripId: data.tripId,
        bookerId: session.user.id,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Vous avez déjà réservé ce trajet' },
        { status: 400 }
      )
    }

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        tripId: data.tripId,
        bookerId: session.user.id,
        status: 'PENDING',
      },
      include: {
        trip: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                phone: true,
                company: true,
              },
            },
          },
        },
        booker: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    })

    // Mettre à jour le statut du trajet
    await prisma.trip.update({
      where: { id: data.tripId },
      data: { status: 'RESERVED' },
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create booking error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réservation' },
      { status: 500 }
    )
  }
}

// GET /api/bookings - Liste des réservations de l'utilisateur
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { bookerId: session.user.id },
          {
            trip: {
              driverId: session.user.id,
            },
          },
        ],
      },
      include: {
        trip: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                phone: true,
                company: true,
              },
            },
          },
        },
        booker: {
          select: {
            id: true,
            name: true,
            phone: true,
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    )
  }
}
