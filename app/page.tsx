import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
              🚚
            </div>
            <span className="text-2xl font-bold text-gradient">Depanne Moi</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="px-6 py-2 text-gray-700 font-semibold hover:text-purple-600 transition">
              Connexion
            </Link>
            <Link href="/auth/register" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:shadow-xl transition transform hover:scale-105">
              S'inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16 fade-in">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
            Besoin d'un <span className="text-gradient">dépannage</span> ?
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            La plateforme qui connecte les professionnels du transport avec ceux qui en ont besoin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition transform hover:scale-105">
              Commencer gratuitement 🚀
            </Link>
            <Link href="/dashboard/explore" className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:shadow-xl transition border-2 border-gray-200">
              Explorer les trajets 🔍
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="glass rounded-3xl p-8 hover-lift">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-4">
              🚚
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Trajets disponibles</h3>
            <p className="text-gray-600">
              Trouvez rapidement un transporteur disponible pour votre dépannage ou déménagement
            </p>
          </div>

          <div className="glass rounded-3xl p-8 hover-lift">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4">
              💬
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Messagerie instantanée</h3>
            <p className="text-gray-600">
              Communiquez directement avec les transporteurs via notre chat intégré
            </p>
          </div>

          <div className="glass rounded-3xl p-8 hover-lift">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-4">
              ⭐
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Avis vérifiés</h3>
            <p className="text-gray-600">
              Consultez les notes et avis des utilisateurs pour faire le bon choix
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center glass rounded-3xl p-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Prêt à démarrer ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez des milliers d'utilisateurs satisfaits
          </p>
          <Link href="/auth/register" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition transform hover:scale-105">
            Créer un compte gratuitement ✨
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 Depanne Moi. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
