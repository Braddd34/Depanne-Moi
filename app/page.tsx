import Link from 'next/link'
import PublicNav from '@/components/PublicNav'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <PublicNav />

      {/* Hero Section - Épuré et moderne */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center fade-in">
            <div className="inline-block mb-6 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-purple-200">
              <span className="text-sm font-semibold text-purple-700">🚀 100% Gratuit · Vérification instantanée</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight">
              <span className="text-gradient">Optimisez</span> vos trajets retour
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              La plateforme qui connecte les professionnels du transport. Fini les trajets à vide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10">Commencer gratuitement</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link
                href="/dashboard/explore"
                className="px-8 py-4 bg-white text-gray-800 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300"
              >
                Explorer les trajets
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Sécurisé & vérifié</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Épuré */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass card-hover p-8 rounded-3xl text-center">
              <div className="text-5xl font-bold text-gradient mb-3">100%</div>
              <div className="text-gray-700 font-medium">Gratuit pour tous</div>
              <div className="text-sm text-gray-500 mt-2">Aucun frais caché</div>
            </div>
            <div className="glass card-hover p-8 rounded-3xl text-center">
              <div className="text-5xl mb-3">🔒</div>
              <div className="text-gray-700 font-medium">100% Sécurisé</div>
              <div className="text-sm text-gray-500 mt-2">Vérification obligatoire</div>
            </div>
            <div className="glass card-hover p-8 rounded-3xl text-center">
              <div className="text-5xl mb-3">⚡</div>
              <div className="text-gray-700 font-medium">Instantané</div>
              <div className="text-sm text-gray-500 mt-2">Mise en relation rapide</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Design épuré */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Comment ça <span className="text-gradient">marche</span> ?
            </h2>
            <p className="text-xl text-gray-500 font-light">
              3 étapes pour optimiser vos trajets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
              <div className="relative bg-white p-10 rounded-3xl border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 card-hover">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl transform rotate-6"></div>
                  <div className="relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center h-full text-3xl">
                    📝
                  </div>
                </div>
                <div className="text-sm font-bold text-purple-600 mb-2">ÉTAPE 1</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Inscrivez-vous</h3>
                <p className="text-gray-600 leading-relaxed">
                  Créez votre compte en 2 minutes et vérifiez votre identité de manière sécurisée
                </p>
              </div>
            </div>

            <div className="relative group md:mt-12">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
              <div className="relative bg-white p-10 rounded-3xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 card-hover">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl transform rotate-6"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center h-full text-3xl">
                    🚚
                  </div>
                </div>
                <div className="text-sm font-bold text-blue-600 mb-2">ÉTAPE 2</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Publiez ou cherchez</h3>
                <p className="text-gray-600 leading-relaxed">
                  Publiez vos trajets retour ou trouvez instantanément des trajets disponibles
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
              <div className="relative bg-white p-10 rounded-3xl border-2 border-gray-100 hover:border-cyan-200 transition-all duration-300 card-hover">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl transform rotate-6"></div>
                  <div className="relative bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-2xl flex items-center justify-center h-full text-3xl">
                    🤝
                  </div>
                </div>
                <div className="text-sm font-bold text-cyan-600 mb-2">ÉTAPE 3</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Contactez</h3>
                <p className="text-gray-600 leading-relaxed">
                  Échangez directement et finalisez vos arrangements en toute simplicité
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Design épuré avec glassmorphism */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Pourquoi choisir <span className="text-gradient">Depanne Moi</span> ?
            </h2>
            <p className="text-xl text-gray-500 font-light">
              Les avantages qui font la différence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-3xl card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                💰
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Économisez sur vos trajets</h3>
              <p className="text-gray-600 leading-relaxed">
                Rentabilisez vos trajets retour et réduisez vos coûts d'exploitation en trouvant des chargements sur vos itinéraires.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                🌍
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Écologie et durabilité</h3>
              <p className="text-gray-600 leading-relaxed">
                Participez à l'optimisation des trajets et contribuez activement à la réduction des émissions de CO₂.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                🔒
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sécurité maximale</h3>
              <p className="text-gray-600 leading-relaxed">
                Tous les utilisateurs sont vérifiés (identité + permis). Protection active contre les fraudes et véhicules volés.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                ⚡
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Rapidité et simplicité</h3>
              <p className="text-gray-600 leading-relaxed">
                Interface intuitive, publication en 30 secondes, recherche instantanée. Gagnez du temps précieux !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Design moderne et épuré */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Prêt à <span className="inline-block transform hover:scale-110 transition-transform">démarrer</span> ?
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-white/90 font-light max-w-2xl mx-auto">
            Rejoignez les professionnels du transport qui optimisent leurs trajets avec Depanne Moi
          </p>
          <Link
            href="/auth/register"
            className="inline-block bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            Inscription gratuite · 2 minutes ⚡
          </Link>
          <p className="text-white/70 text-sm mt-6">Sans engagement · Sans carte bancaire</p>
        </div>
      </section>

      {/* Footer - Design épuré et moderne */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gradient-white">🚚 Depanne Moi</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                La plateforme qui révolutionne le transport routier en France.
              </p>
              <div className="mt-6 flex gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition cursor-pointer">
                  <span>𝕏</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition cursor-pointer">
                  <span>in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Navigation</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">→ Accueil</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">→ À propos</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">→ FAQ</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">→ Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Plateforme</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">→ Inscription</Link></li>
                <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">→ Connexion</Link></li>
                <li><Link href="/dashboard/explore" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">→ Explorer</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Légal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/legal/terms" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">→ CGU</Link></li>
                <li><Link href="/legal/privacy" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">→ 🇪🇺 RGPD</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <p>© {new Date().getFullYear()} Depanne Moi · Tous droits réservés</p>
              <p className="text-xs">Plateforme française 🇫🇷 · Conforme RGPD 🇪🇺</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
