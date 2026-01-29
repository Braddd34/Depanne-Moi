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
  price: number
  status: string
}

export default function EditTripPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fromCity: '',
    toCity: '',
    date: '',
    vehicleType: 'Camion',
    price: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated' && params.id) {
      fetchTrip()
    }
  }, [status, params.id])

  const fetchTrip = async () => {
    try {
      const res = await fetch(`/api/trips?driverId=${session?.user?.id}`)
      if (res.ok) {
        const data = await res.json()
        const foundTrip = data.trips.find((t: Trip) => t.id === params.id)
        
        if (foundTrip) {
          setTrip(foundTrip)
          setFormData({
            fromCity: foundTrip.fromCity,
            toCity: foundTrip.toCity,
            date: foundTrip.date.split('T')[0],
            vehicleType: foundTrip.vehicleType,
            price: foundTrip.price.toString(),
          })
        } else {
          alert('Trajet introuvable ou vous n\'êtes pas autorisé')
          router.push('/dashboard/my-trips')
        }
      }
    } catch (error) {
      console.error('Fetch trip error:', error)
      alert('Erreur lors du chargement')
      router.push('/dashboard/my-trips')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch(`/api/trips/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      })

      if (res.ok) {
        alert('Trajet modifié avec succès !')
        router.push('/dashboard/my-trips')
      } else {
        const error = await res.json()
        alert(error.error || 'Erreur lors de la modification')
      }
    } catch (error) {
      console.error('Update trip error:', error)
      alert('Erreur lors de la modification')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!trip) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <UserNav />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            <span className="text-gradient">Modifier</span> le trajet ✏️
          </h1>
          <p className="text-gray-500 text-lg">Mettez à jour les informations du trajet</p>
        </div>

        <div className="glass rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📍 Ville de départ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fromCity}
                  onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="Ex: Paris"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🎯 Ville d'arrivée *
                </label>
                <input
                  type="text"
                  required
                  value={formData.toCity}
                  onChange={(e) => setFormData({ ...formData, toCity: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="Ex: Lyon"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📅 Date du trajet *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  💰 Prix (€) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="Ex: 150"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🚚 Type de véhicule *
              </label>
              <select
                required
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              >
                <option value="Camion">Camion</option>
                <option value="Camionnette">Camionnette</option>
                <option value="Voiture">Voiture</option>
                <option value="Dépanneuse">Dépanneuse</option>
                <option value="Fourgon">Fourgon</option>
                <option value="Utilitaire">Utilitaire</option>
              </select>
            </div>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
              <p className="text-sm text-orange-800">
                ⚠️ <strong>Note :</strong> La modification d'un trajet déjà réservé peut impacter les utilisateurs ayant effectué une réservation.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition text-lg"
              >
                ← Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition text-lg"
              >
                {submitting ? '🔄 Modification...' : '✅ Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
