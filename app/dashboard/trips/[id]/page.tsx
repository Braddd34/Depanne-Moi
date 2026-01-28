'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserNav from '@/components/UserNav'
import Link from 'next/link'

interface Trip {
  id: string
  fromCity: string
  toCity: string
  date: string
  vehicleType: string
  price?: number
  status: string
  driver: {
    id: string
    name: string
    phone: string
    company?: string
  }
  bookings: Array<{
    id: string
    booker: {
      name: string
      phone: string
    }
    status: string
  }>
}

export default function TripDetail() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    if (session) {
      loadTrip()
    }
  }, [session, params.id])

  const loadTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${params.id}`)
      const data = await res.json()
      setTrip(data.trip)
    } catch (error) {
      console.error('Error loading trip:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!trip) return

    if (!confirm('Êtes-vous sûr de vouloir réserver ce trajet ?')) {
      return
    }

    setBookingLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId: trip.id }),
      })

      if (res.ok) {
        alert('✅ Réservation effectuée avec succès ! Vous pouvez maintenant contacter le chauffeur.')
        await loadTrip() // Recharger les données
        router.push('/dashboard/my-bookings')
      } else {
        const error = await res.json()
        alert('❌ ' + (error.error || 'Erreur lors de la réservation'))
      }
    } catch (error) {
      console.error('Error booking trip:', error)
      alert('❌ Erreur lors de la réservation')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNav />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNav />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Trajet non trouvé</h2>
            <p className="text-gray-600 mb-6">Ce trajet n'existe pas ou a été supprimé.</p>
            <Link
              href="/dashboard/explore"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retour aux trajets
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isMyTrip = trip.driver.id === session?.user?.id

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNav />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            ← Retour
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                trip.status === 'AVAILABLE'
                  ? 'bg-green-500'
                  : trip.status === 'RESERVED'
                  ? 'bg-yellow-500'
                  : 'bg-gray-500'
              }`}>
                {trip.status === 'AVAILABLE' ? '✓ Disponible' : trip.status === 'RESERVED' ? '⏳ Réservé' : '✓ Terminé'}
              </span>
              {isMyTrip && (
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold">
                  📝 Mon trajet
                </span>
              )}
            </div>
            <div className="flex items-center justify-center gap-6">
              <h1 className="text-4xl font-bold">{trip.fromCity}</h1>
              <span className="text-4xl">→</span>
              <h1 className="text-4xl font-bold">{trip.toCity}</h1>
            </div>
          </div>

          {/* Détails */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📅</span>
                  <h3 className="text-sm font-medium text-gray-500">Date du trajet</h3>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(trip.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🚚</span>
                  <h3 className="text-sm font-medium text-gray-500">Type de véhicule</h3>
                </div>
                <p className="text-lg font-semibold text-gray-900">{trip.vehicleType}</p>
              </div>

              {trip.price && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 md:col-span-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">💰</span>
                    <h3 className="text-sm font-medium text-gray-700">Prix indicatif</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{trip.price}€</p>
                </div>
              )}
            </div>

            {/* Chauffeur */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                👤 Informations du chauffeur
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nom</p>
                  <p className="text-lg font-semibold text-gray-900">{trip.driver.name}</p>
                </div>
                {trip.driver.company && (
                  <div>
                    <p className="text-sm text-gray-600">Société</p>
                    <p className="text-lg font-semibold text-gray-900">{trip.driver.company}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <a
                    href={`tel:${trip.driver.phone}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {trip.driver.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Bouton de réservation */}
            {trip.status === 'AVAILABLE' && !isMyTrip && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🎯 Réserver ce trajet
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Une fois réservé, vous pourrez contacter directement le chauffeur
                </p>
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  {bookingLoading ? '⏳ Réservation en cours...' : '✓ Réserver maintenant'}
                </button>
              </div>
            )}

            {trip.status !== 'AVAILABLE' && !isMyTrip && (
              <div className="bg-gray-100 rounded-lg p-6 text-center mb-8">
                <div className="text-4xl mb-2">⏳</div>
                <p className="text-lg font-semibold text-gray-700">
                  {trip.status === 'RESERVED' ? 'Ce trajet est déjà réservé' : 'Ce trajet est terminé'}
                </p>
              </div>
            )}

            {isMyTrip && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center mb-8">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-lg font-semibold text-gray-900">
                  C'est votre trajet
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Vous ne pouvez pas réserver votre propre trajet
                </p>
              </div>
            )}

            {/* Réservations (uniquement visible par le propriétaire) */}
            {isMyTrip && trip.bookings && trip.bookings.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📋 Réservations reçues ({trip.bookings.length})
                </h3>
                <div className="space-y-3">
                  {trip.bookings.map((booking) => (
                    <div key={booking.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{booking.booker.name}</p>
                          <p className="text-sm text-gray-600 mt-1">📞 {booking.booker.phone}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {booking.status === 'PENDING' ? 'En attente' : 'Confirmé'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
