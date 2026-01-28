'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import UserNav from '@/components/UserNav'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <UserNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Mon <span className="text-gradient">Profil</span> 👤</h1>
        <div className="glass rounded-3xl p-8">
          <p className="text-xl font-bold mb-2">{session?.user?.name}</p>
          <p className="text-gray-600">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  )
}
