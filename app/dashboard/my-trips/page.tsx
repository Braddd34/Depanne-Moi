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
}

export default function MyTripsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

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

  const deleteTrip = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) return

    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('Trajet supprimé')
        fetchTrips()
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Delete trip error:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const filteredTrips = filterStatus === 'all' 
    ? trips 
    : trips.filter(t => t.status === filterStatus)

  const stats = {
    total: trips.length,
    available: trips.filter(t => t.status === 'AVAILABLE').length,
    booked: trips.filter(t => t.status === 'BOOKED').length,
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
            <p className="text-gray-500 text-lg">Gérez tous vos trajets en un seul endroit</p>
          </div>
          <Link
            href="/dashboard/trips/new"
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-xl transition"
          >
            ➕ Nouveau trajet
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-3xl p-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-3xl font-bold text-gradient">{stats.total}</div>
            <div className="text-sm text-gray-600 font-semibold">Total trajets</div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="text-3xl mb-2">🟢</div>
            <div className="text-3xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-gray-600 font-semibold">Disponibles</div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="text-3xl mb-2">🟡</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.booked}</div>
            <div className="text-sm text-gray-600 font-semibold">Réservés</div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-purple-600">{stats.completed}</div>
            <div className="text-sm text-gray-600 font-semibold">Terminés</div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-700">Filtrer:</span>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                filterStatus === 'all' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Tous ({stats.total})
            </button>
            <button
              onClick={() => setFilterStatus('AVAILABLE')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                filterStatus === 'AVAILABLE' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Disponibles ({stats.available})
            </button>
            <button
              onClick={() => setFilterStatus('BOOKED')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                filterStatus === 'BOOKED' ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Réservés ({stats.booked})
            </button>
            <button
              onClick={() => setFilterStatus('COMPLETED')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                filterStatus === 'COMPLETED' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gray-200 text-gray-700'
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
              className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-xl transition"
            >
              ➕ Créer un trajet
            </Link>
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
                  <div>
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                      trip.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                      trip.status === 'BOOKED' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {trip.status === 'AVAILABLE' ? '🟢 Disponible' :
                       trip.status === 'BOOKED' ? '🟡 Réservé' :
                       '✅ Terminé'}
                    </span>
                  </div>
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
                  <div className="text-2xl font-bold text-gradient">{trip.price}€</div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/trips/${trip.id}/edit`}
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition text-center text-sm"
                  >
                    ✏️ Modifier
                  </Link>
                  <button
                    onClick={() => deleteTrip(trip.id)}
                    className="flex-1 py-2 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200 transition text-sm"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
