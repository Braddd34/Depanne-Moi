'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n-context'
import { locales, localeNames, type Locale } from '@/i18n.config'

export default function LanguageSelector() {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const flags: Record<Locale, string> = {
    fr: '🇫🇷',
    en: '🇬🇧',
    es: '🇪🇸',
    it: '🇮🇹',
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white transition text-gray-700 font-semibold border-2 border-gray-200"
      >
        <span className="text-xl">{flags[locale]}</span>
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  setLocale(loc)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition ${
                  locale === loc ? 'bg-purple-100' : ''
                }`}
              >
                <span className="text-2xl">{flags[loc]}</span>
                <span className="font-semibold text-gray-700">
                  {localeNames[loc]}
                </span>
                {locale === loc && <span className="ml-auto text-purple-600">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
