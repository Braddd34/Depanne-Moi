'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Import dynamique pour éviter les erreurs SSR
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
  price: number
  status: string
  driver: {
    id: string
    name: string
    company: string | null
  }
}

interface OpenFreeMapComponentProps {
  trips: Trip[]
  onTripClick?: (trip: Trip) => void
  selectedTripId?: string
}

interface CityCoords {
  lat: number
  lon: number
}

const FRANCE_CENTER: [number, number] = [46.603354, 1.888334]

// Cache pour éviter de géocoder plusieurs fois la même ville
const coordsCache: Record<string, CityCoords> = {}

// Fonction de geocoding avec cache localStorage
async function geocodeCity(city: string): Promise<CityCoords | null> {
  const cacheKey = `coords_${city.toLowerCase()}`
  
  // Vérifier le cache mémoire
  if (coordsCache[cacheKey]) {
    return coordsCache[cacheKey]
  }
  
  // Vérifier localStorage
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const coords = JSON.parse(cached)
      coordsCache[cacheKey] = coords
      return coords
    }
  }
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=France&format=json&limit=1`
    )
    const data = await response.json()
    
    if (data && data.length > 0) {
      const coords: CityCoords = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      }
      
      // Sauvegarder dans cache
      coordsCache[cacheKey] = coords
      if (typeof window !== 'undefined') {
        localStorage.setItem(cacheKey, JSON.stringify(coords))
      }
      
      return coords
    }
  } catch (error) {
    console.error('Geocoding error for', city, error)
  }
  
  return null
}

// Fonction pour obtenir un itinéraire routier
async function getRoute(from: CityCoords, to: CityCoords): Promise<[number, number][]> {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
    )
    const data = await response.json()
    
    if (data.routes && data.routes.length > 0) {
      const coordinates = data.routes[0].geometry.coordinates
      return coordinates.map((coord: [number, number]) => [coord[1], coord[0]])
    }
  } catch (error) {
    console.error('Routing error:', error)
  }
  
  return [[from.lat, from.lon], [to.lat, to.lon]]
}

export default function OpenFreeMapComponent({ trips, onTripClick, selectedTripId }: OpenFreeMapComponentProps) {
  const [mapReady, setMapReady] = useState(false)
  const [tripsWithCoords, setTripsWithCoords] = useState<Array<{
    trip: Trip
    fromCoords: CityCoords
    toCoords: CityCoords
    route: [number, number][]
  }>>([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  useEffect(() => {
    setMapReady(true)
  }, [])

  useEffect(() => {
    if (mapReady && trips.length > 0) {
      loadTripsWithCoords()
    }
  }, [mapReady, trips])

  const loadTripsWithCoords = async () => {
    setLoading(true)
    setProgress({ current: 0, total: trips.length })
    const results = []

    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i]
      setProgress({ current: i + 1, total: trips.length })

      const fromCoords = await geocodeCity(trip.fromCity)
      const toCoords = await geocodeCity(trip.toCity)

      if (fromCoords && toCoords) {
        const route = await getRoute(fromCoords, toCoords)
        results.push({ trip, fromCoords, toCoords, route })
      }

      // Petit délai pour éviter de surcharger l'API (sauf si c'est en cache)
      if (!coordsCache[`coords_${trip.fromCity.toLowerCase()}`]) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    setTripsWithCoords(results)
    setLoading(false)
  }

  if (!mapReady) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative h-full">
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] glass px-6 py-3 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="spinner"></div>
            <span className="font-bold text-gray-900">
              Chargement des trajets... {progress.current}/{progress.total}
            </span>
          </div>
        </div>
      )}

      <MapContainer
        center={FRANCE_CENTER}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        className="rounded-3xl overflow-hidden"
      >
        {/* OpenFreeMap tiles via LFMaps CDN */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://openfreemap.org">OpenFreeMap</a>'
          url="https://{s}.lfmaps.fr/openfreemap/positron/{z}/{x}/{y}.png"
          subdomains={['a', 'b', 'c']}
        />

        {tripsWithCoords.map(({ trip, fromCoords, toCoords, route }, index) => {
          const isSelected = trip.id === selectedTripId

          return (
            <div key={trip.id}>
              {/* Itinéraire */}
              <Polyline
                positions={route}
                color={isSelected ? '#9333ea' : '#3b82f6'}
                weight={isSelected ? 4 : 3}
                opacity={isSelected ? 0.8 : 0.6}
              />

              {/* Marker départ (A) */}
              <Marker
                position={[fromCoords.lat, fromCoords.lon]}
                eventHandlers={{
                  click: () => onTripClick && onTripClick(trip),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <div className="font-bold text-green-600 mb-1">🟢 Départ</div>
                    <div className="font-bold text-lg">{trip.fromCity}</div>
                    <div className="text-sm text-gray-600">{trip.vehicleType}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(trip.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="font-bold text-purple-600 mt-2">{trip.price}€</div>
                    <div className="text-xs text-gray-500 mt-1">👤 {trip.driver.name}</div>
                  </div>
                </Popup>
              </Marker>

              {/* Marker arrivée (B) */}
              <Marker
                position={[toCoords.lat, toCoords.lon]}
                eventHandlers={{
                  click: () => onTripClick && onTripClick(trip),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <div className="font-bold text-purple-600 mb-1">🔵 Arrivée</div>
                    <div className="font-bold text-lg">{trip.toCity}</div>
                    <div className="text-sm text-gray-600">{trip.fromCity} → {trip.toCity}</div>
                    <div className="font-bold text-purple-600 mt-2">{trip.price}€</div>
                  </div>
                </Popup>
              </Marker>
            </div>
          )
        })}
      </MapContainer>

      {!loading && tripsWithCoords.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] glass px-4 py-2 rounded-xl shadow-xl">
          <span className="text-sm font-bold text-gray-900">
            🗺️ {tripsWithCoords.length} trajet{tripsWithCoords.length > 1 ? 's' : ''} affiché{tripsWithCoords.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}
