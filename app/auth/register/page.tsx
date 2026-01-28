'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Register() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    company: '',
    vehicleType: '',
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Vérifier l'acceptation des CGU (RGPD)
    if (!acceptedTerms) {
      alert('Vous devez accepter les Conditions Générales d\'Utilisation et la Politique de Confidentialité pour continuer.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          acceptedTerms: true,
          acceptedTermsAt: new Date().toISOString(),
        }),
      })

      if (res.ok) {
        router.push('/auth/login?registered=true')
      } else {
        const error = await res.json()
        alert(error.error || 'Erreur lors de l\'inscription')
      }
    } catch (error) {
      console.error('Register error:', error)
      alert('Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">Inscription</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Société (optionnel)
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de véhicule (optionnel)
            </label>
            <input
              type="text"
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ex: Camion, Remorque"
            />
          </div>

          {/* Consentement RGPD - OBLIGATOIRE */}
          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                <span className="text-red-600">*</span> J'ai lu et j'accepte les{' '}
                <a
                  href="/legal/terms"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Conditions Générales d'Utilisation
                </a>
                {' '}et la{' '}
                <a
                  href="/legal/privacy"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Politique de Confidentialité (RGPD)
                </a>
                .
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-6">
              🇪🇺 Vos données sont traitées conformément au RGPD. Vous disposez d'un droit
              d'accès, de rectification et de suppression de vos données.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !acceptedTerms}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà un compte ?{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  )
}
