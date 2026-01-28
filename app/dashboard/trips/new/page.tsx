'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import UserNav from '@/components/UserNav'

export default function NewTrip() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fromCity: '',
    toCity: '',
    date: '',
    vehicleType: '',
    price: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          date: new Date(formData.date).toISOString(),
        }),
      })

      if (res.ok) {
        alert('✅ Trajet créé avec succès !')
        router.push('/dashboard/my-trips')
      } else {
        const error = await res.json()
        alert('❌ ' + (error.error || 'Erreur lors de la création'))
      }
    } catch (error) {
      console.error('Error creating trip:', error)
      alert('❌ Erreur lors de la création du trajet')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNav />
        <div className="max-w-3xl mx-auto px-4 py-8">
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
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
          >
            ← Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Publier un trajet retour 🚚</h1>
          <p className="text-gray-600 mt-2">
            Renseignez les détails de votre trajet disponible
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Villes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville de départ *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">📍</span>
                  <input
                    type="text"
                    required
                    value={formData.fromCity}
                    onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Paris"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville d'arrivée *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🎯</span>
                  <input
                    type="text"
                    required
                    value={formData.toCity}
                    onChange={(e) => setFormData({ ...formData, toCity: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Lyon"
                  />
                </div>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date et heure du trajet *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">📅</span>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Sélectionnez la date et l'heure de départ prévue
              </p>
            </div>

            {/* Type de véhicule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de véhicule transportable *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🚚</span>
                <select
                  required
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="Voiture">Voiture</option>
                  <option value="Camionnette">Camionnette</option>
                  <option value="Fourgon">Fourgon</option>
                  <option value="Camion">Camion</option>
                  <option value="Remorque">Remorque</option>
                  <option value="Semi-remorque">Semi-remorque</option>
                  <option value="Plateau">Plateau</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Quel type de véhicule pouvez-vous transporter ?
              </p>
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix indicatif (optionnel)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">💰</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-12 pr-16 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="150"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  €
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Laissez vide si vous préférez négocier directement
              </p>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-start">
                <span className="text-2xl mr-3">💡</span>
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Conseil
                  </p>
                  <p className="text-sm text-blue-700">
                    Soyez précis dans vos informations pour faciliter la mise en relation.
                    Les coordonnées seront échangées uniquement après une réservation.
                  </p>
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {loading ? '⏳ Publication...' : '✓ Publier le trajet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
