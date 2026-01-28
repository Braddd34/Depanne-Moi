'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
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
  driver: {
    name: string
    company: string | null
  }
}

export default function ExplorePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filtres
  const [fromCity, setFromCity] = useState('')
  const [toCity, setToCity] = useState('')
  const [date, setDate] = useState('')

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

  useEffect(() => {
    applyFilters()
  }, [trips, fromCity, toCity, date])

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips')
      const data = await res.json()
      // Ne pas afficher mes propres trajets
      const otherTrips = (data.trips || []).filter(
        (t: Trip) => t.driverId !== session?.user?.id && t.status === 'AVAILABLE'
      )
      setTrips(otherTrips)
      setFilteredTrips(otherTrips)
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = trips

    if (fromCity) {
      filtered = filtered.filter(t => 
        t.fromCity.toLowerCase().includes(fromCity.toLowerCase())
      )
    }

    if (toCity) {
      filtered = filtered.filter(t => 
        t.toCity.toLowerCase().includes(toCity.toLowerCase())
      )
    }

    if (date) {
      filtered = filtered.filter(t => 
        new Date(t.date).toISOString().split('T')[0] === date
      )
    }

    setFilteredTrips(filtered)
  }

  const resetFilters = () => {
    setFromCity('')
    setToCity('')
    setDate('')
  }

  if (status === 'loading' || loading) {
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trajets disponibles 🔍</h1>
          <p className="text-gray-600 mt-2">
            Trouvez un transport qui correspond à vos besoins
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filtrer les résultats</h2>
            {(fromCity || toCity || date) && (
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Réinitialiser
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville de départ
              </label>
              <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="Ex: Paris"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville d'arrivée
              </label>
              <input
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                placeholder="Ex: Lyon"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredTrips.length} trajet{filteredTrips.length > 1 ? 's' : ''} trouvé{filteredTrips.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Liste des trajets */}
        {filteredTrips.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun trajet trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {trips.length === 0 
                ? "Il n'y a pas encore de trajets disponibles."
                : "Essayez de modifier vos critères de recherche."}
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Voir tous les trajets
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {trip.fromCity}
                      </h3>
                      <span className="text-2xl text-gray-400">→</span>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {trip.toCity}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">📅</span>
                        <span>{new Date(trip.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">🚚</span>
                        <span>{trip.vehicleType}</span>
                      </div>

                      {trip.price && (
                        <div className="flex items-center text-gray-600">
                          <span className="mr-2">💰</span>
                          <span className="font-semibold">{trip.price}€</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Chauffeur:</span> {trip.driver.name}
                        {trip.driver.company && ` • ${trip.driver.company}`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6">
                    <Link
                      href={`/dashboard/trips/${trip.id}`}
                      className="block w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-semibold transition-colors"
                    >
                      Voir détails →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
