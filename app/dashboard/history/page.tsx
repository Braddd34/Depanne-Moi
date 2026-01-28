'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserNav from '@/components/UserNav'
import ReviewModal from '@/components/ReviewModal'
import InvoiceButton from '@/components/InvoiceButton'

interface Trip {
  id: string
  fromCity: string
  toCity: string
  date: string
  vehicleType: string
  price: number
  status: string
  createdAt: string
  driver: {
    id: string
    name: string
  }
  bookings: Array<{
    id: string
    status: string
    booker: {
      id: string
      name: string
    }
  }>
}

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
    status: string
    driver: {
      id: string
      name: string
    }
  }
}

export default function HistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean
    tripId: string
    reviewedUserId: string
    reviewedUserName: string
  }>({
    isOpen: false,
    tripId: '',
    reviewedUserId: '',
    reviewedUserName: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchData()
    }
  }, [status, session])

  const fetchData = async () => {
    try {
      const [tripsRes, bookingsRes] = await Promise.all([
        fetch(`/api/trips?driverId=${session?.user?.id}`),
        fetch('/api/bookings'),
      ])

      if (tripsRes.ok) {
        const data = await tripsRes.json()
        setTrips(data.trips)
      }

      if (bookingsRes.ok) {
        const data = await bookingsRes.json()
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Fetch data error:', error)
    } finally {
      setLoading(false)
    }
  }

  const openReviewModal = (tripId: string, userId: string, userName: string) => {
    setReviewModal({
      isOpen: true,
      tripId,
      reviewedUserId: userId,
      reviewedUserName: userName,
    })
  }

  const closeReviewModal = () => {
    setReviewModal({
      isOpen: false,
      tripId: '',
      reviewedUserId: '',
      reviewedUserName: '',
    })
    fetchData()
  }

  const stats = {
    totalTrips: trips.length,
    availableTrips: trips.filter((t) => t.status === 'AVAILABLE').length,
    completedTrips: trips.filter((t) => t.status === 'COMPLETED').length,
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((b) => b.status === 'CONFIRMED').length,
  }

  const filteredTrips = trips.filter((trip) => {
    if (statusFilter !== 'all' && trip.status !== statusFilter) return false
    return true
  })

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false
    return true
  })

  const allItems = [
    ...filteredTrips.map((t) => ({ type: 'trip' as const, data: t, date: new Date(t.createdAt) })),
    ...filteredBookings.map((b) => ({ type: 'booking' as const, data: b, date: new Date(b.createdAt) })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  const displayItems = filter === 'all' ? allItems :
    filter === 'trips' ? allItems.filter((i) => i.type === 'trip') :
    allItems.filter((i) => i.type === 'booking')

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
            <span className="text-gradient">Historique</span> Complet 📚
          </h1>
          <p className="text-gray-500 text-lg">Tous vos trajets et réservations en un seul endroit</p>
        </div>

        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="glass rounded-2xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalTrips}</div>
            <div className="text-sm text-gray-600">Trajets créés</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.availableTrips}</div>
            <div className="text-sm text-gray-600">Disponibles</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.completedTrips}</div>
            <div className="text-sm text-gray-600">Terminés</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-purple-600 mb-1">{stats.totalBookings}</div>
            <div className="text-sm text-gray-600">Réservations</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-orange-600 mb-1">{stats.confirmedBookings}</div>
            <div className="text-sm text-gray-600">Confirmées</div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-700">Type :</span>
              {[
                { value: 'all', label: 'Tout' },
                { value: 'trips', label: 'Mes trajets' },
                { value: 'bookings', label: 'Mes réservations' },
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

            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-700">Statut :</span>
              {[
                { value: 'all', label: 'Tous' },
                { value: 'PENDING', label: 'En attente' },
                { value: 'CONFIRMED', label: 'Confirmé' },
                { value: 'COMPLETED', label: 'Terminé' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`px-4 py-2 rounded-xl font-semibold transition ${
                    statusFilter === option.value
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {displayItems.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-6xl mb-4">📚</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">Aucun élément</p>
            <p className="text-gray-600">Votre historique apparaîtra ici</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayItems.map((item, index) => (
              <div key={`${item.type}-${item.data.id}-${index}`} className="glass rounded-3xl p-6 hover-lift">
                {item.type === 'trip' ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-xl text-sm font-bold">
                          🚚 MON TRAJET
                        </div>
                        <div className={`px-3 py-1 rounded-xl text-sm font-bold ${
                          item.data.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                          item.data.status === 'RESERVED' ? 'bg-orange-100 text-orange-700' :
                          item.data.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.data.status === 'AVAILABLE' ? '✅ Disponible' :
                           item.data.status === 'RESERVED' ? '🔒 Réservé' :
                           item.data.status === 'COMPLETED' ? '✔️ Terminé' :
                           '❌ Annulé'}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gradient">{item.data.price}€</div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          A
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Départ</div>
                          <div className="font-bold text-gray-900 text-lg">{item.data.fromCity}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          B
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Arrivée</div>
                          <div className="font-bold text-gray-900 text-lg">{item.data.toCity}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div>🚚 {item.data.vehicleType}</div>
                      <div>📅 {new Date(item.data.date).toLocaleDateString('fr-FR')}</div>
                      <div>📋 {item.data.bookings.length} réservation(s)</div>
                    </div>

                    <div className="flex gap-2">
                      <InvoiceButton type="trip" id={item.data.id} label="Facture" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-xl text-sm font-bold">
                          📋 MA RÉSERVATION
                        </div>
                        <div className={`px-3 py-1 rounded-xl text-sm font-bold ${
                          item.data.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                          item.data.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.data.status === 'PENDING' ? '⏳ En attente' :
                           item.data.status === 'CONFIRMED' ? '✅ Confirmée' :
                           '❌ Annulée'}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gradient">{item.data.trip.price}€</div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          A
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Départ</div>
                          <div className="font-bold text-gray-900 text-lg">{item.data.trip.fromCity}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          B
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Arrivée</div>
                          <div className="font-bold text-gray-900 text-lg">{item.data.trip.toCity}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div>🚚 {item.data.trip.vehicleType}</div>
                      <div>📅 {new Date(item.data.trip.date).toLocaleDateString('fr-FR')}</div>
                      <div>👤 {item.data.trip.driver.name}</div>
                    </div>

                    <div className="flex gap-2">
                      {item.data.status === 'CONFIRMED' && new Date(item.data.trip.date) < new Date() && (
                        <button
                          onClick={() => openReviewModal(item.data.trip.id, item.data.trip.driver.id, item.data.trip.driver.name)}
                          className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl font-semibold hover:bg-yellow-200 transition"
                        >
                          ⭐ Noter
                        </button>
                      )}
                      <InvoiceButton type="booking" id={item.data.id} label="Facture" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={closeReviewModal}
        tripId={reviewModal.tripId}
        reviewedUserId={reviewModal.reviewedUserId}
        reviewedUserName={reviewModal.reviewedUserName}
        onSuccess={closeReviewModal}
      />
    </div>
  )
}
