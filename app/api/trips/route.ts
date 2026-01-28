import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const createTripSchema = z.object({
  fromCity: z.string().min(1),
  toCity: z.string().min(1),
  date: z.string(),
  vehicleType: z.string().min(1),
  price: z.number().positive(),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const driverId = searchParams.get('driverId')

    const where: any = {}
    if (status) where.status = status
    if (driverId) where.driverId = driverId

    const trips = await prisma.trip.findMany({
      where,
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            company: true,
            phone: true,
          },
        },
        bookings: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ trips })
  } catch (error) {
    console.error('Get trips error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createTripSchema.parse(body)

    const trip = await prisma.trip.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        driverId: session.user.id,
        status: 'AVAILABLE',
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
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    console.error('Create trip error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
