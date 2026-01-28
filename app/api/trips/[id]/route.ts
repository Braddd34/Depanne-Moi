import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

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
