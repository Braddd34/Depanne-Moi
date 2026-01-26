'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UserDetail {
  id: string
  email: string
  name: string
  company: string | null
  phone: string
  vehicleType: string | null
  role: string
  createdAt: string
  updatedAt: string
  trips: Array<{
    id: string
    fromCity: string
    toCity: string
    date: string
    vehicleType: string
    price: number | null
    status: string
    createdAt: string
    bookings: Array<{
      id: string
      status: string
      createdAt: string
      booker: {
        id: string
        name: string
        email: string
        phone: string
      }
    }>
  }>
  bookings: Array<{
    id: string
    status: string
    createdAt: string
    trip: {
      id: string
      fromCity: string
      toCity: string
      date: string
      price: number | null
      driver: {
        id: string
        name: string
        email: string
        phone: string
      }
    }
  }>
}

export default function UserDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    fetchUserDetail()
  }, [session, status, router, userId])

  const fetchUserDetail = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`)
      
      if (!res.ok) {
        throw new Error('Erreur lors de la récupération des détails utilisateur')
      }

      const data = await res.json()
      setUser(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Utilisateur non trouvé'}</div>
      </div>
    )
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'RESERVED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Retour à la liste
          </Link>
        </div>

        {/* Informations client */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Fiche client
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nom</h3>
              <p className="mt-1 text-lg text-gray-900">{user.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-lg text-gray-900">{user.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
              <p className="mt-1 text-lg text-gray-900">{user.phone}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Société</h3>
              <p className="mt-1 text-lg text-gray-900">{user.company || '-'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Type de véhicule</h3>
              <p className="mt-1 text-lg text-gray-900">{user.vehicleType || '-'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Rôle</h3>
              <p className="mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role}
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Inscription</h3>
              <p className="mt-1 text-lg text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Dernière mise à jour</h3>
              <p className="mt-1 text-lg text-gray-900">
                {new Date(user.updatedAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Trajets créés */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Trajets créés ({user.trips.length})
          </h2>

          {user.trips.length === 0 ? (
            <p className="text-gray-500">Aucun trajet créé</p>
          ) : (
            <div className="space-y-4">
              {user.trips.map((trip) => (
                <div key={trip.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {trip.fromCity} → {trip.toCity}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(trip.date).toLocaleDateString('fr-FR')} • {trip.vehicleType}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </div>

                  {trip.price && (
                    <p className="text-sm text-gray-700 mb-2">
                      Prix: {trip.price}€
                    </p>
                  )}

                  {trip.bookings.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Réservations ({trip.bookings.length})
                      </h4>
                      <div className="space-y-2">
                        {trip.bookings.map((booking) => (
                          <div key={booking.id} className="text-sm bg-gray-50 p-2 rounded">
                            <div className="flex justify-between">
                              <span className="font-medium">{booking.booker.name}</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${getStatusBadgeColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="text-gray-600 mt-1">
                              {booking.booker.email} • {booking.booker.phone}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Réservations effectuées */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Réservations effectuées ({user.bookings.length})
          </h2>

          {user.bookings.length === 0 ? (
            <p className="text-gray-500">Aucune réservation effectuée</p>
          ) : (
            <div className="space-y-4">
              {user.bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.trip.fromCity} → {booking.trip.toCity}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.trip.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  {booking.trip.price && (
                    <p className="text-sm text-gray-700 mb-2">
                      Prix: {booking.trip.price}€
                    </p>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Chauffeur</h4>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">{booking.trip.driver.name}</div>
                      <div>{booking.trip.driver.email} • {booking.trip.driver.phone}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
