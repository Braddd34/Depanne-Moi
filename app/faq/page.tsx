'use client'

import { useState } from 'react'
import PublicNav from '@/components/PublicNav'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  // Général
  {
    category: 'Général',
    question: 'Qu\'est-ce que Depanne Moi ?',
    answer: 'Depanne Moi est une plateforme gratuite qui met en relation les professionnels du transport pour optimiser leurs trajets retour. Elle permet d\'éviter les trajets à vide en facilitant la recherche de chargements sur les itinéraires de retour.',
  },
  {
    category: 'Général',
    question: 'Le service est-il vraiment gratuit ?',
    answer: 'Oui, 100% gratuit ! Aucun frais d\'inscription, aucune commission sur les transactions. Notre objectif est de rendre le service accessible à tous les professionnels du transport.',
  },
  {
    category: 'Général',
    question: 'Qui peut utiliser Depanne Moi ?',
    answer: 'Tous les professionnels du transport : chauffeurs indépendants, entreprises de transport, loueurs de véhicules, etc. La vérification d\'identité (CNI/Passeport + Permis) est obligatoire pour garantir la sécurité.',
  },

  // Inscription
  {
    category: 'Inscription',
    question: 'Comment m\'inscrire ?',
    answer: 'Cliquez sur "Inscription gratuite", remplissez le formulaire (email, mot de passe, nom, téléphone), acceptez les CGU, et validez. Vous devrez ensuite vérifier votre identité avant de publier ou réserver des trajets.',
  },
  {
    category: 'Inscription',
    question: 'Pourquoi dois-je vérifier mon identité ?',
    answer: 'La vérification d\'identité (CNI/Passeport + Permis de conduire) est obligatoire pour garantir la sécurité de tous. Elle permet de lutter contre les fraudes, les véhicules volés, et d\'assurer la confiance entre utilisateurs.',
  },
  {
    category: 'Inscription',
    question: 'Combien de temps prend la vérification ?',
    answer: 'La vérification d\'identité prend environ 2-3 minutes. Il suffit de prendre en photo votre pièce d\'identité et de faire un selfie. La validation est quasi-instantanée.',
  },

  // Trajets
  {
    category: 'Trajets',
    question: 'Comment publier un trajet ?',
    answer: 'Une fois votre identité vérifiée, allez dans "Mes trajets" → "Publier un trajet". Indiquez la ville de départ, la ville d\'arrivée, la date, le type de véhicule et un prix indicatif (optionnel).',
  },
  {
    category: 'Trajets',
    question: 'Comment rechercher un trajet ?',
    answer: 'Allez dans "Trajets disponibles". Vous pouvez filtrer par ville de départ, ville d\'arrivée, date et type de véhicule. Les trajets disponibles s\'affichent instantanément.',
  },
  {
    category: 'Trajets',
    question: 'Puis-je modifier ou annuler un trajet publié ?',
    answer: 'Oui, vous pouvez modifier ou annuler un trajet à tout moment depuis "Mes trajets". Si des réservations ont déjà été effectuées, pensez à prévenir les utilisateurs concernés.',
  },

  // Réservations
  {
    category: 'Réservations',
    question: 'Comment réserver un trajet ?',
    answer: 'Trouvez un trajet qui vous intéresse dans "Trajets disponibles", cliquez sur "Réserver", et contactez directement le chauffeur pour finaliser les détails (tarif, point de rencontre, etc.).',
  },
  {
    category: 'Réservations',
    question: 'Comment annuler une réservation ?',
    answer: 'Vous pouvez annuler une réservation depuis "Mes réservations". Pensez à prévenir le chauffeur le plus tôt possible par courtoisie.',
  },
  {
    category: 'Réservations',
    question: 'Le paiement se fait sur la plateforme ?',
    answer: 'Non, pour l\'instant les arrangements financiers se font directement entre utilisateurs. Nous recommandons les paiements sécurisés (virement, PayPal) plutôt que le cash.',
  },

  // Sécurité
  {
    category: 'Sécurité',
    question: 'Mes données sont-elles protégées ?',
    answer: 'Oui, nous sommes conformes au RGPD 🇪🇺. Vos données personnelles sont chiffrées et ne sont jamais partagées avec des tiers sans votre consentement. Consultez notre Politique de Confidentialité pour plus de détails.',
  },
  {
    category: 'Sécurité',
    question: 'Comment signaler un utilisateur suspect ?',
    answer: 'Si vous rencontrez un comportement suspect, contactez-nous immédiatement via la page "Contact". Nous prenons très au sérieux la sécurité de notre communauté.',
  },
  {
    category: 'Sécurité',
    question: 'Que faire en cas de fraude ou de véhicule volé ?',
    answer: 'Contactez-nous immédiatement et signalez le cas à la police. Grâce à la vérification d\'identité obligatoire, nous pouvons identifier rapidement les personnes concernées.',
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('Tous')

  const categories = ['Tous', ...Array.from(new Set(faqData.map(item => item.category)))]

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'Tous' || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Questions Fréquentes</h1>
          <p className="text-xl text-blue-100 mb-8">
            Trouvez rapidement les réponses à vos questions
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Aucune question trouvée. Essayez un autre terme de recherche.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredFAQ.map((item, index) => (
                <details
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden group"
                >
                  <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {item.question}
                    </h3>
                    <span className="text-2xl text-gray-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Vous n'avez pas trouvé votre réponse ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            N'hésitez pas à nous contacter, nous sommes là pour vous aider !
          </p>
          <Link
            href="/contact"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg inline-block"
          >
            Nous contacter
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
