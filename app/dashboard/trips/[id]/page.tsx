'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

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

    setBookingLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId: trip.id }),
      })

      if (res.ok) {
        alert('Réservation effectuée !')
        router.push('/dashboard')
      } else {
        const error = await res.json()
        alert(error.error || 'Erreur lors de la réservation')
      }
    } catch (error) {
      console.error('Error booking trip:', error)
      alert('Erreur lors de la réservation')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Chargement...</div>
  }

  if (!trip) {
    return <div className="p-8">Trajet non trouvé</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline"
          >
            ← Retour
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-6">
            {trip.fromCity} → {trip.toCity}
          </h1>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="text-lg">
                {new Date(trip.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Type de véhicule</h3>
              <p className="text-lg">{trip.vehicleType}</p>
            </div>

            {trip.price && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Prix indicatif</h3>
                <p className="text-2xl font-bold text-blue-600">{trip.price}€</p>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Chauffeur</h3>
              <p className="text-lg font-semibold">{trip.driver.name}</p>
              {trip.driver.company && (
                <p className="text-gray-600">{trip.driver.company}</p>
              )}
              <p className="text-blue-600 mt-2">{trip.driver.phone}</p>
            </div>

            {trip.status === 'AVAILABLE' && trip.driver.id !== session?.user?.id && (
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 mt-6"
              >
                {bookingLoading ? 'Réservation...' : 'Réserver ce trajet'}
              </button>
            )}

            {trip.status !== 'AVAILABLE' && (
              <div className="bg-gray-100 p-4 rounded-md text-center mt-6">
                <p className="text-gray-600">
                  {trip.status === 'RESERVED' ? 'Ce trajet est réservé' : 'Ce trajet est terminé'}
                </p>
              </div>
            )}

            {trip.bookings && trip.bookings.length > 0 && (
              <div className="border-t pt-4 mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Réservations</h3>
                {trip.bookings.map((booking) => (
                  <div key={booking.id} className="bg-gray-50 p-3 rounded-md mb-2">
                    <p className="font-semibold">{booking.booker.name}</p>
                    <p className="text-sm text-gray-600">{booking.booker.phone}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Statut: {booking.status === 'PENDING' ? 'En attente' : 'Confirmé'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
