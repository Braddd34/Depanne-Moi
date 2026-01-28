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
  const [filterStatus, setFilterStatus] = useState('all')

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

  const cancelBooking = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return

    try {
      const res = await fetch(`/api/bookings/${id}`, {
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

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus)

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
          <p className="text-gray-500 text-lg">Suivez l'état de toutes vos réservations</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-3xl p-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-3xl font-bold text-gradient">{stats.total}</div>
            <div className="text-sm text-gray-600 font-semibold">Total</div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600 font-semibold">En attente</div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600 font-semibold">Confirmées</div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="text-3xl mb-2">❌</div>
            <div className="text-3xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600 font-semibold">Annulées</div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-700">Filtrer:</span>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                filterStatus === 'all' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Toutes ({stats.total})
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                filterStatus === 'PENDING' ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              En attente ({stats.pending})
            </button>
            <button
              onClick={() => setFilterStatus('CONFIRMED')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                filterStatus === 'CONFIRMED' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Confirmées ({stats.confirmed})
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
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="glass rounded-3xl p-6 hover-lift">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-purple-600 font-bold mb-1">{booking.trip.vehicleType}</div>
                    <div className="text-sm text-gray-500">
                      Réservé le {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status === 'PENDING' ? '⏳ En attente' :
                       booking.status === 'CONFIRMED' ? '✅ Confirmée' :
                       '❌ Annulée'}
                    </span>
                  </div>
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

                    <div className="text-2xl font-bold text-gradient pt-2">{booking.trip.price}€</div>
                  </div>

                  <div className="border-l-2 border-gray-200 pl-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">👤</span>
                      <div>
                        <div className="font-bold text-gray-900">{booking.trip.driver.name}</div>
                        {booking.trip.driver.company && (
                          <div className="text-sm text-gray-600">{booking.trip.driver.company}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">📱 {booking.trip.driver.phone}</div>
                    
                    <div className="flex gap-2">
                      {booking.status === 'CONFIRMED' && (
                        <InvoiceButton type="booking" id={booking.id} label="Facture" />
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
