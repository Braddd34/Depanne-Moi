import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * PATCH /api/bookings/:id
 * Mettre à jour le statut d'une réservation (accepter/refuser)
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { status } = await request.json()

    if (!['CONFIRMED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      )
    }

    // Récupérer la réservation
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        trip: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est le propriétaire du trajet
    if (booking.trip.driverId !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Mettre à jour la réservation
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
      include: {
        trip: true,
        booker: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    // Si accepté, mettre à jour le statut du trajet
    if (status === 'CONFIRMED') {
      await prisma.trip.update({
        where: { id: booking.tripId },
        data: { status: 'RESERVED' },
      })
    }

    console.log(`✅ Réservation ${params.id} ${status === 'CONFIRMED' ? 'acceptée' : 'refusée'}`)

    return NextResponse.json({ booking: updatedBooking })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la réservation' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/bookings/:id
 * Annuler une réservation
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { trip: true },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est soit le booker, soit le driver
    if (booking.bookerId !== session.user.id && booking.trip.driverId !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Annuler la réservation
    await prisma.booking.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
    })

    console.log(`❌ Réservation ${params.id} annulée`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation de la réservation' },
      { status: 500 }
    )
  }
}
