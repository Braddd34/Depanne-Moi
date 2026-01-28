import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const where: any = {}
    if (type === 'driver') {
      where.trip = { driverId: session.user.id }
    } else {
      where.bookerId = session.user.id
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        trip: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                company: true,
                phone: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { tripId } = await request.json()

    if (!tripId) {
      return NextResponse.json({ error: 'tripId requis' }, { status: 400 })
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    })

    if (!trip) {
      return NextResponse.json({ error: 'Trajet introuvable' }, { status: 404 })
    }

    if (trip.driverId === session.user.id) {
      return NextResponse.json({ error: 'Vous ne pouvez pas réserver votre propre trajet' }, { status: 400 })
    }

    if (trip.status !== 'AVAILABLE') {
      return NextResponse.json({ error: 'Ce trajet n\'est plus disponible' }, { status: 400 })
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        tripId,
        bookerId: session.user.id,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    })

    if (existingBooking) {
      return NextResponse.json({ error: 'Vous avez déjà une réservation pour ce trajet' }, { status: 400 })
    }

    const booking = await prisma.booking.create({
      data: {
        tripId,
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
                company: true,
                phone: true,
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

    await prisma.notification.create({
      data: {
        userId: trip.driverId,
        type: 'BOOKING_REQUEST',
        title: 'Nouvelle demande de réservation',
        message: `${session.user.name} souhaite réserver votre trajet ${trip.fromCity} → ${trip.toCity}`,
        link: '/dashboard/manage-bookings',
      },
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
