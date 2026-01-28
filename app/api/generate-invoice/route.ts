import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { generateTripInvoicePDF, generateBookingInvoicePDF } from '@/lib/pdf-generator'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { type, id } = body // type: 'trip' ou 'booking', id: l'ID de l'élément

    if (!type || !id) {
      return NextResponse.json({ error: 'Type et ID requis' }, { status: 400 })
    }

    if (type === 'trip') {
      // Générer facture pour un trajet
      const trip = await prisma.trip.findUnique({
        where: { id },
        include: {
          driver: {
            select: {
              name: true,
              company: true,
              phone: true,
            },
          },
        },
      })

      if (!trip) {
        return NextResponse.json({ error: 'Trajet non trouvé' }, { status: 404 })
      }

      // Vérifier que l'utilisateur est le conducteur
      if (trip.driverId !== session.user.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }

      // Générer le PDF (convertir les dates en strings)
      const tripData = {
        ...trip,
        date: trip.date.toISOString(),
      }
      const doc = generateTripInvoicePDF(tripData as any, session.user)
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="facture-trajet-${trip.id.substring(0, 8)}.pdf"`,
        },
      })
    } else if (type === 'booking') {
      // Générer facture pour une réservation
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          trip: {
            include: {
              driver: {
                select: {
                  name: true,
                  company: true,
                  phone: true,
                },
              },
            },
          },
        },
      })

      if (!booking) {
        return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 })
      }

      // Vérifier que l'utilisateur est le client
      if (booking.bookerId !== session.user.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }

      // Générer le PDF (convertir les dates en strings)
      const bookingData = {
        ...booking,
        createdAt: booking.createdAt.toISOString(),
        trip: {
          ...booking.trip,
          date: booking.trip.date.toISOString(),
        },
      }
      const doc = generateBookingInvoicePDF(bookingData as any, session.user)
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="facture-reservation-${booking.id.substring(0, 8)}.pdf"`,
        },
      })
    } else {
      return NextResponse.json({ error: 'Type invalide' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
