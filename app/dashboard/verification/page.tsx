'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UserNav from '@/components/UserNav'
import VerificationModal from '@/components/VerificationModal'

interface VerificationStatus {
  isVerified: boolean
  identityVerifiedAt: string | null
  driverLicenseVerified: boolean
  businessVerified: boolean
  verificationLevel: string
}

export default function VerificationPage() {
  const router = useRouter()
  const [status, setStatus] = useState<VerificationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [userType, setUserType] = useState<'individual' | 'business'>('individual')

  useEffect(() => {
    loadVerificationStatus()
  }, [])

  const loadVerificationStatus = async () => {
    try {
      const res = await fetch('/api/verification/status')
      if (res.ok) {
        const data = await res.json()
        setStatus(data.user)
      }
    } catch (error) {
      console.error('Erreur chargement statut:', error)
    } finally {
      setLoading(false)
    }
  }

  const startVerification = async (type: string) => {
    try {
      setLoading(true)
      const res = await fetch('/api/verification/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationType: type }),
      })

      if (res.ok) {
        const data = await res.json()
        setCurrentSession(data)
        setModalOpen(true)
      } else {
        const error = await res.json()
        alert(error.error || 'Erreur lors de l\'initiation')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'initiation de la vérification')
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setCurrentSession(null)
    // Recharger le statut après fermeture
    setTimeout(() => loadVerificationStatus(), 1000)
  }

  if (loading && !status) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNav />
        <div className="flex items-center justify-center h-96">
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNav />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔒 Vérification d'identité
          </h1>
          <p className="text-gray-600">
            Sécurisez votre compte et augmentez la confiance avec la vérification d'identité.
          </p>
        </div>

        {/* Statut actuel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 Statut de vérification</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🪪</span>
                <div>
                  <p className="font-medium">Identité (CNI/Passeport)</p>
                  <p className="text-sm text-gray-500">Obligatoire pour tous</p>
                </div>
              </div>
              <div>
                {status?.isVerified ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✅ Vérifié
                  </span>
                ) : (
                  <button
                    onClick={() => startVerification('identity')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Vérifier maintenant
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🚗</span>
                <div>
                  <p className="font-medium">Permis de conduire</p>
                  <p className="text-sm text-gray-500">Obligatoire pour chauffeurs et particuliers</p>
                </div>
              </div>
              <div>
                {status?.driverLicenseVerified ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✅ Vérifié
                  </span>
                ) : status?.isVerified ? (
                  <button
                    onClick={() => startVerification('driver_license')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Vérifier maintenant
                  </button>
                ) : (
                  <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full text-sm">
                    Identité requise d'abord
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🏢</span>
                <div>
                  <p className="font-medium">KBIS (Entreprise)</p>
                  <p className="text-sm text-gray-500">Optionnel - Badge entreprise vérifiée</p>
                </div>
              </div>
              <div>
                {status?.businessVerified ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✅ Vérifié
                  </span>
                ) : status?.isVerified ? (
                  <button
                    onClick={() => startVerification('business')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    Vérifier (optionnel)
                  </button>
                ) : (
                  <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full text-sm">
                    Identité requise d'abord
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Informations */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Pourquoi se faire vérifier ?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ <strong>Obligatoire</strong> pour publier un trajet ou réserver</li>
            <li>✅ <strong>Sécurité</strong> : Protection contre les fraudes et véhicules volés</li>
            <li>✅ <strong>Confiance</strong> : Les utilisateurs vérifiés sont plus fiables</li>
            <li>✅ <strong>Rapide</strong> : Seulement 2-3 minutes par vérification</li>
          </ul>
        </div>

        {/* Type d'utilisateur */}
        {!status?.isVerified && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">👤 Quel type d'utilisateur êtes-vous ?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setUserType('individual')
                  startVerification('identity')
                }}
                className="p-6 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition text-left"
              >
                <h4 className="text-xl font-bold text-blue-600 mb-2">👤 Particulier</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Vous transportez votre propre véhicule ou celui de votre entreprise.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>✅ Pièce d'identité (obligatoire)</li>
                  <li>✅ Permis de conduire (obligatoire)</li>
                </ul>
              </button>

              <button
                onClick={() => {
                  setUserType('business')
                  startVerification('identity')
                }}
                className="p-6 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition text-left"
              >
                <h4 className="text-xl font-bold text-purple-600 mb-2">🏢 Entreprise</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Vous êtes une société de transport professionnelle.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>✅ Pièce d'identité (obligatoire)</li>
                  <li>✅ KBIS (obligatoire)</li>
                  <li>⭐ Badge "Entreprise vérifiée"</li>
                </ul>
              </button>
            </div>
          </div>
        )}

        {/* Niveau actuel */}
        {status?.isVerified && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <h3 className="font-semibold text-green-900 mb-2">
              ✅ Niveau de vérification : {status.verificationLevel}
            </h3>
            <p className="text-sm text-green-800">
              Vous pouvez maintenant publier des trajets et effectuer des réservations !
            </p>
            {status.identityVerifiedAt && (
              <p className="text-xs text-green-600 mt-2">
                Vérifié le {new Date(status.identityVerifiedAt).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal de vérification */}
      {currentSession && (
        <VerificationModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          sessionUrl={currentSession.sessionUrl}
          verificationType={currentSession.sessionUrl.includes('identity') ? 'identity' : 'driver_license'}
        />
      )}
    </div>
  )
}
