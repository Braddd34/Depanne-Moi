import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNotification, emailTemplates } from '@/lib/notifications'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * API route temporaire pour tester l'envoi d'emails
 * À SUPPRIMER après utilisation
 */
export async function POST(request: Request) {
  try {
    console.log('📧 Début du test d\'envoi d\'emails...')

    // 1. Trouver les 2 comptes de test
    const driver = await prisma.user.findUnique({
      where: { email: 'm.elfakir@outlook.fr' },
    })

    const client = await prisma.user.findUnique({
      where: { email: 'm.elfakir+test@outlook.fr' },
    })

    if (!driver || !client) {
      return NextResponse.json({
        success: false,
        error: 'Comptes de test non trouvés',
        details: {
          driver: driver ? '✅' : '❌',
          client: client ? '✅' : '❌',
        },
      }, { status: 404 })
    }

    console.log('✅ Comptes trouvés')

    // 2. Créer un trajet de test
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const trip = await prisma.trip.create({
      data: {
        driverId: driver.id,
        fromCity: 'Paris',
        toCity: 'Lyon',
        date: tomorrow,
        vehicleType: 'Camion',
        price: 150,
        status: 'AVAILABLE',
      },
    })

    console.log('✅ Trajet créé:', trip.id)

    // 3. Créer une réservation
    const booking = await prisma.booking.create({
      data: {
        tripId: trip.id,
        bookerId: client.id,
        status: 'PENDING',
      },
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

    console.log('✅ Réservation créée:', booking.id)

    // 4. Mettre à jour le statut du trajet
    await prisma.trip.update({
      where: { id: trip.id },
      data: { status: 'RESERVED' },
    })

    // 5. Envoyer l'email au chauffeur
    console.log('📧 Envoi email au chauffeur...')
    const driverEmailData = emailTemplates.newBooking(
      trip,
      client.name,
      client.phone,
      client.email || ''
    )
    
    const driverEmailResult = await sendNotification({
      to: driver.email || '',
      subject: driverEmailData.subject,
      message: driverEmailData.message,
    })

    console.log('Résultat email chauffeur:', driverEmailResult)

    // 6. Envoyer l'email au client
    console.log('📧 Envoi email au client...')
    const clientEmailData = emailTemplates.bookingConfirmation(
      trip,
      driver.name,
      driver.phone,
      driver.email || ''
    )
    
    const clientEmailResult = await sendNotification({
      to: client.email || '',
      subject: clientEmailData.subject,
      message: clientEmailData.message,
    })

    console.log('Résultat email client:', clientEmailResult)

    // 7. Nettoyer (supprimer le trajet et la réservation de test)
    await prisma.booking.delete({ where: { id: booking.id } })
    await prisma.trip.delete({ where: { id: trip.id } })

    console.log('✅ Test terminé et nettoyé')

    return NextResponse.json({
      success: true,
      message: '📧 Test d\'emails terminé avec succès !',
      details: {
        driver_email: {
          to: driver.email,
          subject: driverEmailData.subject,
          status: driverEmailResult.success ? '✅ Envoyé' : '❌ Erreur',
          mode: driverEmailResult.mode || 'unknown',
        },
        client_email: {
          to: client.email,
          subject: clientEmailData.subject,
          status: clientEmailResult.success ? '✅ Envoyé' : '❌ Erreur',
          mode: clientEmailResult.mode || 'unknown',
        },
        trip_created: trip.id,
        booking_created: booking.id,
        cleaned: true,
      },
      instructions: '📬 Vérifiez votre boîte mail: m.elfakir@outlook.fr (et spams)',
      warning: '⚠️ SUPPRIMEZ ce fichier /app/api/test-emails/route.ts après utilisation',
    })
  } catch (error: any) {
    console.error('❌ Erreur test emails:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors du test d\'emails',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
