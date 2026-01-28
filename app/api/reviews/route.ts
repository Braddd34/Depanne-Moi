import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const createReviewSchema = z.object({
  tripId: z.string(),
  reviewedUserId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional().nullable(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createReviewSchema.parse(body)

    if (validatedData.reviewedUserId === session.user.id) {
      return NextResponse.json({ error: 'Vous ne pouvez pas vous évaluer vous-même' }, { status: 400 })
    }

    const trip = await prisma.trip.findUnique({
      where: { id: validatedData.tripId },
      include: {
        bookings: {
          where: {
            bookerId: session.user.id,
            status: 'CONFIRMED',
          },
        },
      },
    })

    if (!trip) {
      return NextResponse.json({ error: 'Trajet introuvable' }, { status: 404 })
    }

    const isDriver = trip.driverId === session.user.id
    const hasBooking = trip.bookings.length > 0

    if (!isDriver && !hasBooking) {
      return NextResponse.json({ error: 'Vous devez avoir participé à ce trajet pour laisser un avis' }, { status: 403 })
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        reviewerId: session.user.id,
        tripId: validatedData.tripId,
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: 'Vous avez déjà évalué ce trajet' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        ...validatedData,
        reviewerId: session.user.id,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
        reviewedUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    await prisma.notification.create({
      data: {
        userId: validatedData.reviewedUserId,
        type: 'REVIEW_RECEIVED',
        title: 'Nouvel avis reçu',
        message: `${session.user.name} vous a laissé un avis ${validatedData.rating}/5 ⭐`,
        link: '/dashboard/profile',
      },
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    console.error('Create review error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 })
    }

    const reviews = await prisma.review.findMany({
      where: { reviewedUserId: userId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
        trip: {
          select: {
            fromCity: true,
            toCity: true,
            date: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    return NextResponse.json({
      reviews,
      stats: {
        average: avgRating,
        count: reviews.length,
      },
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
