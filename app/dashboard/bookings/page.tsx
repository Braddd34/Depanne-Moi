'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserNav from '@/components/UserNav'
import InvoiceButton from '@/components/InvoiceButton'

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
    driver: {
      id: string
      name: string
      company: string | null
      phone: string
    }
  }
}

export default function BookingsPage() {
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
      const res = await fetch('/api/bookings')
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

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('Réservation annulée')
        fetchBookings()
      } else {
        alert('Erreur lors de l\'annulation')
      }
    } catch (error) {
      console.error('Cancel error:', error)
      alert('Erreur lors de l\'annulation')
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    return booking.status === filter
  })

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
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
            Mes <span className="text-gradient">Réservations</span> 📋
          </h1>
          <p className="text-gray-500 text-lg">
            Suivez toutes vos demandes de transport
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmées</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl mb-2">❌</div>
            <div className="text-3xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Annulées</div>
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
              Toutes ({stats.total})
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                filter === 'PENDING'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('CONFIRMED')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                filter === 'CONFIRMED'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmées ({stats.confirmed})
            </button>
            <button
              onClick={() => setFilter('CANCELLED')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                filter === 'CANCELLED'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Annulées ({stats.cancelled})
            </button>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-6xl mb-4">📋</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">Aucune réservation</p>
            <p className="text-gray-600">Explorez les trajets disponibles pour réserver</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="glass rounded-3xl p-6 hover-lift">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-4 py-2 rounded-xl font-bold text-sm ${
                        booking.status === 'PENDING'
                          ? 'bg-orange-100 text-orange-700'
                          : booking.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {booking.status === 'PENDING'
                        ? '⏳ En attente'
                        : booking.status === 'CONFIRMED'
                        ? '✅ Confirmée'
                        : '❌ Annulée'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Réservé le {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gradient">{booking.trip.price}€</div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Départ</div>
                      <div className="font-bold text-gray-900">{booking.trip.fromCity}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                      B
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Arrivée</div>
                      <div className="font-bold text-gray-900">{booking.trip.toCity}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">👤</span>
                    <div>
                      <div className="font-bold text-gray-900">{booking.trip.driver.name}</div>
                      {booking.trip.driver.company && (
                        <div className="text-sm text-gray-600">{booking.trip.driver.company}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    📱 {booking.trip.driver.phone} · 📅 {new Date(booking.trip.date).toLocaleDateString('fr-FR')} · 🚗 {booking.trip.vehicleType}
                  </div>
                </div>

                <div className="flex gap-2">
                  {booking.status === 'CONFIRMED' && (
                    <InvoiceButton type="booking" id={booking.id} />
                  )}
                  {booking.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200 transition text-sm"
                    >
                      ❌ Annuler
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
