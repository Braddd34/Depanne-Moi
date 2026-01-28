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
  bookings: Array<{ id: string; status: string }>
}

export default function MyTripsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      AVAILABLE: 'bg-green-100 text-green-700',
      RESERVED: 'bg-blue-100 text-blue-700',
      COMPLETED: 'bg-gray-100 text-gray-700',
      CANCELLED: 'bg-red-100 text-red-700',
    }
    return badges[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      AVAILABLE: '✅ Disponible',
      RESERVED: '🔵 Réservé',
      COMPLETED: '✔️ Terminé',
      CANCELLED: '❌ Annulé',
    }
    return labels[status] || status
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
              {trips.length} trajet{trips.length > 1 ? 's' : ''} créé{trips.length > 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/dashboard/trips/new"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:shadow-xl transition"
          >
            ➕ Créer un trajet
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-6xl mb-4">🚚</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">Aucun trajet créé</p>
            <p className="text-gray-600 mb-6">Créez votre premier trajet pour commencer</p>
            <Link
              href="/dashboard/trips/new"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:shadow-xl transition"
            >
              ➕ Créer mon premier trajet
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="glass rounded-3xl p-6 hover-lift">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className={`inline-block px-3 py-1 rounded-xl text-sm font-bold mb-2 ${getStatusBadge(trip.status)}`}>
                      {getStatusLabel(trip.status)}
                    </div>
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
                  <div className="text-sm text-gray-600 mb-2">
                    🚚 {trip.vehicleType}
                  </div>
                  <div className="text-sm text-gray-600">
                    📋 {trip.bookings.length} demande{trip.bookings.length > 1 ? 's' : ''} de réservation
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/trips/${trip.id}/edit`}
                    className="flex-1 px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition text-center text-sm"
                  >
                    ✏️ Modifier
                  </Link>
                  <Link
                    href={`/dashboard/trips/${trip.id}`}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-xl transition text-center text-sm"
                  >
                    👁️ Voir détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
