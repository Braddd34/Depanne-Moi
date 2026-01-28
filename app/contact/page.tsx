'use client'

import { useState } from 'react'
import PublicNav from '@/components/PublicNav'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    // Simuler l'envoi (à remplacer par un vrai endpoint plus tard)
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      setTimeout(() => setStatus('idle'), 5000)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-xl text-blue-100">
            Une question ? Un problème ? Nous sommes là pour vous aider !
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 text-sm">
                contact@depannemoi.fr
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Horaires</h3>
              <p className="text-gray-600 text-sm">
                Lun-Ven: 9h - 18h<br />
                Sam-Dim: Fermé
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Réponse</h3>
              <p className="text-gray-600 text-sm">
                Sous 24-48h<br />
                (jours ouvrés)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Envoyez-nous un message
            </h2>

            {status === 'success' && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-green-800 font-medium">
                  ✅ Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-800 font-medium">
                  ❌ Une erreur est survenue. Veuillez réessayer.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jean Dupont"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="jean@exemple.fr"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="general">Question générale</option>
                  <option value="technical">Problème technique</option>
                  <option value="account">Compte utilisateur</option>
                  <option value="verification">Vérification d'identité</option>
                  <option value="trip">Trajet / Réservation</option>
                  <option value="fraud">Signaler une fraude</option>
                  <option value="partnership">Partenariat</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Décrivez votre demande en détail..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-6">
              En envoyant ce formulaire, vous acceptez que vos données soient utilisées pour traiter votre demande.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Avant de nous contacter...
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Consultez notre FAQ, vous y trouverez peut-être la réponse à votre question !
          </p>
          <Link
            href="/faq"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition border-2 border-blue-600 inline-block"
          >
            Voir la FAQ
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🚚 Depanne Moi</h3>
              <p className="text-gray-400 text-sm">
                La plateforme de mise en relation des professionnels du transport.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-white transition">Accueil</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition">À propos</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Plateforme</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auth/register" className="text-gray-400 hover:text-white transition">Inscription</Link></li>
                <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition">Connexion</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/legal/terms" className="text-gray-400 hover:text-white transition">CGU</Link></li>
                <li><Link href="/legal/privacy" className="text-gray-400 hover:text-white transition">🇪🇺 RGPD</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Depanne Moi - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
