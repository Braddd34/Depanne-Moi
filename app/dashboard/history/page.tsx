'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import UserNav from '@/components/UserNav'

export default function HistoryPage() {
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
        <h1 className="text-4xl font-bold mb-4"><span className="text-gradient">Historique</span> 📚</h1>
        <p className="text-gray-600">Page en cours de restauration...</p>
      </div>
    </div>
  )
}
