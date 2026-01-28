'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminNav() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: 'Utilisateurs', icon: '👥' },
    { href: '/dashboard', label: 'Dashboard utilisateur', icon: '🏠' },
  ]

  return (
    <nav className="bg-gradient-to-r from-red-600 to-red-700 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Admin */}
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">
              🔐 Admin - Depanne Moi
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-white text-red-600'
                    : 'text-white hover:bg-red-800'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* User menu + Déconnexion */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-white">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-800 text-xs font-bold">
                ADMIN
              </span>
              <span className="text-sm">
                {session?.user?.name}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 text-sm font-bold text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🚪</span>
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
                  ? 'bg-white text-red-600'
                  : 'bg-red-800 text-white'
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
