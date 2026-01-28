'use client'

import { useState } from 'react'

interface InvoiceButtonProps {
  type: 'trip' | 'booking'
  id: string
  label?: string
}

export default function InvoiceButton({ type, id, label = 'Télécharger facture' }: InvoiceButtonProps) {
  const [loading, setLoading] = useState(false)

  const downloadInvoice = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/generate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id }),
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la génération')
      }

      // Télécharger le PDF
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `facture-${type}-${id.substring(0, 8)}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading invoice:', error)
      alert('Erreur lors du téléchargement de la facture')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={downloadInvoice}
      disabled={loading}
      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    >
      {loading ? '📥 Génération...' : `📄 ${label}`}
    </button>
  )
}
