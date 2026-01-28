import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/verification/status
 * Récupère le statut de vérification de l'utilisateur connecté
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les informations de vérification de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        isVerified: true,
        identityVerifiedAt: true,
        driverLicenseVerified: true,
        businessVerified: true,
        verificationLevel: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer les sessions de vérification en cours
    const pendingSessions = await prisma.verificationSession.findMany({
      where: {
        userId: session.user.id,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      user: {
        isVerified: user.isVerified,
        identityVerifiedAt: user.identityVerifiedAt,
        driverLicenseVerified: user.driverLicenseVerified,
        businessVerified: user.businessVerified,
        verificationLevel: user.verificationLevel,
      },
      pendingSessions: pendingSessions.map(s => ({
        id: s.id,
        type: s.verificationType,
        status: s.status,
        createdAt: s.createdAt,
      })),
    })
  } catch (error) {
    console.error('Erreur récupération statut vérification:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du statut' },
      { status: 500 }
    )
  }
}
