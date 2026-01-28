import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Schéma de validation pour créer un avis
const createReviewSchema = z.object({
  tripId: z.string(),
  reviewedUserId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

/**
 * POST /api/reviews
 * Créer un nouvel avis
 */
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
    const validatedData = createReviewSchema.parse(body)

    // Vérifier que le trajet existe et est complété
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
      return NextResponse.json(
        { error: 'Trajet non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur a participé au trajet
    const hasParticipated = 
      trip.driverId === session.user.id || 
      trip.bookings.length > 0

    if (!hasParticipated) {
      return NextResponse.json(
        { error: 'Vous devez avoir participé au trajet pour laisser un avis' },
        { status: 403 }
      )
    }

    // Vérifier qu'on ne note pas soi-même
    if (session.user.id === validatedData.reviewedUserId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas vous noter vous-même' },
        { status: 400 }
      )
    }

    // Vérifier qu'on n'a pas déjà noté ce trajet
    const existingReview = await prisma.review.findUnique({
      where: {
        reviewerId_tripId: {
          reviewerId: session.user.id,
          tripId: validatedData.tripId,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Vous avez déjà noté ce trajet' },
        { status: 400 }
      )
    }

    // Créer l'avis
    const review = await prisma.review.create({
      data: {
        reviewerId: session.user.id,
        reviewedUserId: validatedData.reviewedUserId,
        tripId: validatedData.tripId,
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
        trip: {
          select: {
            id: true,
            fromCity: true,
            toCity: true,
            date: true,
          },
        },
      },
    })

    return NextResponse.json({ review })
  } catch (error) {
    console.error('Error creating review:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'avis' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/reviews?userId=xxx
 * Récupérer les avis d'un utilisateur
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId requis' },
        { status: 400 }
      )
    }

    // Récupérer tous les avis reçus par cet utilisateur
    const reviews = await prisma.review.findMany({
      where: {
        reviewedUserId: userId,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        trip: {
          select: {
            id: true,
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

    // Calculer la note moyenne
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    return NextResponse.json({
      reviews,
      stats: {
        totalReviews: reviews.length,
        averageRating: Math.round(averageRating * 10) / 10, // Arrondi à 1 décimale
      },
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des avis' },
      { status: 500 }
    )
  }
}
