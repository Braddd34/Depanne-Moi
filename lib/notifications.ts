// Système de notification simple pour MVP
// À remplacer par un service d'email (Resend, SendGrid, etc.) en production

interface NotificationData {
  to: string
  subject: string
  message: string
}

export async function sendNotification(data: NotificationData) {
  // Pour le MVP, on log seulement
  // En production, remplacer par un vrai service d'email
  console.log('📧 NOTIFICATION:', {
    to: data.to,
    subject: data.subject,
    message: data.message,
    sentAt: new Date().toISOString(),
  })

  // TODO: Intégrer Resend ou SendGrid
  // Exemple avec Resend:
  /*
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'Depanne Moi <noreply@depannemoi.fr>',
    to: data.to,
    subject: data.subject,
    html: data.message,
  })
  */

  return { success: true }
}

// Templates d'emails
export const emailTemplates = {
  newBooking: (tripDetails: any, bookerName: string) => ({
    subject: '🎉 Nouvelle réservation pour votre trajet !',
    message: `
      <h2>Nouvelle réservation !</h2>
      <p>Bonjour,</p>
      <p><strong>${bookerName}</strong> a réservé votre trajet :</p>
      <ul>
        <li><strong>Trajet :</strong> ${tripDetails.fromCity} → ${tripDetails.toCity}</li>
        <li><strong>Date :</strong> ${new Date(tripDetails.date).toLocaleDateString('fr-FR')}</li>
      </ul>
      <p>Connectez-vous à Depanne Moi pour voir les coordonnées du client.</p>
      <p>Bonne route ! 🚚</p>
    `,
  }),

  bookingConfirmation: (tripDetails: any, driverName: string) => ({
    subject: '✅ Confirmation de votre réservation',
    message: `
      <h2>Réservation confirmée !</h2>
      <p>Bonjour,</p>
      <p>Votre réservation a été confirmée :</p>
      <ul>
        <li><strong>Trajet :</strong> ${tripDetails.fromCity} → ${tripDetails.toCity}</li>
        <li><strong>Date :</strong> ${new Date(tripDetails.date).toLocaleDateString('fr-FR')}</li>
        <li><strong>Chauffeur :</strong> ${driverName}</li>
      </ul>
      <p>Vous pouvez maintenant contacter le chauffeur via l'application.</p>
      <p>Bonne route ! 🚚</p>
    `,
  }),
}
