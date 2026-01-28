'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  }
  booker: {
    id: string
    name: string
    email: string
    phone: string
    company: string | null
  }
}

export default function ManageBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchBookings()
    }
  }, [session])

  const fetchBookings = async () => {
    try {
      // Récupérer tous mes trajets
      const tripsRes = await fetch('/api/trips')
      const tripsData = await tripsRes.json()
      const myTrips = (tripsData.trips || []).filter((t: any) => t.driverId === session?.user?.id)

      // Récupérer toutes les réservations
      const bookingsRes = await fetch('/api/bookings')
      const bookingsData = await bookingsRes.json()
      
      // Filtrer les réservations pour mes trajets
      const myBookings = (bookingsData.bookings || []).filter((b: any) =>
        myTrips.some((t: any) => t.id === b.tripId)
      )

      setBookings(myBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (bookingId: string) => {
    setActionLoading(bookingId)
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      })

      if (res.ok) {
        await fetchBookings()
        alert('✅ Réservation acceptée !')
      } else {
        alert('❌ Erreur lors de l\'acceptation')
      }
    } catch (error) {
      console.error('Error accepting booking:', error)
      alert('❌ Erreur lors de l\'acceptation')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (bookingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir refuser cette réservation ?')) return

    setActionLoading(bookingId)
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })

      if (res.ok) {
        await fetchBookings()
        alert('✅ Réservation refusée')
      } else {
        alert('❌ Erreur lors du refus')
      }
    } catch (error) {
      console.error('Error rejecting booking:', error)
      alert('❌ Erreur lors du refus')
    } finally {
      setActionLoading(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <UserNav />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    )
  }

  if (!session) return null

  const pendingBookings = bookings.filter(b => b.status === 'PENDING')
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED')
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Gérer les <span className="text-gradient">réservations</span> 📋
          </h1>
          <p className="text-gray-500 text-lg">
            Acceptez ou refusez les demandes de réservation pour vos trajets
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="glass p-6 rounded-3xl">
            <div className="text-sm font-semibold text-gray-600 uppercase mb-2">EN ATTENTE</div>
            <div className="text-5xl font-bold text-gradient">{pendingBookings.length}</div>
          </div>
          <div className="glass p-6 rounded-3xl">
            <div className="text-sm font-semibold text-gray-600 uppercase mb-2">ACCEPTÉES</div>
            <div className="text-5xl font-bold text-green-600">{confirmedBookings.length}</div>
          </div>
          <div className="glass p-6 rounded-3xl">
            <div className="text-sm font-semibold text-gray-600 uppercase mb-2">REFUSÉES</div>
            <div className="text-5xl font-bold text-red-600">{cancelledBookings.length}</div>
          </div>
        </div>

        {/* Réservations en attente */}
        {pendingBookings.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>⏳</span> Réservations en attente
            </h2>
            <div className="grid gap-6">
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="glass rounded-3xl p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-700 rounded-2xl flex items-center justify-center text-3xl">
                          📋
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {booking.trip.fromCity} → {booking.trip.toCity}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Reçue le {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/50 p-6 rounded-2xl">
                        <div className="text-sm font-semibold text-gray-600 uppercase mb-3">DEMANDEUR</div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">NOM</div>
                            <div className="font-bold text-gray-900">{booking.booker.name}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">EMAIL</div>
                            <div className="font-medium text-gray-900">{booking.booker.email}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">TÉLÉPHONE</div>
                            <div className="font-medium text-gray-900">{booking.booker.phone}</div>
                          </div>
                        </div>
                        {booking.booker.company && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">ENTREPRISE</div>
                            <div className="font-bold text-gray-900">{booking.booker.company}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleAccept(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-xl font-bold transition-all transform hover:scale-105 disabled:opacity-50"
                      >
                        {actionLoading === booking.id ? 'Traitement...' : '✅ Accepter'}
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 font-bold transition-all disabled:opacity-50"
                      >
                        ❌ Refuser
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Réservations acceptées */}
        {confirmedBookings.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>✅</span> Réservations acceptées
            </h2>
            <div className="grid gap-4">
              {confirmedBookings.map((booking) => (
                <div key={booking.id} className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {booking.trip.fromCity} → {booking.trip.toCity}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {booking.booker.name} · {booking.booker.phone}
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-bold">
                      ✅ Confirmée
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {bookings.length === 0 && (
          <div className="glass rounded-3xl p-16 text-center">
            <div className="text-8xl mb-6 opacity-50">📋</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Aucune réservation
            </h3>
            <p className="text-gray-600 text-lg">
              Vous n'avez pas encore reçu de demandes de réservation pour vos trajets.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
