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
  const [vehicleType, setVehicleType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'none'>('date')

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
  }, [trips, fromCity, toCity, date, vehicleType, minPrice, maxPrice, sortBy])

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

    // Filtre ville de départ
    if (fromCity) {
      filtered = filtered.filter(t => 
        t.fromCity.toLowerCase().includes(fromCity.toLowerCase())
      )
    }

    // Filtre ville d'arrivée
    if (toCity) {
      filtered = filtered.filter(t => 
        t.toCity.toLowerCase().includes(toCity.toLowerCase())
      )
    }

    // Filtre date
    if (date) {
      filtered = filtered.filter(t => 
        new Date(t.date).toISOString().split('T')[0] === date
      )
    }

    // Filtre type de véhicule
    if (vehicleType) {
      filtered = filtered.filter(t => 
        t.vehicleType.toLowerCase().includes(vehicleType.toLowerCase())
      )
    }

    // Filtre prix minimum
    if (minPrice) {
      const min = parseFloat(minPrice)
      filtered = filtered.filter(t => 
        t.price !== null && t.price >= min
      )
    }

    // Filtre prix maximum
    if (maxPrice) {
      const max = parseFloat(maxPrice)
      filtered = filtered.filter(t => 
        t.price !== null && t.price <= max
      )
    }

    // Tri des résultats
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => {
        if (a.price === null) return 1
        if (b.price === null) return -1
        return a.price - b.price
      })
    }

    setFilteredTrips(filtered)
  }

  const resetFilters = () => {
    setFromCity('')
    setToCity('')
    setDate('')
    setVehicleType('')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('date')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Trajets <span className="text-gradient">disponibles</span> 🔍
          </h1>
          <p className="text-gray-500 text-lg">
            Trouvez un transport qui correspond à vos besoins
          </p>
        </div>

        {/* Filtres avancés - Design moderne */}
        <div className="glass rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>🎯</span> Filtres de recherche
            </h2>
            {(fromCity || toCity || date || vehicleType || minPrice || maxPrice) && (
              <button
                onClick={resetFilters}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium transition"
              >
                ↺ Réinitialiser
              </button>
            )}
          </div>

          {/* Filtres de base */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Ville de départ
              </label>
              <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="Ex: Paris, Lyon..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Ville d'arrivée
              </label>
              <input
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                placeholder="Ex: Marseille, Nice..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📅 Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
          </div>

          {/* Filtres avancés */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🚚 Type de véhicule
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              >
                <option value="">Tous les types</option>
                <option value="camion">Camion</option>
                <option value="remorque">Remorque</option>
                <option value="fourgon">Fourgon</option>
                <option value="utilitaire">Utilitaire</option>
                <option value="semi">Semi-remorque</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💰 Prix min (€)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💰 Prix max (€)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="10000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔀 Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'price' | 'none')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              >
                <option value="date">Date (plus proche)</option>
                <option value="price">Prix (moins cher)</option>
                <option value="none">Sans tri</option>
              </select>
            </div>
          </div>

          {/* Résultats count */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-600">
              <span className="text-2xl font-bold text-gradient mr-2">{filteredTrips.length}</span>
              trajet{filteredTrips.length > 1 ? 's' : ''} correspondant{filteredTrips.length > 1 ? 's' : ''} à vos critères
            </p>
          </div>
        </div>

        {/* Liste des trajets - Design moderne */}
        {filteredTrips.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center">
            <div className="text-8xl mb-6 opacity-50">🔍</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Aucun trajet trouvé
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {trips.length === 0 
                ? "Il n'y a pas encore de trajets disponibles. Revenez plus tard !"
                : "Essayez de modifier vos critères de recherche pour trouver d'autres trajets."}
            </p>
            <button
              onClick={resetFilters}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:shadow-xl font-semibold transition-all transform hover:scale-105"
            >
              Voir tous les trajets
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="glass rounded-3xl p-8 card-hover"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    {/* Itinéraire */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 font-medium mb-1">DÉPART</div>
                        <h3 className="text-3xl font-bold text-gradient">
                          {trip.fromCity}
                        </h3>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-full h-1 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 rounded-full relative">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <span className="text-3xl">→</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500 font-medium mb-1">ARRIVÉE</div>
                        <h3 className="text-3xl font-bold text-gradient">
                          {trip.toCity}
                        </h3>
                      </div>
                    </div>

                    {/* Détails */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 bg-white/50 p-4 rounded-2xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-2xl">
                          📅
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium">DATE</div>
                          <div className="font-semibold text-gray-900">
                            {new Date(trip.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white/50 p-4 rounded-2xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-2xl">
                          🚚
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium">VÉHICULE</div>
                          <div className="font-semibold text-gray-900 capitalize">
                            {trip.vehicleType}
                          </div>
                        </div>
                      </div>

                      {trip.price ? (
                        <div className="flex items-center gap-3 bg-white/50 p-4 rounded-2xl">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center text-2xl">
                            💰
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium">PRIX</div>
                            <div className="font-bold text-gray-900 text-xl">
                              {trip.price}€
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 bg-white/50 p-4 rounded-2xl">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center text-2xl">
                            💬
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium">PRIX</div>
                            <div className="font-semibold text-gray-900 text-sm">
                              À négocier
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chauffeur */}
                    <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-2xl">
                        👤
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-medium">CHAUFFEUR</div>
                        <div className="font-semibold text-gray-900">
                          {trip.driver.name}
                          {trip.driver.company && <span className="text-gray-500 ml-2">· {trip.driver.company}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 lg:mt-0 lg:ml-8">
                    <Link
                      href={`/dashboard/trips/${trip.id}`}
                      className="block w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:shadow-xl text-center font-bold transition-all transform hover:scale-105"
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
