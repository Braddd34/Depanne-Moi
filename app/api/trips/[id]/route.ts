import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const updateTripSchema = z.object({
  fromCity: z.string().min(1).optional(),
  toCity: z.string().min(1).optional(),
  date: z.string().optional(),
  vehicleType: z.string().min(1).optional(),
  price: z.number().positive().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
    })

    if (!trip) {
      return NextResponse.json({ error: 'Trajet introuvable' }, { status: 404 })
    }

    if (trip.driverId !== session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateTripSchema.parse(body)

    const updatedTrip = await prisma.trip.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        date: validatedData.date ? new Date(validatedData.date) : undefined,
      },
    })

    return NextResponse.json({ trip: updatedTrip })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    console.error('Update trip error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
    })

    if (!trip) {
      return NextResponse.json({ error: 'Trajet introuvable' }, { status: 404 })
    }

    if (trip.driverId !== session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    await prisma.trip.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Trajet supprimé avec succès' })
  } catch (error) {
    console.error('Delete trip error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
