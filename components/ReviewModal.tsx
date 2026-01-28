'use client'

import { useState } from 'react'
import StarRating from './StarRating'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  tripId: string
  reviewedUserId: string
  reviewedUserName: string
  onSuccess: () => void
}

export default function ReviewModal({
  isOpen,
  onClose,
  tripId,
  reviewedUserId,
  reviewedUserName,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId,
          reviewedUserId,
          rating,
          comment: comment.trim() || null,
        }),
      })

      if (res.ok) {
        alert('Avis publié avec succès !')
        onSuccess()
        onClose()
      } else {
        const error = await res.json()
        alert(error.error || 'Erreur lors de la publication de l\'avis')
      }
    } catch (error) {
      console.error('Review error:', error)
      alert('Erreur lors de la publication de l\'avis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Noter le trajet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6 text-center">
          <p className="text-gray-700 mb-2">
            Comment s'est passé votre trajet avec
          </p>
          <p className="text-xl font-bold text-purple-600">{reviewedUserName} ?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Votre note
            </label>
            <StarRating rating={rating} onRatingChange={setRating} size="lg" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Commentaire (optionnel)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none"
              placeholder="Partagez votre expérience..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? '🔄 Envoi...' : '⭐ Publier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
