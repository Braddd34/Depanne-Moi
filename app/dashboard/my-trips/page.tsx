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
  createdAt: string
  bookings: Array<{
    id: string
    status: string
    booker: {
      name: string
      email: string
      phone: string
    }
  }>
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
    if (session) {
      fetchMyTrips()
    }
  }, [session])

  const fetchMyTrips = async () => {
    try {
      const res = await fetch('/api/trips')
      const data = await res.json()
      // Filtrer uniquement mes trajets
      const myTrips = (data.trips || []).filter(
        (t: Trip) => t.driverId === session?.user?.id
      )
      setTrips(myTrips)
    } catch (error) {
      console.error('Error fetching my trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800'
      case 'RESERVED':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Disponible'
      case 'RESERVED':
        return 'Réservé'
      case 'COMPLETED':
        return 'Terminé'
      case 'CANCELLED':
        return 'Annulé'
      default:
        return status
    }
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes trajets 🚚</h1>
            <p className="text-gray-600 mt-2">
              Gérez vos trajets publiés
            </p>
          </div>
          <Link
            href="/dashboard/trips/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            ➕ Nouveau trajet
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun trajet publié
            </h3>
            <p className="text-gray-600 mb-6">
              Publiez votre premier trajet retour disponible
            </p>
            <Link
              href="/dashboard/trips/new"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Créer un trajet
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {trip.fromCity}
                      </h3>
                      <span className="text-2xl text-gray-400">→</span>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {trip.toCity}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                        {getStatusLabel(trip.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">📅</span>
                        <span>{new Date(trip.date).toLocaleDateString('fr-FR')}</span>
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

                    {/* Réservations */}
                    {trip.bookings && trip.bookings.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          📋 Réservations ({trip.bookings.length})
                        </p>
                        <div className="space-y-2">
                          {trip.bookings.map((booking) => (
                            <div
                              key={booking.id}
                              className="bg-gray-50 rounded-lg p-3 text-sm"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {booking.booker.name}
                                  </p>
                                  <p className="text-gray-600">
                                    {booking.booker.email}
                                  </p>
                                  <p className="text-gray-600">
                                    📞 {booking.booker.phone}
                                  </p>
                                </div>
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                                    booking.status
                                  )}`}
                                >
                                  {getStatusLabel(booking.status)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                    <Link
                      href={`/dashboard/trips/${trip.id}`}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                    >
                      Voir détails
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
