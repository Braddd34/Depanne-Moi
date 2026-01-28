'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserNav from '@/components/UserNav'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DailyStat {
  date: string
  trips: number
  bookings: number
  revenue: number
}

interface StatusStat {
  status: string
  count: number
}

interface AnalyticsData {
  summary: {
    totalTrips: number
    totalBookings: number
    completedTrips: number
    totalRevenue: number
    tripsThisPeriod: number
    bookingsThisPeriod: number
  }
  dailyStats: DailyStat[]
  tripsByStatus: StatusStat[]
  bookingsByStatus: StatusStat[]
}

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: '#3b82f6',
  RESERVED: '#f59e0b',
  COMPLETED: '#10b981',
  CANCELLED: '#ef4444',
  PENDING: '#8b5cf6',
  CONFIRMED: '#10b981',
}

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponible',
  RESERVED: 'Réservé',
  COMPLETED: 'Complété',
  CANCELLED: 'Annulé',
  PENDING: 'En attente',
  CONFIRMED: 'Confirmé',
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState('30') // 7, 30, 90, 365
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchAnalytics()
    }
  }, [session, period])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics/stats?period=${period}`)
      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!data) return

    setExporting(true)
    try {
      // Créer le CSV
      const headers = ['Date', 'Trajets', 'Réservations', 'Revenus (€)']
      const rows = data.dailyStats.map((stat) => [
        stat.date,
        stat.trips,
        stat.bookings,
        stat.revenue.toFixed(2),
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
        '',
        'RÉSUMÉ',
        `Total trajets,${data.summary.totalTrips}`,
        `Trajets complétés,${data.summary.completedTrips}`,
        `Total réservations,${data.summary.totalBookings}`,
        `Revenus totaux,${data.summary.totalRevenue.toFixed(2)} €`,
      ].join('\n')

      // Télécharger
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `depanne-moi-analytics-${period}j-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
    } catch (error) {
      console.error('Export error:', error)
      alert('Erreur lors de l\'export')
    } finally {
      setExporting(false)
    }
  }

  const printReport = () => {
    window.print()
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <UserNav />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-600 text-lg">Chargement des statistiques...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <UserNav />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-gray-600 text-lg">Erreur lors du chargement des données</p>
          </div>
        </div>
      </div>
    )
  }

  const { summary, dailyStats, tripsByStatus, bookingsByStatus } = data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            <span className="text-gradient">Analytics</span> & Stats 📊
          </h1>
          <p className="text-gray-500 text-lg">
            Suivez vos performances et votre activité
          </p>
        </div>

        {/* Filtres période & Export */}
        <div className="glass rounded-2xl p-4 mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-gray-700">📅 Période :</span>
            {['7', '30', '90', '365'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  period === p
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {p === '7'
                  ? '7 jours'
                  : p === '30'
                  ? '30 jours'
                  : p === '90'
                  ? '3 mois'
                  : '1 an'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              disabled={exporting}
              className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {exporting ? '📥 Export...' : '📥 Export CSV'}
            </button>
            <button
              onClick={printReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              🖨️ Imprimer
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl">
                🚚
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {summary.totalTrips}
            </div>
            <div className="text-sm text-gray-600">Trajets créés</div>
            <div className="text-xs text-purple-600 font-semibold mt-2">
              +{summary.tripsThisPeriod} cette période
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl">
                ✅
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {summary.completedTrips}
            </div>
            <div className="text-sm text-gray-600">Trajets complétés</div>
            <div className="text-xs text-green-600 font-semibold mt-2">
              Taux: {summary.totalTrips > 0 ? Math.round((summary.completedTrips / summary.totalTrips) * 100) : 0}%
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                💰
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {summary.totalRevenue.toFixed(2)} €
            </div>
            <div className="text-sm text-gray-600">Revenus totaux</div>
            <div className="text-xs text-purple-600 font-semibold mt-2">
              Trajets complétés
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-2xl">
                📋
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {summary.totalBookings}
            </div>
            <div className="text-sm text-gray-600">Réservations faites</div>
            <div className="text-xs text-orange-600 font-semibold mt-2">
              +{summary.bookingsThisPeriod} cette période
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center text-2xl">
                📈
              </div>
              <span className="text-sm text-gray-500">Moyenne</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {summary.totalTrips > 0 ? (summary.totalRevenue / summary.totalTrips).toFixed(2) : '0.00'} €
            </div>
            <div className="text-sm text-gray-600">Prix moyen / trajet</div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center text-2xl">
                🎯
              </div>
              <span className="text-sm text-gray-500">Performance</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {summary.tripsThisPeriod + summary.bookingsThisPeriod}
            </div>
            <div className="text-sm text-gray-600">Activités totales</div>
            <div className="text-xs text-cyan-600 font-semibold mt-2">
              Cette période
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Graphique d'évolution */}
          <div className="glass rounded-3xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📈</span> Évolution de l'activité
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getDate()}/${date.getMonth() + 1}`
                  }}
                />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="trips"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  name="Trajets"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Réservations"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique de revenus */}
          <div className="glass rounded-3xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>💰</span> Revenus par jour
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getDate()}/${date.getMonth() + 1}`
                  }}
                />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number) => `${value.toFixed(2)} €`}
                />
                <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} name="Revenus" />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition des trajets par statut */}
          {tripsByStatus.length > 0 && (
            <div className="glass rounded-3xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🚚</span> Trajets par statut
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tripsByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${STATUS_LABELS[entry.status]} (${entry.count})`}
                  >
                    {tripsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number, name: string) => [value, STATUS_LABELS[name]]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Répartition des réservations par statut */}
          {bookingsByStatus.length > 0 && (
            <div className="glass rounded-3xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📋</span> Réservations par statut
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bookingsByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${STATUS_LABELS[entry.status]} (${entry.count})`}
                  >
                    {bookingsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number, name: string) => [value, STATUS_LABELS[name]]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Message info */}
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-gray-600">
            💡 <strong>Astuce :</strong> Les statistiques sont calculées en temps réel à partir de vos données.
            Changez la période pour voir l'évolution sur différentes durées.
          </p>
        </div>
      </div>
    </div>
  )
}
