import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { status } = await request.json()

    if (!['CONFIRMED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        trip: {
          include: {
            driver: true,
          },
        },
        booker: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 })
    }

    if (booking.trip.driverId !== session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
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

    if (status === 'CONFIRMED') {
      await prisma.trip.update({
        where: { id: booking.tripId },
        data: { status: 'BOOKED' },
      })

      await prisma.notification.create({
        data: {
          userId: booking.bookerId,
          type: 'BOOKING_CONFIRMED',
          title: 'Réservation confirmée',
          message: `Votre réservation pour ${booking.trip.fromCity} → ${booking.trip.toCity} a été confirmée !`,
          link: '/dashboard/bookings',
        },
      })
    } else {
      await prisma.notification.create({
        data: {
          userId: booking.bookerId,
          type: 'BOOKING_CANCELLED',
          title: 'Réservation annulée',
          message: `Votre réservation pour ${booking.trip.fromCity} → ${booking.trip.toCity} a été annulée.`,
          link: '/dashboard/bookings',
        },
      })
    }

    return NextResponse.json({ booking: updatedBooking })
  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        trip: {
          include: {
            driver: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 })
    }

    if (booking.bookerId !== session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    await prisma.booking.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
    })

    await prisma.notification.create({
      data: {
        userId: booking.trip.driverId,
        type: 'BOOKING_CANCELLED',
        title: 'Réservation annulée',
        message: `${session.user.name} a annulé sa réservation pour ${booking.trip.fromCity} → ${booking.trip.toCity}`,
        link: '/dashboard/manage-bookings',
      },
    })

    return NextResponse.json({ message: 'Réservation annulée' })
  } catch (error) {
    console.error('Delete booking error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
