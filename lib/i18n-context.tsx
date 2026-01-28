'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Locale } from '../i18n.config'
import { defaultLocale } from '../i18n.config'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  currency: string
  currencySymbol: string
  localeNames: Record<string, string>
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const messages: Record<Locale, any> = {
  fr: require('../messages/fr.json'),
  en: require('../messages/en.json'),
  es: require('../messages/es.json'),
  it: require('../messages/it.json'),
}

const currencyMap: Record<Locale, { symbol: string; code: string }> = {
  fr: { symbol: '€', code: 'EUR' },
  en: { symbol: '£', code: 'GBP' },
  es: { symbol: '€', code: 'EUR' },
  it: { symbol: '€', code: 'EUR' },
}

const localeNames: Record<string, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  it: 'Italiano',
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [translations, setTranslations] = useState(messages[defaultLocale])

  useEffect(() => {
    // Charger la langue depuis localStorage
    const savedLocale = localStorage.getItem('locale') as Locale | null
    if (savedLocale && messages[savedLocale]) {
      setLocaleState(savedLocale)
      setTranslations(messages[savedLocale])
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    setTranslations(messages[newLocale])
    localStorage.setItem('locale', newLocale)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Retourner la clé si la traduction n'existe pas
      }
    }

    return typeof value === 'string' ? value : key
  }

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    currency: currencyMap[locale].code,
    currencySymbol: currencyMap[locale].symbol,
    localeNames,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}

// Hook pour formatter les prix avec la devise
export function useFormatPrice() {
  const { currencySymbol, locale } = useI18n()

  return (price: number) => {
    return `${price.toFixed(2)} ${currencySymbol}`
  }
}

// Hook pour formatter les dates selon la locale
export function useFormatDate() {
  const { locale } = useI18n()

  return (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
}
