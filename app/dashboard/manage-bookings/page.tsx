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
    price: number
  }
  booker: {
    id: string
    name: string
    phone: string
  }
}

export default function ManageBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBookings()
    }
  }, [status])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings?type=driver')
      if (res.ok) {
        const data = await res.json()
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Fetch bookings error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookingAction = async (bookingId: string, action: 'confirm' | 'reject') => {
    const confirmMessage = action === 'confirm'
      ? 'Confirmer cette réservation ?'
      : 'Rejeter cette réservation ?'

    if (!confirm(confirmMessage)) return

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action === 'confirm' ? 'CONFIRMED' : 'CANCELLED',
        }),
      })

      if (res.ok) {
        alert(action === 'confirm' ? 'Réservation confirmée !' : 'Réservation rejetée')
        fetchBookings()
      } else {
        alert('Erreur lors de l\'action')
      }
    } catch (error) {
      console.error('Booking action error:', error)
      alert('Erreur lors de l\'action')
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true
    return booking.status === filter
  })

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
    cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
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
            <span className="text-gradient">Gérer</span> les réservations ✅
          </h1>
          <p className="text-gray-500 text-lg">Acceptez ou refusez les demandes de réservation</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-2xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-orange-600 mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmées</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-red-600 mb-1">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Refusées</div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-700">Filtrer :</span>
            {[
              { value: 'all', label: 'Toutes' },
              { value: 'PENDING', label: 'En attente' },
              { value: 'CONFIRMED', label: 'Confirmées' },
              { value: 'CANCELLED', label: 'Refusées' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  filter === option.value
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-6xl mb-4">✅</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">Aucune demande</p>
            <p className="text-gray-600">Les demandes de réservation apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="glass rounded-3xl p-6 hover-lift">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`px-3 py-1 rounded-xl text-sm font-bold ${
                        booking.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status === 'PENDING' ? '⏳ En attente' :
                         booking.status === 'CONFIRMED' ? '✅ Confirmée' :
                         '❌ Refusée'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Demandé le {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    <div className="mb-4 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                      <div className="text-sm font-bold text-blue-900 mb-2">👤 Client</div>
                      <div className="font-bold text-blue-900 text-lg">{booking.booker.name}</div>
                      <div className="text-sm text-blue-700">📱 {booking.booker.phone}</div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          A
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Départ</div>
                          <div className="font-bold text-gray-900 text-lg">{booking.trip.fromCity}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          B
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Arrivée</div>
                          <div className="font-bold text-gray-900 text-lg">{booking.trip.toCity}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>🚚 {booking.trip.vehicleType}</div>
                      <div>📅 {new Date(booking.trip.date).toLocaleDateString('fr-FR')}</div>
                      <div>💰 {booking.trip.price}€</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="text-3xl font-bold text-gradient text-center mb-2">
                      {booking.trip.price}€
                    </div>
                    {booking.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleBookingAction(booking.id, 'confirm')}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-xl transition"
                        >
                          ✅ Accepter
                        </button>
                        <button
                          onClick={() => handleBookingAction(booking.id, 'reject')}
                          className="px-6 py-3 bg-red-100 text-red-700 rounded-2xl font-bold hover:bg-red-200 transition"
                        >
                          ❌ Refuser
                        </button>
                      </>
                    )}
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
