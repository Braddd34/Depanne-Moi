'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import UserNav from '@/components/UserNav'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Bienvenue, <span className="text-gradient">{session?.user?.name}</span> ! 👋
          </h1>
          <p className="text-gray-500 text-lg">
            Gérez vos trajets et réservations en un clin d'œil
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/explore" className="glass rounded-3xl p-6 hover-lift cursor-pointer">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Explorer</h3>
            <p className="text-sm text-gray-600">Trouvez des trajets disponibles</p>
          </Link>

          <Link href="/dashboard/messages" className="glass rounded-3xl p-6 hover-lift cursor-pointer">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Messages</h3>
            <p className="text-sm text-gray-600">Vos conversations</p>
          </Link>

          <Link href="/dashboard/analytics" className="glass rounded-3xl p-6 hover-lift cursor-pointer">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-sm text-gray-600">Vos statistiques</p>
          </Link>

          <Link href="/dashboard/profile" className="glass rounded-3xl p-6 hover-lift cursor-pointer">
            <div className="text-4xl mb-3">👤</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Profil</h3>
            <p className="text-sm text-gray-600">Gérez votre compte</p>
          </Link>
        </div>

        {/* Info Card */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Bienvenue sur Depanne Moi !</h2>
          <p className="text-gray-700 mb-4">
            Votre plateforme de transport et dépannage. Explorez les fonctionnalités :
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Explorer</strong> - Trouvez des trajets disponibles</li>
            <li>✅ <strong>Messages</strong> - Communiquez avec les transporteurs</li>
            <li>✅ <strong>Analytics</strong> - Suivez vos performances</li>
            <li>✅ <strong>Notifications</strong> - Restez informé en temps réel</li>
            <li>✅ <strong>Carte interactive</strong> - Visualisez les itinéraires</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
