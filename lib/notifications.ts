import { Resend } from 'resend'

// Initialiser Resend avec la clé API
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

interface NotificationData {
  to: string
  subject: string
  message: string
}

export async function sendNotification(data: NotificationData) {
  // Si Resend n'est pas configuré, logger seulement
  if (!resend) {
    console.log('⚠️  RESEND_API_KEY non configurée - Email non envoyé')
    console.log('📧 EMAIL (MODE TEST):', {
      to: data.to,
      subject: data.subject,
      sentAt: new Date().toISOString(),
    })
    return { success: true, mode: 'test' }
  }

  try {
    // Envoyer l'email via Resend
    const response = await resend.emails.send({
      from: 'Depanne Moi <noreply@depannemoi.vercel.app>',
      to: data.to,
      subject: data.subject,
      html: data.message,
    })

    console.log('✅ Email envoyé avec succès:', {
      to: data.to,
      subject: data.subject,
      messageId: response.data?.id,
    })

    return { success: true, mode: 'production', messageId: response.data?.id }
  } catch (error: any) {
    console.error('❌ Erreur envoi email:', error)
    
    // Ne pas bloquer l'application si l'email échoue
    return { success: false, error: error.message }
  }
}

// Templates d'emails avec HTML amélioré
export const emailTemplates = {
  newBooking: (tripDetails: any, bookerName: string, bookerPhone: string, bookerEmail: string) => ({
    subject: '🎉 Nouvelle réservation pour votre trajet !',
    message: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .trip-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
            .contact-info { background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Nouvelle réservation !</h1>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Excellente nouvelle ! <strong>${bookerName}</strong> vient de réserver votre trajet.</p>
              
              <div class="trip-info">
                <h3>📋 Détails du trajet</h3>
                <p><strong>🚩 Départ :</strong> ${tripDetails.fromCity}</p>
                <p><strong>🎯 Arrivée :</strong> ${tripDetails.toCity}</p>
                <p><strong>📅 Date :</strong> ${new Date(tripDetails.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</p>
                <p><strong>🚚 Véhicule :</strong> ${tripDetails.vehicleType}</p>
              </div>

              <div class="contact-info">
                <h3>📞 Coordonnées du client</h3>
                <p><strong>Nom :</strong> ${bookerName}</p>
                <p><strong>Email :</strong> <a href="mailto:${bookerEmail}">${bookerEmail}</a></p>
                <p><strong>Téléphone :</strong> <a href="tel:${bookerPhone}">${bookerPhone}</a></p>
              </div>

              <p>Vous pouvez maintenant contacter le client directement pour finaliser les détails.</p>

              <center>
                <a href="https://depannemoi.vercel.app/dashboard/my-trips" class="button">
                  Voir mes trajets
                </a>
              </center>

              <p>Bonne route ! 🚚</p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé par Depanne Moi</p>
              <p>Pour toute question, connectez-vous à votre compte</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  bookingConfirmation: (tripDetails: any, driverName: string, driverPhone: string, driverEmail: string) => ({
    subject: '✅ Confirmation de votre réservation',
    message: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .trip-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .contact-info { background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Réservation confirmée !</h1>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Votre réservation a été confirmée avec succès !</p>
              
              <div class="trip-info">
                <h3>📋 Détails du trajet</h3>
                <p><strong>🚩 Départ :</strong> ${tripDetails.fromCity}</p>
                <p><strong>🎯 Arrivée :</strong> ${tripDetails.toCity}</p>
                <p><strong>📅 Date :</strong> ${new Date(tripDetails.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</p>
                <p><strong>🚚 Véhicule :</strong> ${tripDetails.vehicleType}</p>
                ${tripDetails.price ? `<p><strong>💰 Prix :</strong> ${tripDetails.price}€</p>` : ''}
              </div>

              <div class="contact-info">
                <h3>👤 Coordonnées du chauffeur</h3>
                <p><strong>Nom :</strong> ${driverName}</p>
                <p><strong>Email :</strong> <a href="mailto:${driverEmail}">${driverEmail}</a></p>
                <p><strong>Téléphone :</strong> <a href="tel:${driverPhone}">${driverPhone}</a></p>
              </div>

              <p>Vous pouvez maintenant contacter le chauffeur pour finaliser les détails du transport.</p>

              <center>
                <a href="https://depannemoi.vercel.app/dashboard/my-bookings" class="button">
                  Voir mes réservations
                </a>
              </center>

              <p>Bon transport ! 🚚</p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé par Depanne Moi</p>
              <p>Pour toute question, connectez-vous à votre compte</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}
