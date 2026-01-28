import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET - Récupérer toutes les conversations de l'utilisateur
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: session.user.id },
          { user2Id: session.user.id },
        ],
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    })

    // Compter les messages non lus pour chaque conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: session.user.id },
            read: false,
          },
        })

        // Déterminer l'autre utilisateur
        const otherUser = conv.user1Id === session.user.id ? conv.user2 : conv.user1

        return {
          ...conv,
          otherUser,
          unreadCount,
          lastMessage: conv.messages[0] || null,
        }
      })
    )

    return NextResponse.json(conversationsWithUnread)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer ou récupérer une conversation
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { otherUserId } = body

    if (!otherUserId) {
      return NextResponse.json({ error: 'otherUserId requis' }, { status: 400 })
    }

    if (otherUserId === session.user.id) {
      return NextResponse.json({ error: 'Impossible de créer une conversation avec soi-même' }, { status: 400 })
    }

    // Vérifier si la conversation existe déjà (dans les deux sens)
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, user2Id: otherUserId },
          { user1Id: otherUserId, user2Id: session.user.id },
        ],
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
    })

    // Si elle n'existe pas, la créer
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: session.user.id,
          user2Id: otherUserId,
        },
        include: {
          user1: {
            select: {
              id: true,
              name: true,
              company: true,
            },
          },
          user2: {
            select: {
              id: true,
              name: true,
              company: true,
            },
          },
        },
      })
    }

    const otherUser = conversation.user1Id === session.user.id ? conversation.user2 : conversation.user1

    return NextResponse.json({
      ...conversation,
      otherUser,
    })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
