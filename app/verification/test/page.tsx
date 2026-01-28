'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

/**
 * Page de simulation de vérification Didit (MODE TEST)
 * Cette page simule l'interface de Didit.me pour tester l'UX
 */
function TestVerificationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [uploading, setUploading] = useState(false)

  const sessionId = searchParams.get('session')
  const type = searchParams.get('type')

  const typeLabels = {
    identity: 'Pièce d\'identité',
    driver_license: 'Permis de conduire',
    business: 'KBIS (Extrait K-bis)',
  }

  const handleUpload = async () => {
    setUploading(true)
    
    // Simuler un upload (2 secondes)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setStep(step + 1)
    setUploading(false)
  }

  const handleComplete = async () => {
    setUploading(true)
    
    // Simuler le traitement (2 secondes)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Appeler le webhook pour marquer comme complété
    await fetch('/api/verification/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        status: 'completed',
        verification_type: type,
        verified: true,
      }),
    })

    // Message de succès
    alert('✅ Vérification réussie ! Vous pouvez fermer cette fenêtre.')
    
    // Retour au dashboard
    window.location.href = '/dashboard/verification'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔒 Vérification d'identité
          </h1>
          <p className="text-gray-600">
            {typeLabels[type as keyof typeof typeLabels] || 'Document'}
          </p>
          <p className="text-xs text-yellow-600 mt-2 bg-yellow-50 p-2 rounded">
            🧪 MODE TEST - Ceci est une simulation de vérification
          </p>
        </div>

        {/* Étapes */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= i
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i}
                </div>
                {i < 3 && (
                  <div
                    className={`w-20 h-1 mx-2 ${
                      step > i ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Document</span>
            <span>Selfie</span>
            <span>Validation</span>
          </div>
        </div>

        {/* Contenu selon l'étape */}
        {step === 1 && (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-6xl">📄</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4">
              Prenez en photo votre {typeLabels[type as keyof typeof typeLabels]}
            </h2>
            <p className="text-gray-600 mb-6">
              Assurez-vous que le document est bien lisible et non flouté.
            </p>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {uploading ? 'Analyse en cours...' : 'Simuler la photo'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-6xl">🤳</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4">
              Prenez un selfie
            </h2>
            <p className="text-gray-600 mb-6">
              Regardez la caméra et assurez-vous que votre visage est bien visible.
            </p>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {uploading ? 'Analyse en cours...' : 'Simuler le selfie'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-48 h-48 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-7xl">✅</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Vérification réussie !
            </h2>
            <p className="text-gray-600 mb-6">
              Votre identité a été vérifiée avec succès.
            </p>
            <button
              onClick={handleComplete}
              disabled={uploading}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
            >
              {uploading ? 'Finalisation...' : 'Terminer'}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            🧪 <strong>MODE TEST</strong> - Aucune donnée réelle n'est collectée
          </p>
          <p className="text-xs text-gray-400 mt-1">
            En production, cette interface sera fournie par Didit.me
          </p>
        </div>
      </div>
    </div>
  )
}

export default function TestVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <TestVerificationContent />
    </Suspense>
  )
}
