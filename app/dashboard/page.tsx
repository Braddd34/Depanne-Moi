'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Trip {
  id: string
  fromCity: string
  toCity: string
  date: string
  vehicleType: string
  price?: number
  status: string
  driver: {
    name: string
    phone: string
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchTrips()
    }
  }, [session])

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips')
      const data = await res.json()
      setTrips(data.trips || [])
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return <div className="p-8">Chargement...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Depanne Moi</h1>
          <div className="flex gap-4">
            <Link
              href="/dashboard/trips/new"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Nouveau trajet
            </Link>
            <Link
              href="/api/auth/signout"
              className="text-gray-600 hover:text-gray-900"
            >
              Déconnexion
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Trajets disponibles</h2>

        {trips.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-4">Aucun trajet disponible pour le moment</p>
            <Link
              href="/dashboard/trips/new"
              className="text-blue-600 hover:underline"
            >
              Créer le premier trajet
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {trip.fromCity} → {trip.toCity}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Date: {new Date(trip.date).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-gray-600">
                      Type de véhicule: {trip.vehicleType}
                    </p>
                    {trip.price && (
                      <p className="text-gray-600">Prix: {trip.price}€</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Par: {trip.driver.name} - {trip.driver.phone}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/trips/${trip.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
