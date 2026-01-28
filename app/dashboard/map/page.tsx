'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserNav from '@/components/UserNav'
import TripMap from '@/components/TripMap'

interface Trip {
  id: string
  fromCity: string
  toCity: string
  date: string
  vehicleType: string
  price: number | null
  status: string
  driverId: string
  driver: {
    name: string
    company: string | null
  }
}

export default function MapPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchTrips()
    }
  }, [session])

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips')
      const data = await res.json()
      // Ne pas afficher mes propres trajets
      const otherTrips = (data.trips || []).filter(
        (t: Trip) => t.driverId !== session?.user?.id && t.status === 'AVAILABLE'
      )
      setTrips(otherTrips)
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTripClick = (tripId: string) => {
    router.push(`/dashboard/trips/${tripId}`)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <UserNav />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    )
  }

  if (!session) return null

  // Filtrer les trajets par type de véhicule
  const filteredTrips = filter === 'all' 
    ? trips 
    : trips.filter(t => t.vehicleType.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Carte <span className="text-gradient">interactive</span> 🗺️
          </h1>
          <p className="text-gray-500 text-lg">
            Visualisez tous les trajets disponibles sur une carte
          </p>
        </div>

        {/* Filtres rapides */}
        <div className="glass rounded-3xl p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-2xl font-semibold transition ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🗺️ Tous ({trips.length})
            </button>
            <button
              onClick={() => setFilter('camion')}
              className={`px-6 py-3 rounded-2xl font-semibold transition ${
                filter === 'camion'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🚚 Camions
            </button>
            <button
              onClick={() => setFilter('fourgon')}
              className={`px-6 py-3 rounded-2xl font-semibold transition ${
                filter === 'fourgon'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🚐 Fourgons
            </button>
            <button
              onClick={() => setFilter('utilitaire')}
              className={`px-6 py-3 rounded-2xl font-semibold transition ${
                filter === 'utilitaire'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🚙 Utilitaires
            </button>
          </div>
        </div>

        {/* Carte interactive */}
        <TripMap trips={filteredTrips} onTripClick={handleTripClick} />

        {/* Info */}
        <div className="glass rounded-3xl p-6 mt-8 text-center">
          <p className="text-gray-600">
            💡 <strong>Astuce :</strong> Cliquez sur les marqueurs pour voir les détails d'un trajet !
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Les trajets sont géocodés automatiquement via OpenStreetMap (gratuit).
          </p>
        </div>
      </div>
    </div>
  )
}
