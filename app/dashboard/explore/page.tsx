'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserNav from '@/components/UserNav'
import Link from 'next/link'

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
    phone: string
  }
}

export default function ExplorePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  
  const [searchFrom, setSearchFrom] = useState('')
  const [searchTo, setSearchTo] = useState('')
  const [vehicleType, setVehicleType] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('date')

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
    applyFilters()
  }, [trips, searchFrom, searchTo, vehicleType, minPrice, maxPrice, sortBy])

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

  const applyFilters = () => {
    let filtered = [...trips]

    if (searchFrom) {
      filtered = filtered.filter(t => 
        t.fromCity.toLowerCase().includes(searchFrom.toLowerCase())
      )
    }
    
    if (searchTo) {
      filtered = filtered.filter(t => 
        t.toCity.toLowerCase().includes(searchTo.toLowerCase())
      )
    }

    if (vehicleType !== 'all') {
      filtered = filtered.filter(t => t.vehicleType === vehicleType)
    }

    if (minPrice) {
      filtered = filtered.filter(t => t.price >= parseFloat(minPrice))
    }

    if (maxPrice) {
      filtered = filtered.filter(t => t.price <= parseFloat(maxPrice))
    }

    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price)
    } else {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }

    setFilteredTrips(filtered)
  }

  const handleBooking = async (tripId: string) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId }),
      })

      if (res.ok) {
        alert('Réservation envoyée ! Le transporteur va recevoir votre demande.')
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
            <span className="text-gradient">Explorer</span> les trajets 🔍
          </h1>
          <p className="text-gray-500 text-lg">
            Trouvez le trajet qui vous convient parmi {filteredTrips.length} disponibles
          </p>
        </div>

        <div className="glass rounded-3xl p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">📍 Ville de départ</label>
              <input
                type="text"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                placeholder="Ex: Paris"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">🎯 Ville d'arrivée</label>
              <input
                type="text"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                placeholder="Ex: Lyon"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">🚚 Type de véhicule</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              >
                <option value="all">Tous</option>
                <option value="Camion">Camion</option>
                <option value="Camionnette">Camionnette</option>
                <option value="Voiture">Voiture</option>
                <option value="Dépanneuse">Dépanneuse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">📊 Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              >
                <option value="date">Date</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">💰 Prix min (€)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">💰 Prix max (€)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="999999"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
          </div>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">Aucun trajet trouvé</p>
            <p className="text-gray-600">Essayez de modifier vos filtres de recherche</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="glass rounded-3xl p-6 hover-lift">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-purple-600 font-bold mb-1">{trip.vehicleType}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(trip.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">👤</span>
                    <div>
                      <div className="font-bold text-gray-900">{trip.driver.name}</div>
                      {trip.driver.company && (
                        <div className="text-sm text-gray-600">{trip.driver.company}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">📱 {trip.driver.phone}</div>
                </div>

                <button
                  onClick={() => handleBooking(trip.id)}
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
