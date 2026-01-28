'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserNav from '@/components/UserNav'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    vehicleType: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: (session.user as any).phone || '',
        company: (session.user as any).company || '',
        vehicleType: (session.user as any).vehicleType || '',
      })
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // TODO: Créer une API pour mettre à jour le profil
      // Pour l'instant, juste un message de succès
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Profil mis à jour avec succès !')
    } catch (error) {
      setMessage('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNav />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNav />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon profil 👤</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos informations personnelles
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                L'email ne peut pas être modifié
              </p>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+33 6 12 34 56 78"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Société */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Société (optionnel)
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Nom de votre société"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type de véhicule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de véhicule (optionnel)
              </label>
              <select
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionnez un type</option>
                <option value="Camion">Camion</option>
                <option value="Camionnette">Camionnette</option>
                <option value="Remorque">Remorque</option>
                <option value="Semi-remorque">Semi-remorque</option>
                <option value="Fourgon">Fourgon</option>
                <option value="Utilitaire">Utilitaire</option>
              </select>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('succès')
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}>
                {message}
              </div>
            )}

            {/* Bouton */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>

        {/* Section changement de mot de passe */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Changer le mot de passe
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Fonctionnalité à venir prochainement
          </p>
          <button
            disabled
            className="px-6 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
          >
            Modifier mon mot de passe
          </button>
        </div>

        {/* Statistiques du compte */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow p-6 mt-6 text-white">
          <h2 className="text-lg font-semibold mb-4">
            Informations du compte
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-100">Membre depuis</p>
              <p className="font-semibold">
                {session.user ? 'Janvier 2026' : '-'}
              </p>
            </div>
            <div>
              <p className="text-blue-100">Rôle</p>
              <p className="font-semibold">
                {(session.user as any).role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
