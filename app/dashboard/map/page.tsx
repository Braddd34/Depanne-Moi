'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserNav from '@/components/UserNav'
import dynamic from 'next/dynamic'

const OpenFreeMapComponent = dynamic(
  () => import('@/components/OpenFreeMapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-3xl">
        <div className="spinner"></div>
      </div>
    ),
  }
)

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
  
  // Filtres de recherche
  const [searchFrom, setSearchFrom] = useState('')
  const [searchTo, setSearchTo] = useState('')
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([])

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

  useEffect(() => {
    // Filtrer les trajets selon la recherche
    let filtered = trips

    if (searchFrom.trim()) {
      filtered = filtered.filter(trip => 
        trip.fromCity.toLowerCase().includes(searchFrom.toLowerCase())
      )
    }

    if (searchTo.trim()) {
      filtered = filtered.filter(trip => 
        trip.toCity.toLowerCase().includes(searchTo.toLowerCase())
      )
    }

    setFilteredTrips(filtered)
  }, [trips, searchFrom, searchTo])

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips')
      if (res.ok) {
        const data = await res.json()
        const availableTrips = data.trips.filter(
          (trip: Trip) => trip.status === 'AVAILABLE' && trip.driver.id !== session?.user?.id
        )
        setTrips(availableTrips)
        setFilteredTrips(availableTrips)
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
        setSelectedTrip(null)
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

  const clearSearch = () => {
    setSearchFrom('')
    setSearchTo('')
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

      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            <span className="text-gradient">Carte</span> Interactive 🗺️
          </h1>
          <p className="text-gray-500 text-lg">
            Recherchez et visualisez les trajets disponibles
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="glass rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🟢 Ville de départ
              </label>
              <input
                type="text"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                placeholder="Ex: Paris, Lyon, Marseille..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🔵 Ville d'arrivée
              </label>
              <input
                type="text"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                placeholder="Ex: Bordeaux, Lille, Toulouse..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition"
              />
            </div>

            {(searchFrom || searchTo) && (
              <button
                onClick={clearSearch}
                className="mt-8 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl font-bold transition"
              >
                ❌ Effacer
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-bold text-purple-600">{filteredTrips.length}</span> trajet{filteredTrips.length > 1 ? 's' : ''} trouvé{filteredTrips.length > 1 ? 's' : ''}
            </div>
            {(searchFrom || searchTo) && (
              <div className="text-sm text-gray-500">
                🔍 Recherche active : {searchFrom && `Départ "${searchFrom}"`} {searchFrom && searchTo && '→'} {searchTo && `Arrivée "${searchTo}"`}
              </div>
            )}
          </div>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {searchFrom || searchTo ? 'Aucun trajet trouvé' : 'Aucun trajet disponible'}
            </p>
            <p className="text-gray-600">
              {searchFrom || searchTo 
                ? 'Essayez de modifier votre recherche ou d\'effacer les filtres'
                : 'Les trajets apparaîtront ici quand ils seront publiés'
              }
            </p>
            {(searchFrom || searchTo) && (
              <button
                onClick={clearSearch}
                className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold hover:shadow-xl transition"
              >
                Voir tous les trajets
              </button>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Carte */}
            <div className="lg:col-span-2">
              <div className="glass rounded-3xl p-4 h-[700px]">
                <OpenFreeMapComponent
                  trips={filteredTrips}
                  onTripClick={setSelectedTrip}
                  selectedTripId={selectedTrip?.id}
                />
              </div>
            </div>

            {/* Liste des trajets */}
            <div className="lg:col-span-1">
              <div className="glass rounded-3xl p-6 h-[700px] overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-4 sticky top-0 bg-white/90 backdrop-blur-sm pb-3 z-10">
                  📋 Trajets disponibles ({filteredTrips.length})
                </h3>

                <div className="space-y-4">
                  {filteredTrips.map((trip) => (
                    <div
                      key={trip.id}
                      onClick={() => setSelectedTrip(trip)}
                      className={`p-4 rounded-2xl cursor-pointer transition hover-lift ${
                        selectedTrip?.id === trip.id
                          ? 'bg-gradient-to-br from-purple-100 to-blue-100 ring-2 ring-purple-600'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-xs text-purple-600 font-bold">{trip.vehicleType}</div>
                        <div className="text-xl font-bold text-gradient">{trip.price}€</div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                            A
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Départ</div>
                            <div className="font-bold text-sm text-gray-900">{trip.fromCity}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                            B
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Arrivée</div>
                            <div className="font-bold text-sm text-gray-900">{trip.toCity}</div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-3 space-y-1">
                        <div className="text-xs text-gray-600">
                          📅 {new Date(trip.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </div>
                        <div className="text-xs font-bold text-gray-900">👤 {trip.driver.name}</div>
                        {trip.driver.company && (
                          <div className="text-xs text-gray-600">🏢 {trip.driver.company}</div>
                        )}
                      </div>

                      {selectedTrip?.id === trip.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBooking(trip.id)
                          }}
                          className="w-full mt-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-sm hover:shadow-xl transition"
                        >
                          📋 Réserver
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
