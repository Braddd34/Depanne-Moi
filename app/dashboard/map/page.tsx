'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import UserNav from '@/components/UserNav'
import Link from 'next/link'

/**
 * Page Carte Interactive (À implémenter)
 * 
 * Pour ajouter la carte interactive :
 * 1. Installer Leaflet : npm install leaflet react-leaflet @types/leaflet
 * 2. Ajouter le CSS dans globals.css : @import 'leaflet/dist/leaflet.css';
 * 3. Implémenter la carte avec les trajets
 * 
 * Documentation :
 * - Leaflet : https://leafletjs.com/
 * - React Leaflet : https://react-leaflet.js.org/
 */

export default function MapPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Carte <span className="text-gradient">interactive</span> 🗺️
          </h1>
          <p className="text-gray-500 text-lg">
            Visualisez tous les trajets sur une carte
          </p>
        </div>

        {/* Placeholder */}
        <div className="glass rounded-3xl p-16 text-center">
          <div className="text-8xl mb-8 opacity-50">🗺️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Carte interactive à venir !
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Cette fonctionnalité permet de visualiser tous les trajets sur une carte interactive
            avec Leaflet (OpenStreetMap). Les trajets seront affichés avec des marqueurs cliquables.
          </p>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 mb-8 max-w-3xl mx-auto text-left">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              🛠️ Pour implémenter la carte :
            </h3>
            <ol className="space-y-3 text-blue-800">
              <li className="flex items-start gap-3">
                <span className="font-bold">1.</span>
                <span>Installer Leaflet : <code className="bg-blue-100 px-2 py-1 rounded">npm install leaflet react-leaflet @types/leaflet</code></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold">2.</span>
                <span>Ajouter le CSS dans <code className="bg-blue-100 px-2 py-1 rounded">app/globals.css</code></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold">3.</span>
                <span>Implémenter le composant de carte avec les trajets</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold">4.</span>
                <span>Ajouter le géocodage des villes (API Nominatim gratuite)</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://react-leaflet.js.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:shadow-xl font-bold transition-all transform hover:scale-105"
            >
              📚 Documentation Leaflet
            </a>
            <Link
              href="/dashboard/explore"
              className="px-8 py-4 bg-white text-gray-700 rounded-2xl hover:shadow-xl font-bold transition-all border-2 border-gray-200"
            >
              ← Retour aux trajets
            </Link>
          </div>
        </div>

        {/* Aperçu des fonctionnalités */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="glass p-8 rounded-3xl text-center">
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Marqueurs</h3>
            <p className="text-gray-600 text-sm">
              Chaque trajet affiché avec un marqueur cliquable sur la carte
            </p>
          </div>

          <div className="glass p-8 rounded-3xl text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Filtres</h3>
            <p className="text-gray-600 text-sm">
              Filtrer les trajets par date, véhicule, prix directement sur la carte
            </p>
          </div>

          <div className="glass p-8 rounded-3xl text-center">
            <div className="text-5xl mb-4">🛣️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Itinéraires</h3>
            <p className="text-gray-600 text-sm">
              Voir le trajet complet entre le point de départ et d'arrivée
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
