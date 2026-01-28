import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // 7, 30, 90, 365 jours
    const days = parseInt(period)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Statistiques générales pour l'utilisateur
    const [
      totalTrips,
      totalBookings,
      completedTrips,
      totalRevenue,
      recentTrips,
      recentBookings,
      tripsThisPeriod,
      bookingsThisPeriod,
    ] = await Promise.all([
      // Total des trajets créés
      prisma.trip.count({
        where: { driverId: session.user.id },
      }),
      // Total des réservations faites
      prisma.booking.count({
        where: { userId: session.user.id },
      }),
      // Trajets complétés
      prisma.trip.count({
        where: {
          driverId: session.user.id,
          status: 'COMPLETED',
        },
      }),
      // Revenus totaux (trajets complétés)
      prisma.trip.aggregate({
        where: {
          driverId: session.user.id,
          status: 'COMPLETED',
        },
        _sum: {
          price: true,
        },
      }),
      // Trajets récents
      prisma.trip.findMany({
        where: {
          driverId: session.user.id,
          createdAt: { gte: startDate },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          fromCity: true,
          toCity: true,
          date: true,
          price: true,
          status: true,
          createdAt: true,
        },
      }),
      // Réservations récentes
      prisma.booking.findMany({
        where: {
          userId: session.user.id,
          createdAt: { gte: startDate },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          trip: {
            select: {
              fromCity: true,
              toCity: true,
              date: true,
              price: true,
            },
          },
        },
      }),
      // Trajets durant la période
      prisma.trip.count({
        where: {
          driverId: session.user.id,
          createdAt: { gte: startDate },
        },
      }),
      // Réservations durant la période
      prisma.booking.count({
        where: {
          userId: session.user.id,
          createdAt: { gte: startDate },
        },
      }),
    ])

    // Statistiques par jour (pour les graphiques)
    const dailyStats = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const [tripsCount, bookingsCount, revenue] = await Promise.all([
        prisma.trip.count({
          where: {
            driverId: session.user.id,
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        }),
        prisma.booking.count({
          where: {
            userId: session.user.id,
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        }),
        prisma.trip.aggregate({
          where: {
            driverId: session.user.id,
            status: 'COMPLETED',
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
          _sum: {
            price: true,
          },
        }),
      ])

      dailyStats.push({
        date: date.toISOString().split('T')[0],
        trips: tripsCount,
        bookings: bookingsCount,
        revenue: revenue._sum.price || 0,
      })
    }

    // Statistiques par statut
    const tripsByStatus = await prisma.trip.groupBy({
      by: ['status'],
      where: {
        driverId: session.user.id,
      },
      _count: {
        status: true,
      },
    })

    const bookingsByStatus = await prisma.booking.groupBy({
      by: ['status'],
      where: {
        userId: session.user.id,
      },
      _count: {
        status: true,
      },
    })

    return NextResponse.json({
      summary: {
        totalTrips,
        totalBookings,
        completedTrips,
        totalRevenue: totalRevenue._sum.price || 0,
        tripsThisPeriod,
        bookingsThisPeriod,
      },
      dailyStats,
      tripsByStatus: tripsByStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
      bookingsByStatus: bookingsByStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
      recentTrips,
      recentBookings,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
