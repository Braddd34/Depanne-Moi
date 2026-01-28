'use client'

import { useEffect, useState } from 'react'

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  sessionUrl: string
  verificationType: string
}

export default function VerificationModal({
  isOpen,
  onClose,
  sessionUrl,
  verificationType,
}: VerificationModalProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) {
      setLoading(true)
    }
  }, [isOpen])

  // Écouter les messages de l'iFrame pour fermer automatiquement
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'VERIFICATION_COMPLETE') {
        // Fermer la modal automatiquement
        setTimeout(() => {
          onClose()
        }, 1000) // Délai de 1 seconde pour que l'utilisateur voie le message de succès
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onClose])

  if (!isOpen) return null

  const typeLabels = {
    identity: 'Pièce d\'identité',
    driver_license: 'Permis de conduire',
    business: 'KBIS (Entreprise)',
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">🔒 Vérification d'identité</h2>
            <p className="text-blue-100 text-sm mt-1">
              {typeLabels[verificationType as keyof typeof typeLabels]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-3xl font-light"
            title="Fermer"
          >
            ×
          </button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 p-4 border-b border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>🛡️ Sécurisé et confidentiel</strong> - Vos données sont protégées et conformes RGPD.
          </p>
          <p className="text-xs text-blue-600 mt-1">
            La vérification prend environ 2-3 minutes. Préparez votre document d'identité.
          </p>
        </div>

        {/* iFrame Container */}
        <div className="relative bg-gray-50" style={{ height: '600px' }}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Chargement de la vérification...</p>
              </div>
            </div>
          )}
          
          <iframe
            src={sessionUrl}
            className="w-full h-full border-0"
            allow="camera; microphone"
            onLoad={() => setLoading(false)}
            title="Vérification d'identité Didit"
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-600">
            Powered by <strong>Didit.me</strong> - Vérification sécurisée conforme RGPD 🇪🇺
          </p>
          <button
            onClick={onClose}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Annuler la vérification
          </button>
        </div>
      </div>
    </div>
  )
}
