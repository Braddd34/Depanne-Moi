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

  const cancelBooking = async (bookingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return
    }

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
      console.error('Cancel booking error:', error)
      alert('Erreur lors de l\'annulation')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700'
      case 'CONFIRMED': return 'bg-green-100 text-green-700'
      case 'CANCELLED': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return '⏳ En attente'
      case 'CONFIRMED': return '✅ Confirmé'
      case 'CANCELLED': return '❌ Annulé'
      default: return status
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  const pendingBookings = bookings.filter(b => b.status === 'PENDING')
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED')
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <UserNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Mes <span className="text-gradient">Réservations</span> 📋
          </h1>
          <p className="text-gray-500 text-lg">
            {bookings.length} réservation{bookings.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-3xl font-bold text-yellow-600">{pendingBookings.length}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">{confirmedBookings.length}</div>
            <div className="text-sm text-gray-600">Confirmées</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl mb-2">❌</div>
            <div className="text-3xl font-bold text-red-600">{cancelledBookings.length}</div>
            <div className="text-sm text-gray-600">Annulées</div>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-6xl mb-4">📋</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">Aucune réservation</p>
            <p className="text-gray-600">Explorez les trajets disponibles pour en réserver un</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="glass rounded-3xl p-6 hover-lift">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-xl text-sm font-bold ${getStatusColor(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </span>
                  <div className="text-2xl font-bold text-gradient">{booking.trip.price}€</div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
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

                    <div className="text-sm text-gray-600">
                      📅 {new Date(booking.trip.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm text-gray-600">
                      🚚 {booking.trip.vehicleType}
                    </div>
                  </div>

                  <div className="border-l-2 border-gray-200 pl-6">
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Transporteur</p>
                      <p className="font-bold text-gray-900">{booking.trip.driver.name}</p>
                      {booking.trip.driver.company && (
                        <p className="text-sm text-gray-600">{booking.trip.driver.company}</p>
                      )}
                      <p className="text-sm text-gray-600">📱 {booking.trip.driver.phone}</p>
                    </div>

                    <div className="text-xs text-gray-500">
                      Réservé le {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6 pt-4 border-t-2 border-gray-200">
                  {booking.status === 'CONFIRMED' && (
                    <InvoiceButton type="booking" id={booking.id} label="Télécharger facture" />
                  )}
                  {booking.status === 'PENDING' && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
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
