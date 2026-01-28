'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n-context'

export default function LanguageSelector() {
  const { locale, setLocale, localeNames } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const flags: Record<string, string> = {
    fr: '🇫🇷',
    en: '🇬🇧',
    es: '🇪🇸',
    it: '🇮🇹',
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition"
      >
        <span className="text-xl">{flags[locale]}</span>
        <span className="font-semibold text-gray-700">{localeNames[locale]}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 glass rounded-2xl shadow-xl z-20 overflow-hidden">
            {(Object.keys(localeNames) as Array<keyof typeof localeNames>).map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  setLocale(loc)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition ${
                  loc === locale ? 'bg-purple-50' : ''
                }`}
              >
                <span className="text-xl">{flags[loc]}</span>
                <span className="font-semibold text-gray-900">{localeNames[loc]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
