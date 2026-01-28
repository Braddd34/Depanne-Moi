import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionResults } from '@/lib/didit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/verification/webhook
 * Webhook Didit.me pour recevoir les résultats de vérification
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log('📬 Webhook Didit reçu:', body)

    const { session_id, status, verification_type } = body

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id manquant' },
        { status: 400 }
      )
    }

    // Trouver la session de vérification
    const verificationSession = await prisma.verificationSession.findUnique({
      where: { sessionId: session_id },
      include: { user: true },
    })

    if (!verificationSession) {
      console.log('⚠️ Session non trouvée:', session_id)
      return NextResponse.json(
        { error: 'Session non trouvée' },
        { status: 404 }
      )
    }

    // Récupérer les résultats complets
    const results = await getSessionResults(session_id)

    // Mettre à jour la session
    await prisma.verificationSession.update({
      where: { id: verificationSession.id },
      data: {
        status: results.verified ? 'COMPLETED' : 'FAILED',
        result: results,
        completedAt: new Date(),
      },
    })

    // Si vérification réussie, mettre à jour l'utilisateur
    if (results.verified) {
      const updateData: any = {}

      if (verificationSession.verificationType === 'identity') {
        updateData.isVerified = true
        updateData.identityVerifiedAt = new Date()
        updateData.verificationLevel = 'IDENTITY'
        updateData.diditSessionId = session_id
      } else if (verificationSession.verificationType === 'driver_license') {
        updateData.driverLicenseVerified = true
        updateData.verificationLevel = updateData.isVerified ? 'DRIVER' : 'DRIVER'
      } else if (verificationSession.verificationType === 'business') {
        updateData.businessVerified = true
        updateData.verificationLevel = 'BUSINESS'
      }

      await prisma.user.update({
        where: { id: verificationSession.userId },
        data: updateData,
      })

      console.log('✅ Utilisateur vérifié:', verificationSession.userId)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('❌ Erreur webhook Didit:', error)
    return NextResponse.json(
      { error: 'Erreur traitement webhook' },
      { status: 500 }
    )
  }
}
