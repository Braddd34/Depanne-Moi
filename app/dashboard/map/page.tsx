'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import UberStyleMap from '@/components/UberStyleMap'

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
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)

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

  const handleTripSelect = (tripId: string | null) => {
    setSelectedTripId(tripId)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🗺️</div>
          <p className="text-gray-600 text-lg">Chargement de la carte...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const filteredTrips = filter === 'all' 
    ? trips 
    : trips.filter(t => t.vehicleType.toLowerCase().includes(filter.toLowerCase()))

  const selectedTrip = selectedTripId ? filteredTrips.find(t => t.id === selectedTripId) : null

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar style Uber */}
      <div className={`${showSidebar ? 'w-[400px]' : 'w-0'} transition-all duration-300 bg-white shadow-2xl overflow-hidden flex flex-col z-20`}>
        {showSidebar && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Trajets <span className="text-purple-600">disponibles</span>
                </h1>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                  title="Retour"
                >
                  ←
                </button>
              </div>
              
              {/* Filtres compacts */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                    filter === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tous ({trips.length})
                </button>
                <button
                  onClick={() => setFilter('camion')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                    filter === 'camion'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🚚 Camions
                </button>
                <button
                  onClick={() => setFilter('fourgon')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                    filter === 'fourgon'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🚐 Fourgons
                </button>
                <button
                  onClick={() => setFilter('utilitaire')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                    filter === 'utilitaire'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🚙 Utilitaires
                </button>
              </div>
            </div>

            {/* Liste des trajets */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredTrips.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">📋</div>
                  <p className="text-gray-600">Aucun trajet trouvé</p>
                </div>
              ) : (
                filteredTrips.map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => handleTripSelect(trip.id === selectedTripId ? null : trip.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition ${
                      selectedTripId === trip.id
                        ? 'bg-purple-50 border-2 border-purple-600'
                        : 'bg-white border-2 border-gray-100 hover:border-purple-200'
                    }`}
                  >
                    {/* Trajet */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="w-0.5 h-8 bg-gray-300"></div>
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{trip.fromCity}</div>
                        <div className="text-xs text-gray-400 my-1">→</div>
                        <div className="font-bold text-gray-900">{trip.toCity}</div>
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        {new Date(trip.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="text-gray-600">
                        {trip.vehicleType}
                      </div>
                      {trip.price && (
                        <div className="font-bold text-purple-600">
                          {trip.price}€
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    {selectedTripId === trip.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTripClick(trip.id)
                        }}
                        className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition"
                      >
                        Voir le trajet →
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Bouton toggle sidebar */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="absolute top-6 left-6 z-30 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition"
      >
        {showSidebar ? '←' : '→'}
      </button>

      {/* Carte plein écran */}
      <div className="flex-1 relative">
        <UberStyleMap 
          trips={filteredTrips} 
          selectedTripId={selectedTripId}
          onTripSelect={handleTripSelect}
          onTripClick={handleTripClick}
        />
      </div>
    </div>
  )
}
