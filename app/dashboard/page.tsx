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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header - Design épuré */}
        <div className="mb-10 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Bonjour, <span className="text-gradient">{session.user.name}</span> 👋
          </h1>
          <p className="text-gray-500 text-lg">
            Bienvenue sur votre tableau de bord
          </p>
        </div>

        {/* Statistiques - Cards modernes avec glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link href="/dashboard/my-trips" className="group">
            <div className="glass p-8 rounded-3xl card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Mes trajets</p>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🚚</span>
                  </div>
                </div>
                <p className="text-5xl font-bold text-gray-900">{stats.myTrips}</p>
                <p className="text-sm text-gray-500 mt-2">Trajets publiés</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/my-bookings" className="group">
            <div className="glass p-8 rounded-3xl card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Réservations</p>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-3xl">📋</span>
                  </div>
                </div>
                <p className="text-5xl font-bold text-gray-900">{stats.myBookings}</p>
                <p className="text-sm text-gray-500 mt-2">En cours</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/explore" className="group">
            <div className="glass p-8 rounded-3xl card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Disponibles</p>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🔍</span>
                  </div>
                </div>
                <p className="text-5xl font-bold text-gray-900">{stats.availableTrips}</p>
                <p className="text-sm text-gray-500 mt-2">Trajets à explorer</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Actions rapides - Design moderne */}
        <div className="glass rounded-3xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>⚡</span> Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/dashboard/trips/new" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-20 blur transition"></div>
              <div className="relative flex items-center p-6 border-2 border-gray-200 rounded-3xl hover:border-purple-300 transition-all bg-white">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-3xl">➕</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-1">Publier un trajet</p>
                  <p className="text-sm text-gray-600">Proposez un trajet retour disponible</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/explore" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl opacity-0 group-hover:opacity-20 blur transition"></div>
              <div className="relative flex items-center p-6 border-2 border-gray-200 rounded-3xl hover:border-green-300 transition-all bg-white">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-3xl">🔍</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-1">Trouver un trajet</p>
                  <p className="text-sm text-gray-600">Recherchez un transport disponible</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Guide rapide - Design épuré */}
        <div className="relative overflow-hidden rounded-3xl p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600"></div>
          <div className="relative z-10 text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              💡 Comment ça marche ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur border border-white/20">
                <div className="text-4xl mb-3">1️⃣</div>
                <p className="font-bold text-lg mb-2">Publiez vos trajets retour</p>
                <p className="text-sm text-white/80">Indiquez vos trajets à vide disponibles</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur border border-white/20">
                <div className="text-4xl mb-3">2️⃣</div>
                <p className="font-bold text-lg mb-2">Trouvez des trajets</p>
                <p className="text-sm text-white/80">Recherchez selon vos besoins</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur border border-white/20">
                <div className="text-4xl mb-3">3️⃣</div>
                <p className="font-bold text-lg mb-2">Contactez directement</p>
                <p className="text-sm text-white/80">Échangez et finalisez les détails</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
