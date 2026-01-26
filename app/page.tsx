import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🚚 Depanne Moi
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Évitez les trajets à vide en mettant en relation des chauffeurs professionnels
          </p>
          <p className="text-lg text-gray-600 mb-12">
            Trouvez des trajets de retour ou proposez vos trajets disponibles
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Rejoindre la plateforme
            </Link>
            <Link
              href="/auth/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Se connecter
            </Link>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">📋 Publiez vos trajets</h3>
              <p className="text-gray-600">
                Indiquez vos trajets retour disponibles et évitez les trajets à vide
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">🔍 Trouvez des trajets</h3>
              <p className="text-gray-600">
                Recherchez des trajets disponibles selon vos besoins
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">🤝 Mise en relation</h3>
              <p className="text-gray-600">
                Contactez directement les professionnels et finalisez vos réservations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
