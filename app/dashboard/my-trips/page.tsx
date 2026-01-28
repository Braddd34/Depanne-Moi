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
  createdAt: string
  bookings: Array<{
    id: string
    status: string
  }>
}

export default function MyTripsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

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
      const res = await fetch(`/api/trips?driverId=${session?.user?.id}`)
      if (res.ok) {
        const data = await res.json()
        setTrips(data.trips)
      }
    } catch (error) {
      console.error('Fetch trips error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (tripId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) return

    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('Trajet supprimé')
        fetchTrips()
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true
    return trip.status === filter
  })

  const stats = {
    total: trips.length,
    available: trips.filter(t => t.status === 'AVAILABLE').length,
    reserved: trips.filter(t => t.status === 'RESERVED').length,
    completed: trips.filter(t => t.status === 'COMPLETED').length,
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
        <div className="flex items-center justify-between mb-8 fade-in">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              Mes <span className="text-gradient">Trajets</span> 🚚
            </h1>
            <p className="text-gray-500 text-lg">
              Gérez tous vos trajets en un seul endroit
            </p>
          </div>
          <Link
            href="/dashboard/trips/new"
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-xl transition"
          >
            ➕ Nouveau trajet
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-gray-600">Disponibles</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-3xl font-bold text-blue-600">{stats.reserved}</div>
            <div className="text-sm text-gray-600">Réservés</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl mb-2">🏁</div>
            <div className="text-3xl font-bold text-purple-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Terminés</div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous ({stats.total})
            </button>
            <button
              onClick={() => setFilter('AVAILABLE')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                filter === 'AVAILABLE'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Disponibles ({stats.available})
            </button>
            <button
              onClick={() => setFilter('RESERVED')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                filter === 'RESERVED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Réservés ({stats.reserved})
            </button>
            <button
              onClick={() => setFilter('COMPLETED')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                filter === 'COMPLETED'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Terminés ({stats.completed})
            </button>
          </div>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-6xl mb-4">🚚</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">Aucun trajet</p>
            <p className="text-gray-600 mb-6">Créez votre premier trajet pour commencer</p>
            <Link
              href="/dashboard/trips/new"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:shadow-xl transition"
            >
              ➕ Créer un trajet
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="glass rounded-3xl p-6 hover-lift">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-3xl">🚚</div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {trip.fromCity} → {trip.toCity}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600">
                            📅 {new Date(trip.date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="text-sm text-gray-600">
                            🚗 {trip.vehicleType}
                          </span>
                          <span className="text-lg font-bold text-gradient">
                            {trip.price}€
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-4 py-2 rounded-xl font-bold text-sm ${
                          trip.status === 'AVAILABLE'
                            ? 'bg-green-100 text-green-700'
                            : trip.status === 'RESERVED'
                            ? 'bg-blue-100 text-blue-700'
                            : trip.status === 'COMPLETED'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {trip.status === 'AVAILABLE'
                          ? '✅ Disponible'
                          : trip.status === 'RESERVED'
                          ? '📋 Réservé'
                          : trip.status === 'COMPLETED'
                          ? '🏁 Terminé'
                          : '❌ Annulé'}
                      </span>
                      {trip.bookings.length > 0 && (
                        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-bold text-sm">
                          {trip.bookings.length} réservation(s)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/trips/${trip.id}/edit`}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition text-sm"
                    >
                      ✏️ Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200 transition text-sm"
                    >
                      🗑️ Supprimer
                    </button>
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
