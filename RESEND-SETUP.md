# 📧 GUIDE DE CONFIGURATION RESEND (EMAILS)

## 🎯 Objectif

Activer l'envoi d'emails transactionnels (notifications de réservation) conformes au RGPD pour votre application Depanne Moi.

---

## 📋 ÉTAPE 1 : Créer un compte Resend (2 minutes)

### 1.1. Inscription
1. Allez sur **https://resend.com**
2. Cliquez sur **"Sign Up"** (ou "Get Started")
3. Créez un compte avec votre email professionnel
4. Vérifiez votre email (cliquez sur le lien de confirmation)

### 1.2. Plan gratuit
✅ **3 000 emails/mois gratuits** (largement suffisant pour un MVP)

---

## 🔑 ÉTAPE 2 : Obtenir votre clé API (1 minute)

### 2.1. Créer une clé API
1. Connectez-vous à https://resend.com
2. Dans le menu de gauche, cliquez sur **"API Keys"**
3. Cliquez sur **"Create API Key"**
4. Donnez un nom : **`Depanne Moi Production`**
5. Sélectionnez les permissions :
   - ✅ **Sending access** (requis)
   - ⛔ Full access (pas nécessaire)
6. Cliquez sur **"Add"**

### 2.2. Copier la clé
⚠️ **IMPORTANT :** La clé ne s'affichera qu'une seule fois !

Elle ressemble à ceci :
```
re_123456789abcdefghijklmnopqrstuvwxyz
```

**Copiez-la immédiatement** dans un endroit sûr (gestionnaire de mots de passe).

---

## ⚙️ ÉTAPE 3 : Ajouter la clé dans Vercel (2 minutes)

### 3.1. Ouvrir les paramètres Vercel
1. Allez sur **https://vercel.com**
2. Sélectionnez votre projet **"Depanne-Moi"** (ou "depannemoi")
3. Cliquez sur **"Settings"** (en haut)
4. Dans le menu de gauche, cliquez sur **"Environment Variables"**

### 3.2. Ajouter la variable
1. Cliquez sur **"Add New"** (bouton en haut à droite)
2. Remplissez :
   - **Key (Name)** : `RESEND_API_KEY`
   - **Value** : `re_votre_cle_copiee` (la clé de l'étape 2)
   - **Environment** : Cochez **TOUTES** les cases :
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Cliquez sur **"Save"**

✅ Vous devriez voir :
```
RESEND_API_KEY     re_•••••••••••••••     Production, Preview, Development
```

---

## 🚀 ÉTAPE 4 : Redéployer l'application (1 minute)

### 4.1. Redéploiement
1. Toujours dans Vercel, cliquez sur **"Deployments"** (menu du haut)
2. Trouvez le dernier déploiement (celui tout en haut)
3. Cliquez sur les **3 points** à droite (`...`)
4. Sélectionnez **"Redeploy"**
5. Confirmez en cliquant sur **"Redeploy"** dans la popup

### 4.2. Attendre le déploiement
⏳ Le déploiement prend environ **30 secondes à 1 minute**.

✅ Quand c'est terminé, vous verrez **"Ready"** en vert.

---

## 🧪 ÉTAPE 5 : Tester l'envoi d'emails (3 minutes)

### Test complet avec 2 comptes

#### 5.1. Créer le premier compte (chauffeur)
1. Allez sur **https://depannemoi.vercel.app**
2. Cliquez sur **"Rejoindre la plateforme"**
3. Inscrivez-vous avec :
   - Email : **votre-email-1@exemple.com** (votre vrai email)
   - Nom, téléphone, mot de passe

#### 5.2. Publier un trajet
1. Connectez-vous avec le compte 1
2. Allez dans **"Publier un trajet"**
3. Créez un trajet :
   - Départ : Paris
   - Arrivée : Lyon
   - Date : demain
   - Véhicule : Camion
   - Prix : 150€

#### 5.3. Créer le second compte (client)
1. **Déconnectez-vous** (en haut à droite)
2. Créez un **nouveau compte** avec :
   - Email : **votre-email-2@exemple.com** (un autre vrai email)
   - Nom différent

#### 5.4. Réserver le trajet
1. Connectez-vous avec le compte 2
2. Allez dans **"Trajets disponibles"**
3. Trouvez le trajet Paris → Lyon
4. Cliquez dessus
5. Cliquez sur **"Réserver ce trajet"**

### 5.5. Vérifier la réception des emails

📧 **Vous devriez recevoir 2 emails :**

1. **Email 1** (sur votre-email-1@exemple.com) :
   - **Sujet :** 🎉 Nouvelle réservation pour votre trajet !
   - **Contenu :** Coordonnées du client, détails du trajet, footer RGPD

2. **Email 2** (sur votre-email-2@exemple.com) :
   - **Sujet :** ✅ Confirmation de votre réservation
   - **Contenu :** Coordonnées du chauffeur, détails du trajet, footer RGPD

✅ **Si vous recevez les 2 emails : BRAVO, c'est configuré !** 🎉

---

## ❌ TROUBLESHOOTING : Si les emails n'arrivent pas

### Problème 1 : "Email non reçu"
**Solutions :**
1. ✅ Vérifiez vos **spams/courrier indésirable**
2. ✅ Attendez 2-3 minutes (parfois un délai)
3. ✅ Vérifiez que `RESEND_API_KEY` est bien dans Vercel
4. ✅ Assurez-vous d'avoir **redéployé** après avoir ajouté la clé

### Problème 2 : "Emails dans les spams"
**Normal au début.** Pour améliorer la délivrabilité :

1. **Configurer un domaine personnalisé** (voir Étape 6 ci-dessous)
2. **Configurer SPF, DKIM, DMARC** (voir Étape 6)

### Problème 3 : Erreur "Invalid API key"
**Solution :**
1. Allez sur https://resend.com → API Keys
2. Vérifiez que la clé existe et est active
3. Re-copiez la clé et remplacez dans Vercel
4. Redéployez

### Problème 4 : Vérifier les logs
1. Allez sur **Vercel** → votre projet
2. Cliquez sur **"Functions"** (menu du haut)
3. Cliquez sur l'exécution récente de `/api/bookings`
4. Regardez les logs :
   - ✅ Si vous voyez `✅ Email envoyé avec succès` → OK
   - ❌ Si vous voyez `❌ Erreur envoi email` → Problème avec Resend

---

## 🌐 ÉTAPE 6 : [OPTIONNEL] Configurer un domaine personnalisé

**Pourquoi ?**
- ✅ Meilleure délivrabilité (moins de spams)
- ✅ Emails provenant de `noreply@depannemoi.com` au lieu de `noreply@depannemoi.vercel.app`
- ✅ Plus professionnel

### 6.1. Acheter un domaine
Si vous n'en avez pas, achetez un domaine :
- **OVH** : https://www.ovhcloud.com (environ 5-10€/an)
- **Gandi** : https://www.gandi.net
- **Namecheap** : https://www.namecheap.com

Exemple : `depannemoi.com`

### 6.2. Ajouter le domaine sur Resend
1. Allez sur https://resend.com
2. Cliquez sur **"Domains"** (menu de gauche)
3. Cliquez sur **"Add Domain"**
4. Entrez votre domaine : `depannemoi.com`
5. Cliquez sur **"Add"**

### 6.3. Configurer les enregistrements DNS
Resend va vous donner 3 enregistrements DNS à ajouter :

| Type  | Nom/Host                    | Valeur                           |
|-------|-----------------------------|----------------------------------|
| TXT   | `@` ou `depannemoi.com`     | `v=spf1 include:resend.com ~all` |
| CNAME | `resend._domainkey`         | `resend.domainkey.com`           |
| TXT   | `_dmarc`                    | `v=DMARC1; p=none; ...`          |

**Comment les ajouter ?**
1. Allez chez votre registrar (OVH, Gandi, etc.)
2. Trouvez la section **"DNS Zone"** ou **"Manage DNS"**
3. Ajoutez les 3 enregistrements fournis par Resend
4. Sauvegardez

⏳ **Propagation DNS :** 10 minutes à 24 heures (généralement 30 min)

### 6.4. Vérifier le domaine
1. Retournez sur Resend → Domains
2. Cliquez sur **"Verify"**
3. Si tout est bon : ✅ **Verified**

### 6.5. Modifier le code
**Fichier :** `lib/notifications.ts` (ligne 29)

```typescript
// AVANT
from: 'Depanne Moi <noreply@depannemoi.vercel.app>',

// APRÈS
from: 'Depanne Moi <noreply@depannemoi.com>',
```

**Puis :**
1. Commit et push sur GitHub
2. Vercel redéploiera automatiquement

---

## 📊 ÉTAPE 7 : Surveiller les emails envoyés

### 7.1. Dashboard Resend
1. Allez sur https://resend.com
2. Cliquez sur **"Emails"** (menu de gauche)
3. Vous verrez tous les emails envoyés :
   - ✅ **Delivered** : Email bien reçu
   - ⏳ **Sent** : En cours
   - ❌ **Bounced** : Email invalide ou rejeté

### 7.2. Statistiques
- **Delivery rate** : % d'emails livrés
- **Open rate** : % d'emails ouverts (si activé)

**Objectif :** Delivery rate > 95%

---

## 🇪🇺 CONFORMITÉ RGPD

### Emails transactionnels = OK
✅ Les emails de confirmation de réservation sont **transactionnels**, donc **autorisés par défaut** sans consentement marketing.

### Footer RGPD
✅ Tous vos emails contiennent déjà :
- Lien vers Politique de Confidentialité
- Lien vers CGU
- Lien de gestion des préférences
- Mention de conformité RGPD

### Sous-traitant Resend
✅ Resend est conforme RGPD.

**Action recommandée :**
Signer le **DPA (Data Processing Agreement)** avec Resend :
- https://resend.com/legal/dpa

---

## 📋 CHECKLIST FINALE

Avant de considérer la configuration terminée :

- [ ] Compte Resend créé
- [ ] Clé API générée et copiée
- [ ] `RESEND_API_KEY` ajoutée dans Vercel
- [ ] Application redéployée sur Vercel
- [ ] Test avec 2 comptes effectué
- [ ] 2 emails reçus (chauffeur + client)
- [ ] Emails pas dans les spams (ou domaine configuré)
- [ ] [Optionnel] Domaine personnalisé configuré
- [ ] [Optionnel] DPA Resend signé

---

## 🎉 FÉLICITATIONS !

Vos emails sont maintenant actifs et conformes RGPD ! 🇪🇺

**Prochaines étapes :**
1. Testez avec de vrais utilisateurs
2. Surveillez la délivrabilité sur Resend
3. Si nécessaire, configurez un domaine personnalisé

---

**Questions ?** Consultez :
- Documentation Resend : https://resend.com/docs
- Guide RGPD : `RGPD-COMPLIANCE.md`
