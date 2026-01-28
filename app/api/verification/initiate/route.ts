import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createVerificationSession } from '@/lib/didit'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const initiateSchema = z.object({
  verificationType: z.enum(['identity', 'driver_license', 'business']),
})

/**
 * POST /api/verification/initiate
 * Démarre une nouvelle session de vérification
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
    const { verificationType } = initiateSchema.parse(body)

    console.log(`🔍 Initiation vérification ${verificationType} pour user ${session.user.id}`)

    // Vérifier si une session est déjà en cours
    const existingSession = await prisma.verificationSession.findFirst({
      where: {
        userId: session.user.id,
        verificationType,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
    })

    if (existingSession) {
      return NextResponse.json({
        sessionId: existingSession.sessionId,
        sessionUrl: existingSession.sessionUrl,
        status: 'existing',
      })
    }

    // Créer une nouvelle session Didit
    const diditSession = await createVerificationSession({
      userId: session.user.id,
      verificationType,
      returnUrl: `${process.env.NEXTAUTH_URL}/verification/callback`,
    })

    // Enregistrer la session dans la base
    const verificationSession = await prisma.verificationSession.create({
      data: {
        userId: session.user.id,
        sessionId: diditSession.sessionId,
        sessionUrl: diditSession.sessionUrl,
        verificationType,
        status: 'PENDING',
      },
    })

    console.log('✅ Session créée:', verificationSession.id)

    return NextResponse.json({
      sessionId: diditSession.sessionId,
      sessionUrl: diditSession.sessionUrl,
      verificationId: verificationSession.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur initiation vérification:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'initiation de la vérification' },
      { status: 500 }
    )
  }
}
