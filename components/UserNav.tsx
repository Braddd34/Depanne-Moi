'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function UserNav() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Accueil', icon: '🏠' },
    { href: '/dashboard/explore', label: 'Trajets disponibles', icon: '🔍' },
    { href: '/dashboard/my-trips', label: 'Mes trajets', icon: '🚚' },
    { href: '/dashboard/my-bookings', label: 'Mes réservations', icon: '📋' },
    { href: '/dashboard/verification', label: 'Vérification', icon: '🔒' },
    { href: '/dashboard/profile', label: 'Profil', icon: '👤' },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">🚚 Depanne Moi</span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden md:block">
              {session?.user?.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Navigation mobile */}
        <div className="md:hidden flex overflow-x-auto pb-2 space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
                pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
