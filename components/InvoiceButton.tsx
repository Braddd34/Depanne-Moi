'use client'

import { useState } from 'react'

interface InvoiceButtonProps {
  type: 'trip' | 'booking'
  id: string
  label?: string
}

export default function InvoiceButton({ type, id, label = 'Télécharger facture' }: InvoiceButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/generate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id }),
      })

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `facture-${type}-${id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const error = await res.json()
        alert(error.error || 'Erreur lors de la génération de la facture')
      }
    } catch (error) {
      console.error('Invoice generation error:', error)
      alert('Erreur lors de la génération de la facture')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
    >
      {loading ? '🔄 Génération...' : `📄 ${label}`}
    </button>
  )
}
