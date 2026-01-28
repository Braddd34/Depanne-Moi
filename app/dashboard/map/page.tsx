'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
  driver: {
    id: string
    name: string
    company: string | null
  }
}

export default function MapPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTrips()
    }
  }, [status])

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips')
      if (res.ok) {
        const data = await res.json()
        const availableTrips = data.trips.filter(
          (trip: Trip) => trip.status === 'AVAILABLE' && trip.driver.id !== session?.user?.id
        )
        setTrips(availableTrips)
      }
    } catch (error) {
      console.error('Fetch trips error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async (tripId: string) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId }),
      })

      if (res.ok) {
        alert('Réservation envoyée !')
        fetchTrips()
      } else {
        const error = await res.json()
        alert(error.error || 'Erreur lors de la réservation')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Erreur lors de la réservation')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            <span className="text-gradient">Carte</span> Interactive 🗺️
          </h1>
          <p className="text-gray-500 text-lg">
            Visualisez les {trips.length} trajets disponibles
          </p>
        </div>

        <div className="glass rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-3xl">
              🗺️
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Carte en développement</h2>
              <p className="text-gray-600">La carte interactive Leaflet sera restaurée prochainement</p>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
            <p className="text-blue-900 font-semibold mb-2">
              📍 En attendant, consultez la liste des trajets disponibles ci-dessous
            </p>
            <p className="text-sm text-blue-700">
              La carte interactive avec itinéraires et markers sera bientôt disponible
            </p>
          </div>
        </div>

        {trips.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-6xl mb-4">🗺️</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">Aucun trajet disponible</p>
            <p className="text-gray-600">Les trajets apparaîtront sur la carte quand ils seront publiés</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className={`glass rounded-3xl p-6 hover-lift cursor-pointer transition ${
                  selectedTrip?.id === trip.id ? 'ring-4 ring-purple-600' : ''
                }`}
                onClick={() => setSelectedTrip(trip)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-sm text-purple-600 font-bold">{trip.vehicleType}</div>
                  <div className="text-2xl font-bold text-gradient">{trip.price}€</div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Départ</div>
                      <div className="font-bold text-gray-900">{trip.fromCity}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                      B
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Arrivée</div>
                      <div className="font-bold text-gray-900">{trip.toCity}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-4 mb-4">
                  <div className="text-sm text-gray-600">
                    📅 {new Date(trip.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-sm text-gray-600">👤 {trip.driver.name}</div>
                  {trip.driver.company && (
                    <div className="text-sm text-gray-600">🏢 {trip.driver.company}</div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBooking(trip.id)
                  }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:shadow-xl transition"
                >
                  📋 Réserver ce trajet
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
