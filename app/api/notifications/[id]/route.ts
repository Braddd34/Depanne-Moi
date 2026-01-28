import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// PATCH - Marquer une notification comme lue
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    })

    if (!notification) {
      return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 })
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const updated = await prisma.notification.update({
      where: { id: params.id },
      data: { read: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer une notification
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    })

    if (!notification) {
      return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 })
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    await prisma.notification.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
