'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function PublicNav() {
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/about', label: 'À propos' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="glass sticky top-0 z-50 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-3xl transform group-hover:scale-110 transition-transform">🚚</span>
            <span className="text-2xl font-bold text-gradient">Depanne Moi</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all relative ${
                  pathname === link.href
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="hidden sm:block text-sm font-medium text-gray-700 hover:text-purple-600 transition"
            >
              Connexion
            </Link>
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              Inscription gratuite
            </Link>
          </div>
        </div>

        {/* Navigation mobile */}
        <div className="md:hidden flex overflow-x-auto pb-3 space-x-6 scrollbar-hide">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-shrink-0 text-sm font-medium whitespace-nowrap pb-2 border-b-2 transition-colors ${
                pathname === link.href
                  ? 'text-purple-600 border-purple-600'
                  : 'text-gray-700 border-transparent'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
