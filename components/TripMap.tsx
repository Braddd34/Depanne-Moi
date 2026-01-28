'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Importer Leaflet de manière dynamique (côté client uniquement)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
)

interface Trip {
  id: string
  fromCity: string
  toCity: string
  date: string
  vehicleType: string
  price: number | null
  driver: {
    name: string
    company: string | null
  }
}

interface Coordinates {
  lat: number
  lon: number
}

interface TripMapProps {
  trips: Trip[]
  onTripClick?: (tripId: string) => void
}

/**
 * Géocodage d'une ville avec l'API Nominatim (OpenStreetMap - gratuit)
 */
async function geocodeCity(city: string): Promise<Coordinates | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ', France')}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'DepanneMoi/1.0',
        },
      }
    )
    const data = await response.json()
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      }
    }
    return null
  } catch (error) {
    console.error('Erreur géocodage:', error)
    return null
  }
}

export default function TripMap({ trips, onTripClick }: TripMapProps) {
  const [geocodedTrips, setGeocodedTrips] = useState<Array<{
    trip: Trip
    from: Coordinates
    to: Coordinates
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function geocodeAllTrips() {
      const results = []
      
      for (const trip of trips) {
        const from = await geocodeCity(trip.fromCity)
        const to = await geocodeCity(trip.toCity)
        
        if (from && to) {
          results.push({ trip, from, to })
        }
        
        // Pause de 1 seconde entre chaque requête (limite API Nominatim)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      setGeocodedTrips(results)
      setLoading(false)
    }

    if (trips.length > 0) {
      geocodeAllTrips()
    } else {
      setLoading(false)
    }
  }, [trips])

  if (loading) {
    return (
      <div className="glass rounded-3xl p-16 text-center">
        <div className="animate-spin text-6xl mb-4">🗺️</div>
        <p className="text-gray-600 text-lg">
          Chargement de la carte et géocodage des villes...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Cela peut prendre quelques secondes
        </p>
      </div>
    )
  }

  if (geocodedTrips.length === 0) {
    return (
      <div className="glass rounded-3xl p-16 text-center">
        <div className="text-8xl mb-6 opacity-50">🗺️</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Aucun trajet à afficher
        </h3>
        <p className="text-gray-600">
          Il n'y a pas de trajets disponibles pour le moment
        </p>
      </div>
    )
  }

  // Centre de la carte : moyenne de tous les points
  const centerLat = geocodedTrips.reduce((sum, t) => sum + t.from.lat + t.to.lat, 0) / (geocodedTrips.length * 2)
  const centerLon = geocodedTrips.reduce((sum, t) => sum + t.from.lon + t.to.lon, 0) / (geocodedTrips.length * 2)

  return (
    <div className="relative w-full h-[700px] rounded-3xl overflow-hidden shadow-2xl">
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={6}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geocodedTrips.map(({ trip, from, to }) => (
          <div key={trip.id}>
            {/* Ligne du trajet */}
            <Polyline
              positions={[
                [from.lat, from.lon],
                [to.lat, to.lon],
              ]}
              color="#8b5cf6"
              weight={3}
              opacity={0.7}
            />

            {/* Marqueur départ (vert) */}
            <Marker position={[from.lat, from.lon]}>
              <Popup>
                <div className="p-2">
                  <div className="font-bold text-green-700 mb-2">📍 DÉPART</div>
                  <div className="text-lg font-bold">{trip.fromCity}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    → {trip.toCity}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(trip.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    🚚 {trip.vehicleType}
                  </div>
                  {trip.price && (
                    <div className="text-lg font-bold text-purple-600 mt-2">
                      💰 {trip.price}€
                    </div>
                  )}
                  {onTripClick && (
                    <button
                      onClick={() => onTripClick(trip.id)}
                      className="mt-3 w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700"
                    >
                      Voir détails →
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>

            {/* Marqueur arrivée (rouge) */}
            <Marker position={[to.lat, to.lon]}>
              <Popup>
                <div className="p-2">
                  <div className="font-bold text-red-700 mb-2">📍 ARRIVÉE</div>
                  <div className="text-lg font-bold">{trip.toCity}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    {trip.fromCity} →
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(trip.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    👤 {trip.driver.name}
                  </div>
                  {onTripClick && (
                    <button
                      onClick={() => onTripClick(trip.id)}
                      className="mt-3 w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700"
                    >
                      Voir détails →
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>

      {/* Légende */}
      <div className="absolute bottom-6 right-6 glass p-4 rounded-2xl shadow-lg z-[1000]">
        <div className="text-sm font-bold text-gray-900 mb-2">LÉGENDE</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Point de départ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Point d'arrivée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-purple-500 rounded"></div>
            <span>Trajet</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
          <strong>{geocodedTrips.length}</strong> trajet{geocodedTrips.length > 1 ? 's' : ''} affiché{geocodedTrips.length > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
