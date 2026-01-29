'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-3xl">
      <div className="text-center">
        <div className="spinner mb-4"></div>
        <p className="text-gray-600 font-semibold">Chargement de la carte...</p>
      </div>
    </div>
  ),
})

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

interface TripWithCoords {
  trip: Trip
  fromCoords: CityCoords
  toCoords: CityCoords
  route: [number, number][]
}

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
      `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=France&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'DepanneMoi/1.0'
        }
      }
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
  const [tripsWithCoords, setTripsWithCoords] = useState<TripWithCoords[]>([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  useEffect(() => {
    if (trips.length > 0) {
      loadTripsWithCoords()
    } else {
      setLoading(false)
    }
  }, [trips])

  const loadTripsWithCoords = async () => {
    setLoading(true)
    setProgress({ current: 0, total: trips.length })
    const results: TripWithCoords[] = []

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

  if (loading && trips.length > 0) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="font-bold text-gray-900 text-lg mb-2">
            Chargement des trajets sur la carte...
          </p>
          <p className="text-gray-600">
            {progress.current}/{progress.total} trajets chargés
          </p>
        </div>
      </div>
    )
  }

  if (tripsWithCoords.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-3xl">
        <div className="text-center">
          <p className="text-6xl mb-4">🗺️</p>
          <p className="text-xl font-bold text-gray-900 mb-2">Aucun trajet à afficher</p>
          <p className="text-gray-600">Les trajets apparaîtront ici quand ils seront disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-[600px]">
      <MapInner
        tripsWithCoords={tripsWithCoords}
        onTripClick={onTripClick}
        selectedTripId={selectedTripId}
      />

      <div className="absolute bottom-4 left-4 z-[1000] glass px-4 py-2 rounded-xl shadow-xl">
        <span className="text-sm font-bold text-gray-900">
          🗺️ {tripsWithCoords.length} trajet{tripsWithCoords.length > 1 ? 's' : ''} affiché{tripsWithCoords.length > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
