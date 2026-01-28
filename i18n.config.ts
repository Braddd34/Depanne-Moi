export const locales = ['fr', 'en', 'es', 'it'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'fr'

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  it: 'Italiano',
}

export const currencySymbols: Record<Locale, string> = {
  fr: '€',
  en: '£',
  es: '€',
  it: '€',
}

export const currencies: Record<Locale, string> = {
  fr: 'EUR',
  en: 'GBP',
  es: 'EUR',
  it: 'EUR',
}
