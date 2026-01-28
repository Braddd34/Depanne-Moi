import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface Trip {
  id: string
  fromCity: string
  toCity: string
  date: string
  vehicleType: string
  price: number | null
  status: string
  driver: {
    name: string
    company: string | null
    phone: string
  }
}

interface Booking {
  id: string
  status: string
  createdAt: string
  trip: Trip
}

export function generateTripInvoicePDF(trip: Trip, user: any) {
  const doc = new jsPDF()

  // En-tête
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('FACTURE', 105, 20, { align: 'center' })

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Depanne Moi - Plateforme de Transport', 105, 28, { align: 'center' })

  // Ligne de séparation
  doc.setDrawColor(100, 50, 200)
  doc.setLineWidth(1)
  doc.line(20, 35, 190, 35)

  // Informations facture
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Facture N°:', 20, 45)
  doc.setFont('helvetica', 'normal')
  doc.text(trip.id.substring(0, 12).toUpperCase(), 60, 45)

  doc.setFont('helvetica', 'bold')
  doc.text('Date:', 20, 52)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date().toLocaleDateString('fr-FR'), 60, 52)

  // Informations client
  doc.setFont('helvetica', 'bold')
  doc.text('FACTURÉ À:', 20, 65)
  doc.setFont('helvetica', 'normal')
  doc.text(user.name, 20, 72)
  if (user.company) {
    doc.text(user.company, 20, 79)
  }
  doc.text(user.email, 20, user.company ? 86 : 79)
  doc.text(user.phone, 20, user.company ? 93 : 86)

  // Informations prestataire
  doc.setFont('helvetica', 'bold')
  doc.text('PRESTATAIRE:', 120, 65)
  doc.setFont('helvetica', 'normal')
  doc.text(trip.driver.name, 120, 72)
  if (trip.driver.company) {
    doc.text(trip.driver.company, 120, 79)
  }
  doc.text(trip.driver.phone, 120, trip.driver.company ? 86 : 79)

  // Tableau détails du service
  ;(doc as any).autoTable({
    startY: 105,
    head: [['Description', 'Quantité', 'Prix unitaire', 'Total']],
    body: [
      [
        `Transport ${trip.fromCity} → ${trip.toCity}`,
        '1',
        `${(trip.price || 0).toFixed(2)} €`,
        `${(trip.price || 0).toFixed(2)} €`,
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [100, 50, 200],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
  })

  // Détails du trajet
  const detailsY = (doc as any).lastAutoTable.finalY + 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('DÉTAILS DU TRAJET:', 20, detailsY)
  doc.setFont('helvetica', 'normal')
  doc.text(`Départ: ${trip.fromCity}`, 20, detailsY + 7)
  doc.text(`Arrivée: ${trip.toCity}`, 20, detailsY + 14)
  doc.text(`Date: ${new Date(trip.date).toLocaleDateString('fr-FR')}`, 20, detailsY + 21)
  doc.text(`Véhicule: ${trip.vehicleType}`, 20, detailsY + 28)
  doc.text(`Statut: ${trip.status}`, 20, detailsY + 35)

  // Total
  const totalY = detailsY + 50

  doc.setFillColor(240, 240, 240)
  doc.rect(130, totalY - 5, 60, 20, 'F')

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL TTC:', 135, totalY + 5)
  doc.setFontSize(14)
  doc.text(`${(trip.price || 0).toFixed(2)} €`, 185, totalY + 5, { align: 'right' })

  // Pied de page
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(128, 128, 128)
  doc.text('Merci pour votre confiance !', 105, 270, { align: 'center' })
  doc.text('Depanne Moi - www.depannemoi.fr', 105, 275, { align: 'center' })
  doc.text('TVA non applicable, art. 293 B du CGI', 105, 280, { align: 'center' })

  return doc
}

export function generateBookingInvoicePDF(booking: Booking, user: any) {
  const doc = new jsPDF()

  // En-tête
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('FACTURE', 105, 20, { align: 'center' })

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Depanne Moi - Plateforme de Transport', 105, 28, { align: 'center' })

  // Ligne de séparation
  doc.setDrawColor(100, 50, 200)
  doc.setLineWidth(1)
  doc.line(20, 35, 190, 35)

  // Informations facture
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Facture N°:', 20, 45)
  doc.setFont('helvetica', 'normal')
  doc.text(booking.id.substring(0, 12).toUpperCase(), 60, 45)

  doc.setFont('helvetica', 'bold')
  doc.text('Date:', 20, 52)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date().toLocaleDateString('fr-FR'), 60, 52)

  doc.setFont('helvetica', 'bold')
  doc.text('Date réservation:', 20, 59)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date(booking.createdAt).toLocaleDateString('fr-FR'), 60, 59)

  // Informations client
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENT:', 20, 72)
  doc.setFont('helvetica', 'normal')
  doc.text(user.name, 20, 79)
  if (user.company) {
    doc.text(user.company, 20, 86)
  }
  doc.text(user.email, 20, user.company ? 93 : 86)
  doc.text(user.phone, 20, user.company ? 100 : 93)

  // Informations prestataire
  doc.setFont('helvetica', 'bold')
  doc.text('TRANSPORTEUR:', 120, 72)
  doc.setFont('helvetica', 'normal')
  doc.text(booking.trip.driver.name, 120, 79)
  if (booking.trip.driver.company) {
    doc.text(booking.trip.driver.company, 120, 86)
  }
  doc.text(booking.trip.driver.phone, 120, booking.trip.driver.company ? 93 : 86)

  // Tableau détails
  ;(doc as any).autoTable({
    startY: 115,
    head: [['Description', 'Quantité', 'Prix unitaire', 'Total']],
    body: [
      [
        `Réservation ${booking.trip.fromCity} → ${booking.trip.toCity}`,
        '1',
        `${(booking.trip.price || 0).toFixed(2)} €`,
        `${(booking.trip.price || 0).toFixed(2)} €`,
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [100, 50, 200],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
  })

  // Détails
  const detailsY = (doc as any).lastAutoTable.finalY + 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('DÉTAILS DE LA RÉSERVATION:', 20, detailsY)
  doc.setFont('helvetica', 'normal')
  doc.text(`Départ: ${booking.trip.fromCity}`, 20, detailsY + 7)
  doc.text(`Arrivée: ${booking.trip.toCity}`, 20, detailsY + 14)
  doc.text(`Date trajet: ${new Date(booking.trip.date).toLocaleDateString('fr-FR')}`, 20, detailsY + 21)
  doc.text(`Véhicule: ${booking.trip.vehicleType}`, 20, detailsY + 28)
  doc.text(`Statut réservation: ${booking.status}`, 20, detailsY + 35)

  // Total
  const totalY = detailsY + 50

  doc.setFillColor(240, 240, 240)
  doc.rect(130, totalY - 5, 60, 20, 'F')

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL TTC:', 135, totalY + 5)
  doc.setFontSize(14)
  doc.text(`${(booking.trip.price || 0).toFixed(2)} €`, 185, totalY + 5, { align: 'right' })

  // Pied de page
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(128, 128, 128)
  doc.text('Merci pour votre confiance !', 105, 270, { align: 'center' })
  doc.text('Depanne Moi - www.depannemoi.fr', 105, 275, { align: 'center' })
  doc.text('TVA non applicable, art. 293 B du CGI', 105, 280, { align: 'center' })

  return doc
}
