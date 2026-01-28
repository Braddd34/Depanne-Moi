'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserNav from '@/components/UserNav'
import Link from 'next/link'
import ReviewModal from '@/components/ReviewModal'

interface Trip {
  id: string
  fromCity: string
  toCity: string
  date: string
  vehicleType: string
  price: number | null
  status: string
  createdAt: string
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
    price: number | null
    status: string
    driver: {
      name: string
      company: string | null
    }
  }
}

export default function HistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [myTrips, setMyTrips] = useState<Trip[]>([])
  const [myBookings, setMyBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'trips' | 'bookings'>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // Modal de notation
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean
    tripId: string
    reviewedUserId: string
    reviewedUserName: string
    tripInfo: { fromCity: string; toCity: string; date: string }
  } | null>(null)

  const openReviewModal = (
    tripId: string,
    reviewedUserId: string,
    reviewedUserName: string,
    fromCity: string,
    toCity: string,
    date: string
  ) => {
    setReviewModal({
      isOpen: true,
      tripId,
      reviewedUserId,
      reviewedUserName,
      tripInfo: { fromCity, toCity, date },
    })
  }

  const closeReviewModal = () => {
    setReviewModal(null)
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchHistory()
    }
  }, [session])

  const fetchHistory = async () => {
    try {
      // Récupérer tous les trajets
      const tripsRes = await fetch('/api/trips')
      const tripsData = await tripsRes.json()
      const trips = (tripsData.trips || []).filter((t: any) => t.driverId === session?.user?.id)
      setMyTrips(trips)

      // Récupérer toutes les réservations
      const bookingsRes = await fetch('/api/bookings')
      const bookingsData = await bookingsRes.json()
      setMyBookings(bookingsData.bookings || [])
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
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

  // Filtrer les trajets par statut
  const filteredTrips = statusFilter === 'all' 
    ? myTrips 
    : myTrips.filter(t => t.status === statusFilter)

  // Filtrer les réservations par statut
  const filteredBookings = statusFilter === 'all'
    ? myBookings
    : myBookings.filter(b => b.status === statusFilter)

  const stats = {
    totalTrips: myTrips.length,
    availableTrips: myTrips.filter(t => t.status === 'AVAILABLE').length,
    completedTrips: myTrips.filter(t => t.status === 'COMPLETED').length,
    totalBookings: myBookings.length,
    confirmedBookings: myBookings.filter(b => b.status === 'CONFIRMED').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            <span className="text-gradient">Historique</span> complet 📚
          </h1>
          <p className="text-gray-500 text-lg">
            Tous vos trajets et réservations en un coup d'œil
          </p>
        </div>

        {/* Stats globales */}
        <div className="grid md:grid-cols-5 gap-4 mb-10">
          <div className="glass p-6 rounded-3xl text-center">
            <div className="text-4xl font-bold text-gradient mb-1">{stats.totalTrips}</div>
            <div className="text-sm text-gray-600 font-medium">Trajets publiés</div>
          </div>
          <div className="glass p-6 rounded-3xl text-center">
            <div className="text-4xl font-bold text-green-600 mb-1">{stats.availableTrips}</div>
            <div className="text-sm text-gray-600 font-medium">Disponibles</div>
          </div>
          <div className="glass p-6 rounded-3xl text-center">
            <div className="text-4xl font-bold text-blue-600 mb-1">{stats.completedTrips}</div>
            <div className="text-sm text-gray-600 font-medium">Complétés</div>
          </div>
          <div className="glass p-6 rounded-3xl text-center">
            <div className="text-4xl font-bold text-purple-600 mb-1">{stats.totalBookings}</div>
            <div className="text-sm text-gray-600 font-medium">Réservations</div>
          </div>
          <div className="glass p-6 rounded-3xl text-center">
            <div className="text-4xl font-bold text-orange-600 mb-1">{stats.confirmedBookings}</div>
            <div className="text-sm text-gray-600 font-medium">Confirmées</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="glass rounded-3xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filtre type */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">TYPE</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`flex-1 px-4 py-3 rounded-2xl font-semibold transition ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tout
                </button>
                <button
                  onClick={() => setFilter('trips')}
                  className={`flex-1 px-4 py-3 rounded-2xl font-semibold transition ${
                    filter === 'trips'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Mes trajets
                </button>
                <button
                  onClick={() => setFilter('bookings')}
                  className={`flex-1 px-4 py-3 rounded-2xl font-semibold transition ${
                    filter === 'bookings'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Mes réservations
                </button>
              </div>
            </div>

            {/* Filtre statut */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">STATUT</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition font-semibold"
              >
                <option value="all">Tous les statuts</option>
                <option value="AVAILABLE">Disponible</option>
                <option value="RESERVED">Réservé</option>
                <option value="COMPLETED">Complété</option>
                <option value="CANCELLED">Annulé</option>
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Confirmé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des trajets */}
        {(filter === 'all' || filter === 'trips') && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🚚</span> Mes trajets publiés ({filteredTrips.length})
            </h2>
            {filteredTrips.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center">
                <div className="text-6xl mb-4 opacity-50">🚚</div>
                <p className="text-gray-600">Aucun trajet trouvé</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredTrips.map((trip) => (
                  <Link
                    key={trip.id}
                    href={`/dashboard/trips/${trip.id}`}
                    className="glass rounded-2xl p-6 card-hover"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`w-3 h-3 rounded-full ${
                            trip.status === 'AVAILABLE' ? 'bg-green-500' :
                            trip.status === 'RESERVED' ? 'bg-orange-500' :
                            trip.status === 'COMPLETED' ? 'bg-blue-500' :
                            'bg-gray-400'
                          }`}></div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {trip.fromCity} → {trip.toCity}
                          </h3>
                          <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                            trip.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                            trip.status === 'RESERVED' ? 'bg-orange-100 text-orange-700' :
                            trip.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {trip.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>📅 {new Date(trip.date).toLocaleDateString('fr-FR')}</span>
                          <span>🚚 {trip.vehicleType}</span>
                          {trip.price && <span>💰 {trip.price}€</span>}
                          <span className="text-xs text-gray-400">
                            Créé le {new Date(trip.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-400">→</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Liste des réservations */}
        {(filter === 'all' || filter === 'bookings') && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>📋</span> Mes réservations ({filteredBookings.length})
            </h2>
            {filteredBookings.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center">
                <div className="text-6xl mb-4 opacity-50">📋</div>
                <p className="text-gray-600">Aucune réservation trouvée</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredBookings.map((booking) => {
                  // Vérifier si le trajet est terminé et si on peut noter
                  const tripCompleted = booking.status === 'CONFIRMED' && new Date(booking.trip.date) < new Date()
                  
                  return (
                    <div key={booking.id} className="glass rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className={`w-3 h-3 rounded-full ${
                              booking.status === 'CONFIRMED' ? 'bg-green-500' :
                              booking.status === 'PENDING' ? 'bg-orange-500' :
                              'bg-gray-400'
                            }`}></div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {booking.trip.fromCity} → {booking.trip.toCity}
                            </h3>
                            <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                              booking.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <span>📅 {new Date(booking.trip.date).toLocaleDateString('fr-FR')}</span>
                            <span>🚚 {booking.trip.vehicleType}</span>
                            <span>👤 {booking.trip.driver.name}</span>
                            <span className="text-xs text-gray-400">
                              Réservé le {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                        
                        {/* Bouton noter si trajet terminé */}
                        {tripCompleted && (
                          <button
                            onClick={() => openReviewModal(
                              booking.trip.id,
                              booking.trip.driver.name === session?.user?.name ? booking.id : booking.trip.driver.name,
                              booking.trip.driver.name,
                              booking.trip.fromCity,
                              booking.trip.toCity,
                              booking.trip.date
                            )}
                            className="ml-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg transition text-sm"
                          >
                            ⭐ Noter
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Modal de notation */}
        {reviewModal && (
          <ReviewModal
            isOpen={reviewModal.isOpen}
            onClose={closeReviewModal}
            tripId={reviewModal.tripId}
            reviewedUserId={reviewModal.reviewedUserId}
            reviewedUserName={reviewModal.reviewedUserName}
            tripInfo={reviewModal.tripInfo}
          />
        )}
      </div>
    </div>
  )
}
