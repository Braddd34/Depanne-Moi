import PublicNav from '@/components/PublicNav'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">À propos de Depanne Moi</h1>
          <p className="text-xl text-blue-100">
            Notre mission : optimiser le transport routier et réduire les trajets à vide
          </p>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Notre Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Depanne Moi est né d'un constat simple : trop de camions roulent à vide sur nos routes. 
              Notre plateforme met en relation les professionnels du transport pour optimiser leurs trajets 
              retour et contribuer à un transport plus économique et écologique.
            </p>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Nos Valeurs</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Confiance</h3>
              <p className="text-gray-600">
                Tous nos utilisateurs sont vérifiés (identité + permis) pour garantir la sécurité 
                de tous. Nous luttons activement contre les fraudes et les véhicules volés.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Écologie</h3>
              <p className="text-gray-600">
                En optimisant les trajets retour, nous contribuons à réduire les émissions de CO₂ 
                et à rendre le transport routier plus durable.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Simplicité</h3>
              <p className="text-gray-600">
                Une plateforme intuitive et gratuite pour tous. Publication en 30 secondes, 
                recherche instantanée, mise en relation directe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Le Problème */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Le Problème</h2>
          
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              En France, <strong className="text-gray-900">25% des camions roulent à vide</strong>. 
              Cela représente des millions de kilomètres inutiles chaque année, avec un impact considérable :
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                <h4 className="font-bold text-red-900 mb-2">💰 Coûts économiques</h4>
                <p className="text-red-800 text-sm">
                  Carburant gaspillé, usure des véhicules, perte de rentabilité pour les transporteurs
                </p>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-bold text-orange-900 mb-2">🌍 Impact environnemental</h4>
                <p className="text-orange-800 text-sm">
                  Émissions de CO₂ inutiles, pollution atmosphérique, congestion routière
                </p>
              </div>
            </div>

            <p>
              <strong className="text-gray-900">Depanne Moi</strong> apporte une solution concrète en permettant 
              aux professionnels du transport de trouver facilement des chargements pour leurs trajets retour.
            </p>
          </div>
        </div>
      </section>

      {/* Notre Solution */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Notre Solution</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🔍 Mise en relation intelligente</h3>
              <p className="text-gray-600">
                Notre plateforme permet aux chauffeurs et aux entreprises de transport de publier leurs 
                trajets retour disponibles et de rechercher des opportunités de chargement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🔒 Sécurité maximale</h3>
              <p className="text-gray-600">
                Vérification d'identité obligatoire (CNI/Passeport + Permis de conduire) pour tous les 
                utilisateurs. Protection contre les fraudes et véhicules volés.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">💰 100% Gratuit</h3>
              <p className="text-gray-600">
                Aucun frais d'inscription, aucune commission sur les transactions. Notre objectif est de 
                rendre le service accessible à tous les professionnels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Qui sommes-nous */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Qui sommes-nous ?</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Depanne Moi a été créé par une équipe passionnée par l'optimisation logistique et 
            l'innovation dans le secteur du transport. Nous croyons qu'en facilitant la collaboration 
            entre professionnels, nous pouvons rendre le transport plus efficace, plus économique et plus respectueux de l'environnement.
          </p>
          <p className="text-lg text-gray-600">
            Nous sommes une entreprise française 🇫🇷, conforme au RGPD 🇪🇺, et engagée dans la 
            lutte contre la fraude et les véhicules volés.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez-nous !</h2>
          <p className="text-xl mb-8 text-blue-100">
            Faites partie de la communauté des professionnels qui optimisent leurs trajets
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg inline-block"
          >
            Inscription gratuite
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
                <li><Link href="/dashboard/explore" className="text-gray-400 hover:text-white transition">Explorer</Link></li>
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
