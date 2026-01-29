'use client'

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'

// Fix pour les icônes Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = icon

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

interface TripWithCoords {
  trip: Trip
  fromCoords: { lat: number; lon: number }
  toCoords: { lat: number; lon: number }
  route: [number, number][]
}

interface MapInnerProps {
  tripsWithCoords: TripWithCoords[]
  onTripClick?: (trip: Trip) => void
  selectedTripId?: string
}

const FRANCE_CENTER: [number, number] = [46.603354, 1.888334]

export default function MapInner({ tripsWithCoords, onTripClick, selectedTripId }: MapInnerProps) {
  useEffect(() => {
    // Force le rafraîchissement de la carte après montage
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 100)
  }, [])

  return (
    <MapContainer
      center={FRANCE_CENTER}
      zoom={6}
      style={{ height: '100%', width: '100%', minHeight: '600px' }}
      className="rounded-3xl z-0"
      scrollWheelZoom={true}
    >
      {/* Tuiles OpenFreeMap via LFMaps */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        subdomains={['a', 'b', 'c']}
        maxZoom={19}
      />

      {tripsWithCoords.map(({ trip, fromCoords, toCoords, route }) => {
        const isSelected = trip.id === selectedTripId

        return (
          <>
            {/* Itinéraire */}
            <Polyline
              key={`route-${trip.id}`}
              positions={route}
              pathOptions={{
                color: isSelected ? '#9333ea' : '#3b82f6',
                weight: isSelected ? 4 : 3,
                opacity: isSelected ? 0.8 : 0.6,
              }}
            />

            {/* Marker départ */}
            <Marker
              key={`from-${trip.id}`}
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

            {/* Marker arrivée */}
            <Marker
              key={`to-${trip.id}`}
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
          </>
        )
      })}
    </MapContainer>
  )
}
