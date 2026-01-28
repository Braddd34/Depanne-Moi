'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Import dynamique pour Leaflet (côté client uniquement)
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
const useMap = dynamic(
  () => import('react-leaflet').then((mod) => mod.useMap),
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

interface TripWithRoute {
  trip: Trip
  from: Coordinates
  to: Coordinates
  route: [number, number][]
}

interface UberStyleMapProps {
  trips: Trip[]
  selectedTripId: string | null
  onTripSelect: (tripId: string | null) => void
  onTripClick: (tripId: string) => void
}

/**
 * Géocodage d'une ville avec Nominatim
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

/**
 * Récupérer l'itinéraire réel entre 2 points avec OSRM
 */
async function getRoute(from: Coordinates, to: Coordinates): Promise<[number, number][]> {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
    )
    const data = await response.json()
    
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      // Convertir de [lon, lat] à [lat, lon] pour Leaflet
      return data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]])
    }
    
    // Fallback : ligne droite si échec
    return [[from.lat, from.lon], [to.lat, to.lon]]
  } catch (error) {
    console.error('Erreur routing:', error)
    // Fallback : ligne droite
    return [[from.lat, from.lon], [to.lat, to.lon]]
  }
}

// Composant pour recentrer la carte
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  
  return null
}

export default function UberStyleMap({ trips, selectedTripId, onTripSelect, onTripClick }: UberStyleMapProps) {
  const [geocodedTrips, setGeocodedTrips] = useState<TripWithRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334]) // Centre de la France
  const [mapZoom, setMapZoom] = useState(6)

  useEffect(() => {
    async function geocodeAndRoute() {
      const results: TripWithRoute[] = []
      
      for (const trip of trips) {
        const from = await geocodeCity(trip.fromCity)
        await new Promise(resolve => setTimeout(resolve, 1100)) // Rate limit
        
        const to = await geocodeCity(trip.toCity)
        await new Promise(resolve => setTimeout(resolve, 1100))
        
        if (from && to) {
          const route = await getRoute(from, to)
          results.push({ trip, from, to, route })
        }
      }
      
      setGeocodedTrips(results)
      setLoading(false)
    }

    if (trips.length > 0) {
      geocodeAndRoute()
    } else {
      setLoading(false)
    }
  }, [trips])

  // Recentrer sur le trajet sélectionné
  useEffect(() => {
    if (selectedTripId) {
      const selected = geocodedTrips.find(t => t.trip.id === selectedTripId)
      if (selected) {
        const centerLat = (selected.from.lat + selected.to.lat) / 2
        const centerLon = (selected.from.lon + selected.to.lon) / 2
        setMapCenter([centerLat, centerLon])
        setMapZoom(8)
      }
    } else if (geocodedTrips.length > 0) {
      // Vue d'ensemble de tous les trajets
      const avgLat = geocodedTrips.reduce((sum, t) => sum + t.from.lat + t.to.lat, 0) / (geocodedTrips.length * 2)
      const avgLon = geocodedTrips.reduce((sum, t) => sum + t.from.lon + t.to.lon, 0) / (geocodedTrips.length * 2)
      setMapCenter([avgLat, avgLon])
      setMapZoom(6)
    }
  }, [selectedTripId, geocodedTrips])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🗺️</div>
          <p className="text-gray-600 text-lg font-semibold">
            Chargement de la carte...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Géocodage et calcul des itinéraires
          </p>
        </div>
      </div>
    )
  }

  if (geocodedTrips.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-8xl mb-6 opacity-50">🗺️</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Aucun trajet à afficher
          </h3>
          <p className="text-gray-600">
            Ajoutez des trajets pour les voir sur la carte
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full"
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <MapController center={mapCenter} zoom={mapZoom} />
        
        {/* Style Uber/moderne avec tiles personnalisées */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geocodedTrips.map(({ trip, from, to, route }) => {
          const isSelected = trip.id === selectedTripId
          
          return (
            <div key={trip.id}>
              {/* Itinéraire réel (pas juste une ligne droite) */}
              <Polyline
                positions={route}
                color={isSelected ? '#7c3aed' : '#a78bfa'}
                weight={isSelected ? 5 : 3}
                opacity={isSelected ? 1 : 0.6}
                eventHandlers={{
                  click: () => onTripSelect(trip.id)
                }}
              />

              {/* Marqueur départ */}
              <Marker 
                position={[from.lat, from.lon]}
                eventHandlers={{
                  click: () => onTripSelect(trip.id)
                }}
              >
                <Popup>
                  <div className="p-3 min-w-[250px]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        A
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-semibold uppercase">Départ</div>
                        <div className="text-lg font-bold text-gray-900">{trip.fromCity}</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Destination</span>
                        <span className="font-semibold text-gray-900">{trip.toCity}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Date</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(trip.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Véhicule</span>
                        <span className="font-semibold text-gray-900">{trip.vehicleType}</span>
                      </div>
                      {trip.price && (
                        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                          <span className="text-gray-600">Prix</span>
                          <span className="font-bold text-purple-600 text-lg">{trip.price}€</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onTripClick(trip.id)}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition"
                    >
                      Voir le trajet →
                    </button>
                  </div>
                </Popup>
              </Marker>

              {/* Marqueur arrivée */}
              <Marker 
                position={[to.lat, to.lon]}
                eventHandlers={{
                  click: () => onTripSelect(trip.id)
                }}
              >
                <Popup>
                  <div className="p-3 min-w-[250px]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        B
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-semibold uppercase">Arrivée</div>
                        <div className="text-lg font-bold text-gray-900">{trip.toCity}</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">De</span>
                        <span className="font-semibold text-gray-900">{trip.fromCity}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Chauffeur</span>
                        <span className="font-semibold text-gray-900">{trip.driver.name}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onTripClick(trip.id)}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition"
                    >
                      Réserver →
                    </button>
                  </div>
                </Popup>
              </Marker>
            </div>
          )
        })}
      </MapContainer>

      {/* Contrôles de zoom personnalisés (style Uber) */}
      <div className="absolute bottom-8 right-8 z-[1000] flex flex-col gap-2">
        <button 
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold text-gray-700 hover:bg-gray-50 transition"
          onClick={() => setMapZoom(z => Math.min(z + 1, 18))}
        >
          +
        </button>
        <button 
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold text-gray-700 hover:bg-gray-50 transition"
          onClick={() => setMapZoom(z => Math.max(z - 1, 3))}
        >
          −
        </button>
      </div>

      {/* Badge nombre de trajets */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="bg-white rounded-full shadow-lg px-6 py-3">
          <span className="text-sm font-semibold text-gray-600">
            <span className="text-2xl font-bold text-purple-600">{geocodedTrips.length}</span> trajet{geocodedTrips.length > 1 ? 's' : ''} disponible{geocodedTrips.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
