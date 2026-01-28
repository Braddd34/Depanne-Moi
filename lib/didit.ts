/**
 * Bibliothèque d'intégration Didit.me
 * Service de vérification d'identité
 */

const DIDIT_API_KEY = process.env.DIDIT_API_KEY
const DIDIT_API_URL = 'https://verification.didit.me/v3'
const DIDIT_MODE = process.env.DIDIT_MODE || 'test' // 'test' ou 'production'

interface CreateSessionOptions {
  userId: string
  verificationType: 'identity' | 'driver_license' | 'business'
  returnUrl?: string
}

interface DiditSession {
  sessionId: string
  sessionUrl: string
  expiresAt: string
}

/**
 * Créer une session de vérification Didit
 */
export async function createVerificationSession(
  options: CreateSessionOptions
): Promise<DiditSession> {
  // MODE TEST : Retourner une session simulée
  if (DIDIT_MODE === 'test' || !DIDIT_API_KEY) {
    console.log('🧪 MODE TEST - Session Didit simulée')
    const mockSessionId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      sessionId: mockSessionId,
      sessionUrl: `/verification/test?session=${mockSessionId}&type=${options.verificationType}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
    }
  }

  // MODE PRODUCTION : Appeler l'API Didit
  try {
    const response = await fetch(`${DIDIT_API_URL}/session/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': DIDIT_API_KEY,
      },
      body: JSON.stringify({
        workflow_id: getWorkflowId(options.verificationType),
        redirect_url: options.returnUrl || `${process.env.NEXTAUTH_URL}/verification/callback`,
        user_reference: options.userId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Didit API error: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      sessionId: data.session_id,
      sessionUrl: data.verification_url,
      expiresAt: data.expires_at,
    }
  } catch (error: any) {
    console.error('❌ Erreur création session Didit:', error)
    throw new Error('Impossible de créer la session de vérification')
  }
}

/**
 * Récupérer les résultats d'une session
 */
export async function getSessionResults(sessionId: string) {
  // MODE TEST : Retourner des résultats simulés
  if (DIDIT_MODE === 'test' || !DIDIT_API_KEY) {
    console.log('🧪 MODE TEST - Résultats Didit simulés')
    return {
      status: 'completed',
      verified: true,
      data: {
        fullName: 'Test User',
        dateOfBirth: '1990-01-01',
        documentNumber: 'TEST123456',
        documentType: 'id_card',
        country: 'FR',
      },
    }
  }

  // MODE PRODUCTION : Appeler l'API Didit
  try {
    const response = await fetch(`${DIDIT_API_URL}/session/${sessionId}/decision/`, {
      headers: {
        'x-api-key': DIDIT_API_KEY!,
      },
    })

    if (!response.ok) {
      throw new Error(`Didit API error: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.error('❌ Erreur récupération résultats Didit:', error)
    throw new Error('Impossible de récupérer les résultats')
  }
}

/**
 * Obtenir l'ID du workflow selon le type de vérification
 */
function getWorkflowId(type: string): string {
  // TODO: Remplacer par vos vrais workflow IDs depuis Didit console
  const workflows = {
    identity: process.env.DIDIT_WORKFLOW_IDENTITY || 'workflow_identity_default',
    driver_license: process.env.DIDIT_WORKFLOW_DRIVER || 'workflow_driver_default',
    business: process.env.DIDIT_WORKFLOW_BUSINESS || 'workflow_business_default',
  }
  
  return workflows[type as keyof typeof workflows] || workflows.identity
}
