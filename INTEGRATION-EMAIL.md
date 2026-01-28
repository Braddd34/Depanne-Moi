# 📧 Intégration du système d'emails

## État actuel

Le système de notifications est **prêt** mais utilise actuellement des logs console.  
Les templates d'emails sont créés dans `lib/notifications.ts`.

## Pour activer les vrais emails

### Option 1 : Resend (Recommandé - Gratuit jusqu'à 3000 emails/mois)

1. **Créer un compte** : https://resend.com
2. **Obtenir une clé API**
3. **Installer le package** :
```bash
npm install resend
```

4. **Ajouter la clé dans Vercel** :
   - Variables d'environnement → `RESEND_API_KEY`

5. **Modifier `lib/notifications.ts`** :
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendNotification(data: NotificationData) {
  await resend.emails.send({
    from: 'Depanne Moi <noreply@depannemoi.fr>',
    to: data.to,
    subject: data.subject,
    html: data.message,
  })
  
  return { success: true }
}
```

6. **C'est tout !** Les emails seront envoyés automatiquement :
   - Lors d'une nouvelle réservation (au chauffeur)
   - Confirmation de réservation (au client)

### Option 2 : SendGrid

1. Compte : https://sendgrid.com (Gratuit jusqu'à 100 emails/jour)
2. Installer : `npm install @sendgrid/mail`
3. Même principe que Resend

### Option 3 : Nodemailer (Gmail, SMTP)

Pour utiliser votre propre serveur email.

## Quand activer ?

**Recommandation** : Activez les emails **avant** de lancer avec de vrais utilisateurs.

**Pourquoi ?** Sans emails, les chauffeurs ne sauront pas qu'ils ont reçu une réservation.

## Templates disponibles

1. ✅ Nouvelle réservation (pour le chauffeur)
2. ✅ Confirmation de réservation (pour le client)

**À ajouter plus tard :**
- Rappel de trajet (J-1)
- Annulation de trajet
- Modification de trajet

## Test

Pour tester sans envoyer de vrais emails, gardez le système actuel (logs console).  
Les logs apparaissent dans les logs Vercel.
