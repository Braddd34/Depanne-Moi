'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserNav from '@/components/UserNav'
import StarRating from '@/components/StarRating'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  reviewer: {
    id: string
    name: string
    company: string | null
  }
  trip: {
    id: string
    fromCity: string
    toCity: string
    date: string
  }
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStats>({ totalReviews: 0, averageRating: 0 })
  const [loadingReviews, setLoadingReviews] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    vehicleType: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: (session.user as any).phone || '',
        company: (session.user as any).company || '',
        vehicleType: (session.user as any).vehicleType || '',
      })
      
      // Charger les avis
      fetchReviews(session.user.id)
    }
  }, [session])

  const fetchReviews = async (userId: string) => {
    try {
      const res = await fetch(`/api/reviews?userId=${userId}`)
      const data = await res.json()
      setReviews(data.reviews || [])
      setReviewStats(data.stats || { totalReviews: 0, averageRating: 0 })
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoadingReviews(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // TODO: Créer une API pour mettre à jour le profil
      // Pour l'instant, juste un message de succès
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Profil mis à jour avec succès !')
    } catch (error) {
      setMessage('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNav />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <UserNav />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Mon <span className="text-gradient">profil</span> 👤
          </h1>
          <p className="text-gray-500 text-lg">
            Gérez vos informations et consultez votre réputation
          </p>
        </div>

        {/* Réputation Card */}
        <div className="glass rounded-3xl p-8 mb-8 fade-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>

            {/* Stats */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {session?.user?.name}
              </h2>
              {reviewStats.totalReviews > 0 ? (
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <StarRating 
                    rating={reviewStats.averageRating} 
                    readonly 
                    size="lg"
                    showCount
                    count={reviewStats.totalReviews}
                  />
                </div>
              ) : (
                <p className="text-gray-500 mb-4">Aucun avis pour le moment</p>
              )}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {(session?.user as any)?.company && (
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-700 border-2 border-gray-200">
                    🏢 {(session.user as any).company}
                  </span>
                )}
                {(session?.user as any)?.role === 'ADMIN' && (
                  <span className="px-4 py-2 bg-red-100 rounded-full text-sm font-bold text-red-700">
                    👑 Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-gray-50"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                L'email ne peut pas être modifié
              </p>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+33 6 12 34 56 78"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>

            {/* Société */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Société (optionnel)
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Nom de votre société"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>

            {/* Type de véhicule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de véhicule (optionnel)
              </label>
              <select
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              >
                <option value="">Sélectionnez un type</option>
                <option value="Camion">Camion</option>
                <option value="Camionnette">Camionnette</option>
                <option value="Remorque">Remorque</option>
                <option value="Semi-remorque">Semi-remorque</option>
                <option value="Fourgon">Fourgon</option>
                <option value="Utilitaire">Utilitaire</option>
              </select>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('succès')
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}>
                {message}
              </div>
            )}

            {/* Bouton */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:shadow-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>

        {/* Avis reçus */}
        <div className="glass rounded-3xl p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>⭐</span> Avis reçus ({reviewStats.totalReviews})
          </h3>
          
          {loadingReviews ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">⭐</div>
              <p className="text-gray-600">Vous n'avez pas encore reçu d'avis</p>
              <p className="text-sm text-gray-500 mt-2">
                Les avis apparaîtront ici après vos trajets
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white/50 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-gray-900">{review.reviewer.name}</div>
                      {review.reviewer.company && (
                        <div className="text-sm text-gray-500">{review.reviewer.company}</div>
                      )}
                    </div>
                    <StarRating rating={review.rating} readonly size="sm" />
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-700 mb-3 italic">"{review.comment}"</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      📍 {review.trip.fromCity} → {review.trip.toCity}
                    </span>
                    <span>
                      📅 {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
