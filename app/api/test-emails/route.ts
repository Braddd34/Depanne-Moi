import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNotification, emailTemplates } from '@/lib/notifications'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    console.log('📧 Test d\'envoi d\'emails...')

    const driver = await prisma.user.findUnique({
      where: { email: 'm.elfakir@outlook.fr' },
    })

    const client = await prisma.user.findUnique({
      where: { email: 'm.elfakir+test@outlook.fr' },
    })

    if (!driver || !client) {
      return NextResponse.json({
        success: false,
        error: 'Comptes non trouvés',
      }, { status: 404 })
    }

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

    const booking = await prisma.booking.create({
      data: {
        tripId: trip.id,
        bookerId: client.id,
        status: 'PENDING',
      },
    })

    await prisma.trip.update({
      where: { id: trip.id },
      data: { status: 'RESERVED' },
    })

    // Email au chauffeur
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

    // Email au client
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

    // Nettoyer
    await prisma.booking.delete({ where: { id: booking.id } })
    await prisma.trip.delete({ where: { id: trip.id } })

    return NextResponse.json({
      success: true,
      message: 'Test terminé',
      driver_email: driverEmailResult,
      client_email: clientEmailResult,
    })
  } catch (error: any) {
    console.error('❌ Erreur:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
