'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserNav from '@/components/UserNav'

interface Trip {
  id: string
  fromCity: string
  toCity: string
  date: string
  vehicleType: string
  price: number | null
  status: string
  driverId: string
}

export default function EditTripPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  useEffect(() => {
    if (session) {
      loadTrip()
    }
  }, [session, params.id])

  const loadTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${params.id}`)
      const data = await res.json()
      
      if (data.trip.driverId !== session?.user?.id) {
        alert('❌ Vous ne pouvez modifier que vos propres trajets')
        router.push('/dashboard/my-trips')
        return
      }

      setTrip(data.trip)
      setFormData({
        fromCity: data.trip.fromCity,
        toCity: data.trip.toCity,
        date: new Date(data.trip.date).toISOString().slice(0, 16),
        vehicleType: data.trip.vehicleType,
        price: data.trip.price?.toString() || '',
      })
    } catch (error) {
      console.error('Error loading trip:', error)
      alert('❌ Erreur lors du chargement')
      router.push('/dashboard/my-trips')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/trips/${params.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          date: new Date(formData.date).toISOString(),
        }),
      })

      if (res.ok) {
        alert('✅ Trajet modifié avec succès !')
        router.push(`/dashboard/trips/${params.id}`)
      } else {
        const error = await res.json()
        alert('❌ ' + (error.error || 'Erreur lors de la modification'))
      }
    } catch (error) {
      console.error('Error updating trip:', error)
      alert('❌ Erreur lors de la modification')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (confirm('Annuler les modifications ?')) {
      router.back()
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNav />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    )
  }

  if (!session || !trip) return null

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
          <h1 className="text-3xl font-bold text-gray-900">Modifier le trajet ✏️</h1>
          <p className="text-gray-600 mt-2">
            Modifiez les informations de votre trajet
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
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '⏳ Enregistrement...' : '✓ Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
