'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function AdminNav() {
  return (
    <nav className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl border-b-4 border-red-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-10 h-10 bg-white text-red-600 rounded-xl flex items-center justify-center font-bold text-xl">
                🛡️
              </div>
              <span className="text-2xl font-bold">Admin Panel</span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/admin"
                className="px-4 py-2 hover:bg-red-700 rounded-xl transition font-semibold"
              >
                📊 Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="px-4 py-2 hover:bg-red-700 rounded-xl transition font-semibold"
              >
                👥 Utilisateurs
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition font-semibold"
              >
                👤 Mon Dashboard
              </Link>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-6 py-2 bg-red-800 hover:bg-red-900 rounded-xl font-bold transition shadow-lg"
          >
            🚪 Déconnexion
          </button>
        </div>
      </div>
    </nav>
  )
}
