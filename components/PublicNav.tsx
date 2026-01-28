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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">🚚 Depanne Moi</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Connexion
            </Link>
            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Inscription gratuite
            </Link>
          </div>
        </div>

        {/* Navigation mobile */}
        <div className="md:hidden flex overflow-x-auto pb-2 space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-shrink-0 text-sm font-medium whitespace-nowrap ${
                pathname === link.href
                  ? 'text-blue-600'
                  : 'text-gray-700'
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
