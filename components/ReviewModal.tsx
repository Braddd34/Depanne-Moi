'use client'

import { useState } from 'react'
import StarRating from './StarRating'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  tripId: string
  reviewedUserId: string
  reviewedUserName: string
  tripInfo: {
    fromCity: string
    toCity: string
    date: string
  }
}

export default function ReviewModal({
  isOpen,
  onClose,
  tripId,
  reviewedUserId,
  reviewedUserName,
  tripInfo,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      alert('Veuillez sélectionner une note')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId,
          reviewedUserId,
          rating,
          comment: comment.trim() || undefined,
        }),
      })

      if (res.ok) {
        alert('✅ Avis publié avec succès !')
        onClose()
        setRating(0)
        setComment('')
      } else {
        const data = await res.json()
        alert(`❌ ${data.error || 'Erreur lors de la publication de l\'avis'}`)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('❌ Erreur lors de la publication de l\'avis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="text-4xl mb-3 text-center">⭐</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Notez votre expérience
          </h2>
          <p className="text-gray-600 text-center">
            Trajet : <strong>{tripInfo.fromCity} → {tripInfo.toCity}</strong>
          </p>
          <p className="text-sm text-gray-500 text-center mt-1">
            {new Date(tripInfo.date).toLocaleDateString('fr-FR')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              Comment notez-vous <strong>{reviewedUserName}</strong> ?
            </label>
            <div className="flex justify-center">
              <StarRating
                rating={rating}
                onChange={setRating}
                size="lg"
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Commentaire (optionnel)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {comment.length} / 500 caractères
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Publication...' : 'Publier l\'avis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
