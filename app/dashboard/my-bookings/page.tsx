'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import UserNav from '@/components/UserNav'

interface Booking {
  id: string
  status: string
  createdAt: string
  trip: {
    id: string
    fromCity: string
    toCity: string
    date: string
    vehicleType: string
    price: number | null
    driver: {
      name: string
      email: string
      phone: string
      company: string | null
    }
  }
}

export default function MyBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchMyBookings()
    }
  }, [session])

  const fetchMyBookings = async () => {
    try {
      const res = await fetch('/api/bookings')
      const data = await res.json()
      setBookings(data.bookings || [])
    } catch (error) {
      console.error('Error fetching my bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente'
      case 'CONFIRMED':
        return 'Confirmée'
      case 'CANCELLED':
        return 'Annulée'
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes réservations 📋</h1>
          <p className="text-gray-600 mt-2">
            Consultez vos réservations effectuées
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune réservation
            </h3>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore réservé de trajet
            </p>
            <Link
              href="/dashboard/explore"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Trouver un trajet
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    {/* En-tête avec statut */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Réservé le {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    {/* Trajet */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {booking.trip.fromCity}
                        </h3>
                        <span className="text-2xl text-gray-400">→</span>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {booking.trip.toCity}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <span className="mr-2">📅</span>
                          <span>{new Date(booking.trip.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <span className="mr-2">🚚</span>
                          <span>{booking.trip.vehicleType}</span>
                        </div>

                        {booking.trip.price && (
                          <div className="flex items-center text-gray-600">
                            <span className="mr-2">💰</span>
                            <span className="font-semibold">{booking.trip.price}€</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Informations du chauffeur */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        📞 Coordonnées du chauffeur
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Nom:</span>{' '}
                          <span className="font-medium text-gray-900">{booking.trip.driver.name}</span>
                        </div>
                        {booking.trip.driver.company && (
                          <div>
                            <span className="text-gray-600">Société:</span>{' '}
                            <span className="font-medium text-gray-900">{booking.trip.driver.company}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600">Email:</span>{' '}
                          <a href={`mailto:${booking.trip.driver.email}`} className="font-medium text-blue-600 hover:underline">
                            {booking.trip.driver.email}
                          </a>
                        </div>
                        <div>
                          <span className="text-gray-600">Téléphone:</span>{' '}
                          <a href={`tel:${booking.trip.driver.phone}`} className="font-medium text-blue-600 hover:underline">
                            {booking.trip.driver.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6">
                    <Link
                      href={`/dashboard/trips/${booking.trip.id}`}
                      className="block w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                    >
                      Voir le trajet
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
