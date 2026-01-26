import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const createTripSchema = z.object({
  fromCity: z.string().min(1),
  toCity: z.string().min(1),
  date: z.string().datetime(),
  vehicleType: z.string().min(1),
  price: z.number().optional(),
})

// GET /api/trips - Liste des trajets avec filtres
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fromCity = searchParams.get('fromCity')
    const toCity = searchParams.get('toCity')
    const date = searchParams.get('date')
    const status = searchParams.get('status') || 'AVAILABLE'

    const where: any = {
      status: status as any,
    }

    if (fromCity) {
      where.fromCity = { contains: fromCity, mode: 'insensitive' }
    }
    if (toCity) {
      where.toCity = { contains: toCity, mode: 'insensitive' }
    }
    if (date) {
      const dateObj = new Date(date)
      where.date = {
        gte: new Date(dateObj.setHours(0, 0, 0, 0)),
        lte: new Date(dateObj.setHours(23, 59, 59, 999)),
      }
    }

    const trips = await prisma.trip.findMany({
      where,
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            company: true,
            phone: true,
            vehicleType: true,
          },
        },
        bookings: {
          include: {
            booker: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json({ trips })
  } catch (error) {
    console.error('Get trips error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des trajets' },
      { status: 500 }
    )
  }
}

// POST /api/trips - Créer un trajet
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
    const data = createTripSchema.parse(body)

    const trip = await prisma.trip.create({
      data: {
        driverId: session.user.id,
        fromCity: data.fromCity,
        toCity: data.toCity,
        date: new Date(data.date),
        vehicleType: data.vehicleType,
        price: data.price,
      },
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
    })

    return NextResponse.json({ trip }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create trip error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du trajet' },
      { status: 500 }
    )
  }
}
