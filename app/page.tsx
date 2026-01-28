import Link from 'next/link'
import PublicNav from '@/components/PublicNav'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Évitez les trajets à vide 🚚
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              La plateforme qui met en relation les professionnels du transport pour optimiser leurs trajets retour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
              >
                Rejoindre gratuitement
              </Link>
              <Link
                href="/dashboard/explore"
                className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-400 transition border-2 border-white"
              >
                Explorer les trajets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Gratuit pour tous</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">🔒</div>
              <div className="text-gray-600">Vérification d'identité obligatoire</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">⚡</div>
              <div className="text-gray-600">Mise en relation instantanée</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Simple, rapide et sécurisé
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Inscrivez-vous</h3>
              <p className="text-gray-600">
                Créez votre compte gratuitement et vérifiez votre identité en 2 minutes
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🚚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Publiez ou cherchez</h3>
              <p className="text-gray-600">
                Indiquez vos trajets retour disponibles ou recherchez des trajets qui vous intéressent
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Contactez et réservez</h3>
              <p className="text-gray-600">
                Entrez en contact avec les professionnels et finalisez vos arrangements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Depanne Moi ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Économisez sur vos trajets</h3>
              <p className="text-gray-600">
                Rentabilisez vos trajets retour et réduisez vos coûts d'exploitation en trouvant des chargements sur vos itinéraires.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Réduisez votre empreinte carbone</h3>
              <p className="text-gray-600">
                Participez à l'optimisation des trajets et contribuez à la réduction des émissions de CO₂.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% sécurisé et vérifié</h3>
              <p className="text-gray-600">
                Tous les utilisateurs sont vérifiés (identité + permis). Protection contre les fraudes et véhicules volés.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Simple et rapide</h3>
              <p className="text-gray-600">
                Interface intuitive, publication en 30 secondes, recherche instantanée. Gagnez du temps !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à optimiser vos trajets ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez dès maintenant les professionnels du transport qui utilisent Depanne Moi
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg inline-block"
          >
            Inscription gratuite - 2 minutes
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
                <li><Link href="/dashboard/explore" className="text-gray-400 hover:text-white transition">Explorer les trajets</Link></li>
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
            <p className="mt-2">Plateforme de mise en relation de professionnels du transport</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
