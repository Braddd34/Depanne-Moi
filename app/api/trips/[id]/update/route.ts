import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const updateTripSchema = z.object({
  fromCity: z.string().min(1).optional(),
  toCity: z.string().min(1).optional(),
  date: z.string().optional(),
  vehicleType: z.string().min(1).optional(),
  price: z.number().optional(),
  status: z.enum(['AVAILABLE', 'RESERVED', 'COMPLETED', 'CANCELLED']).optional(),
})

// PUT /api/trips/[id]/update - Modifier un trajet
export async function PUT(
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

    const body = await request.json()
    const validatedData = updateTripSchema.parse(body)

    // Vérifier que le trajet appartient à l'utilisateur
    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trajet non trouvé' },
        { status: 404 }
      )
    }

    if (trip.driverId !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Mettre à jour le trajet
    const updatedTrip = await prisma.trip.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json({ trip: updatedTrip })
  } catch (error: any) {
    console.error('Error updating trip:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}
