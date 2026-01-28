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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full fade-in">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl mb-4 shadow-2xl transform hover:scale-105 transition">
            <span className="text-4xl">🚚</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Créer un <span className="text-gradient">compte</span>
          </h1>
          <p className="text-gray-500 text-lg">Rejoignez la communauté Depanne Moi</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Inscription</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Informations personnelles */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  👤 Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📧 Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="jean@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📱 Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🔒 Mot de passe *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="bg-purple-50 rounded-2xl p-5 border-2 border-purple-100">
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span>🏢</span> Informations professionnelles (optionnel)
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Société
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-white"
                    placeholder="Nom de votre entreprise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Type de véhicule
                  </label>
                  <input
                    type="text"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-white"
                    placeholder="Ex: Camion 3.5T"
                  />
                </div>
              </div>
            </div>

            {/* Consentement RGPD - OBLIGATOIRE */}
            <div className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 cursor-pointer"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                  <span className="text-red-600 font-bold">*</span> J'ai lu et j'accepte les{' '}
                  <a
                    href="/legal/terms"
                    target="_blank"
                    className="text-purple-600 hover:text-purple-700 font-bold hover:underline"
                  >
                    Conditions Générales d'Utilisation
                  </a>
                  {' '}et la{' '}
                  <a
                    href="/legal/privacy"
                    target="_blank"
                    className="text-purple-600 hover:text-purple-700 font-bold hover:underline"
                  >
                    Politique de Confidentialité (RGPD)
                  </a>
                  .
                </label>
              </div>
              <p className="text-xs text-gray-600 mt-3 ml-8 flex items-start gap-2">
                <span>🇪🇺</span>
                <span>
                  Vos données sont traitées conformément au RGPD. Vous disposez d'un droit
                  d'accès, de rectification et de suppression de vos données.
                </span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !acceptedTerms}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {loading ? '🔄 Inscription...' : '✨ Créer mon compte'}
            </button>
        </form>

          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <p className="text-center text-gray-600">
              Vous avez déjà un compte ?{' '}
              <a href="/auth/login" className="text-purple-600 hover:text-purple-700 font-bold hover:underline">
                Se connecter →
              </a>
            </p>
          </div>

          {/* Retour à l'accueil */}
          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700 transition">
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
