'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserNav from '@/components/UserNav'
import StarRating from '@/components/StarRating'

interface UserData {
  id: string
  name: string
  email: string
  phone: string
  company: string | null
  vehicleType: string | null
  role: string
}

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  reviewer: {
    name: string
  }
  trip: {
    fromCity: string
    toCity: string
    date: string
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState({ average: 0, count: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserData()
      fetchReviews()
    }
  }, [status, session])

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/users/${session?.user?.id}`)
      if (res.ok) {
        const data = await res.json()
        setUserData(data.user)
      }
    } catch (error) {
      console.error('Fetch user data error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?userId=${session?.user?.id}`)
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews)
        setReviewStats(data.stats)
      }
    } catch (error) {
      console.error('Fetch reviews error:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <UserNav />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-red-600">Erreur lors du chargement du profil</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <UserNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Mon <span className="text-gradient">Profil</span> 👤
          </h1>
          <p className="text-gray-500 text-lg">Gérez vos informations personnelles et votre réputation</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="glass rounded-3xl p-8 text-center hover-lift">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{userData.name}</h2>
              <p className="text-gray-600 mb-4">{userData.email}</p>

              {reviewStats.count > 0 && (
                <div className="border-t-2 border-gray-200 pt-4 mt-4">
                  <p className="text-sm text-gray-600 mb-2">Réputation</p>
                  <div className="flex items-center justify-center gap-2">
                    <StarRating
                      rating={reviewStats.average}
                      readonly
                      size="md"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {reviewStats.average.toFixed(1)}/5 · {reviewStats.count} avis
                  </p>
                </div>
              )}

              {userData.company && (
                <div className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-semibold text-sm">
                  🏢 {userData.company}
                </div>
              )}

              {userData.role === 'ADMIN' && (
                <div className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl font-semibold text-sm">
                  🛡️ Administrateur
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">👤 Nom complet</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-2xl text-gray-900 font-medium">
                    {userData.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">📧 Email</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-2xl text-gray-900 font-medium">
                    {userData.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">📱 Téléphone</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-2xl text-gray-900 font-medium">
                    {userData.phone}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">🏢 Société</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-2xl text-gray-900 font-medium">
                    {userData.company || 'Non renseigné'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">🚚 Type de véhicule</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-2xl text-gray-900 font-medium">
                    {userData.vehicleType || 'Non renseigné'}
                  </div>
                </div>
              </div>
            </div>

            {reviews.length > 0 && (
              <div className="glass rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Avis reçus ({reviews.length})
                </h3>
                
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-gray-900">{review.reviewer.name}</p>
                          <p className="text-sm text-gray-500">
                            {review.trip.fromCity} → {review.trip.toCity}
                          </p>
                        </div>
                        <StarRating rating={review.rating} readonly size="sm" />
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                      )}
                      
                      <p className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
