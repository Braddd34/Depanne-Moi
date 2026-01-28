'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import UserNav from '@/components/UserNav'

interface Stats {
  myTrips: number
  myBookings: number
  availableTrips: number
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({ myTrips: 0, myBookings: 0, availableTrips: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      // Récupérer tous les trajets
      const tripsRes = await fetch('/api/trips')
      const tripsData = await tripsRes.json()
      
      // Récupérer mes réservations
      const bookingsRes = await fetch('/api/bookings')
      const bookingsData = await bookingsRes.json()

      const allTrips = tripsData.trips || []
      const myTrips = allTrips.filter((t: any) => t.driverId === session?.user?.id)
      const myBookings = bookingsData.bookings || []

      setStats({
        myTrips: myTrips.length,
        myBookings: myBookings.length,
        availableTrips: allTrips.length,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNav />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {session.user.name} 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue sur votre tableau de bord
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/my-trips" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mes trajets</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.myTrips}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/my-bookings" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mes réservations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.myBookings}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/explore" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trajets disponibles</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.availableTrips}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/trips/new"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">➕</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Publier un trajet</p>
                <p className="text-sm text-gray-600">Proposez un trajet retour disponible</p>
              </div>
            </Link>

            <Link
              href="/dashboard/explore"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🔍</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Trouver un trajet</p>
                <p className="text-sm text-gray-600">Recherchez un transport disponible</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Guide rapide */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow p-6 text-white">
          <h2 className="text-xl font-bold mb-4">💡 Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="text-3xl mb-2">1️⃣</div>
              <p className="font-semibold mb-1">Publiez vos trajets retour</p>
              <p className="text-sm text-blue-100">Indiquez vos trajets à vide disponibles</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="text-3xl mb-2">2️⃣</div>
              <p className="font-semibold mb-1">Trouvez des trajets</p>
              <p className="text-sm text-blue-100">Recherchez selon vos besoins</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="text-3xl mb-2">3️⃣</div>
              <p className="font-semibold mb-1">Contactez directement</p>
              <p className="text-sm text-blue-100">Coordonnées échangées après réservation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
