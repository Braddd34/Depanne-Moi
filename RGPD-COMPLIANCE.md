# 🇪🇺 GUIDE DE CONFORMITÉ RGPD - DÉPANNE MOI

## ✅ CE QUI EST DÉJÀ FAIT

### 1. Base de données conforme
- ✅ Minimisation des données (seulement les données essentielles)
- ✅ Champs RGPD ajoutés (`emailConsent`, `acceptedTerms`, `acceptedTermsAt`)
- ✅ Chiffrement en transit (SSL/TLS)
- ✅ Hébergement sécurisé (Neon PostgreSQL)

### 2. Consentement utilisateur
- ✅ Checkbox obligatoire lors de l'inscription
- ✅ Acceptation explicite des CGU et Politique de Confidentialité
- ✅ Horodatage de l'acceptation (`acceptedTermsAt`)

### 3. Transparence
- ✅ Politique de Confidentialité complète (`/legal/privacy`)
- ✅ Conditions Générales d'Utilisation (`/legal/terms`)
- ✅ Footer avec liens légaux sur toutes les pages
- ✅ Emails avec mention RGPD et liens vers politique de confidentialité

### 4. Droits des utilisateurs
- ✅ Droit d'accès : profil consultable (`/dashboard/profile`)
- ✅ Droit de rectification : profil modifiable
- ✅ Droit à l'effacement : suppression de compte (à implémenter)

### 5. Sécurité (Article 32 RGPD)
- ✅ HTTPS obligatoire (Vercel)
- ✅ Mots de passe hashés (bcryptjs)
- ✅ Authentification sécurisée (NextAuth.js)
- ✅ Base de données chiffrée (Neon)

### 6. Emails transactionnels conformes
- ✅ Footer RGPD dans tous les emails
- ✅ Liens vers politique de confidentialité
- ✅ Lien vers gestion des préférences
- ✅ Mention explicite de la conformité RGPD

---

## ⚠️ ACTIONS OBLIGATOIRES À COMPLÉTER

### 🔴 CRITIQUE (à faire IMMÉDIATEMENT)

#### 1. Compléter les mentions légales
**Fichiers à modifier :**
- `/app/legal/privacy/page.tsx` (ligne 15-21)
- `/app/legal/terms/page.tsx` (ligne 187-192)

**Informations à ajouter :**
```
Nom de l'entreprise : [Votre raison sociale]
Adresse : [Votre adresse complète]
Email : contact@votre-entreprise.fr
Téléphone : [Votre numéro]
SIRET : [Si applicable]
```

#### 2. Configurer l'email de contact DPO
**Fichier :** `/app/legal/privacy/page.tsx` (ligne 172)

Si vous n'avez pas de DPO dédié (petite structure), indiquez votre email de contact principal.

#### 3. Configurer le domaine Resend
**Action requise :** Vérifier votre domaine sur Resend

Actuellement, les emails sont envoyés depuis `noreply@depannemoi.vercel.app`.

**Pour la production :**
1. Allez sur https://resend.com → Domains
2. Ajoutez votre propre domaine (ex: `depannemoi.com`)
3. Configurez les enregistrements DNS (SPF, DKIM, DMARC)
4. Modifiez `lib/notifications.ts` ligne 29 :
   ```typescript
   from: 'Depanne Moi <noreply@votre-domaine.com>',
   ```

---

### 🟡 IMPORTANT (à faire dans les 30 jours)

#### 1. Implémenter la suppression de compte
**Action :** Ajouter un bouton "Supprimer mon compte" dans `/app/dashboard/profile/page.tsx`

**Code à ajouter :**
```typescript
// API route: /app/api/user/delete/route.ts
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Supprimer toutes les données de l'utilisateur
  await prisma.user.delete({
    where: { id: session.user.id },
  })

  return NextResponse.json({ success: true })
}
```

#### 2. Ajouter un mécanisme d'export des données (portabilité)
**Article 20 RGPD :** Droit à la portabilité des données

**Action :** Créer un bouton "Télécharger mes données" qui génère un fichier JSON avec toutes les données de l'utilisateur.

#### 3. Logger les consentements
**Bonne pratique :** Créer une table `ConsentLog` pour tracer les modifications de consentement.

```prisma
model ConsentLog {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  consentType String  // "terms", "email", etc.
  accepted  Boolean
  createdAt DateTime @default(now())
}
```

---

### 🟢 RECOMMANDÉ (amélioration continue)

#### 1. Durée de conservation des données
**Action :** Créer un script cron pour supprimer automatiquement :
- Les trajets terminés après 3 ans
- Les comptes inactifs après 2 ans (avec email de notification 30 jours avant)

#### 2. Registre des traitements
**Obligation RGPD :** Tenir un registre des activités de traitement

**Document à créer :** `REGISTRE-TRAITEMENTS.md`

**Contenu minimal :**
- Finalités du traitement (mise en relation professionnels)
- Catégories de données (nom, email, téléphone, trajets)
- Destinataires (autres utilisateurs après réservation, sous-traitants)
- Transferts hors UE (Vercel, Neon, Resend - clauses contractuelles types)
- Durée de conservation (3 ans après fin de compte)
- Mesures de sécurité (HTTPS, bcrypt, accès restreints)

#### 3. Analyse d'impact (AIPD)
**Obligatoire si :** Traitement à grande échelle de données sensibles

Pour votre MVP, ce n'est **pas encore nécessaire**, mais à prévoir si :
- Plus de 10 000 utilisateurs actifs
- Ajout de géolocalisation en temps réel
- Traitement de données de santé, biométriques, etc.

---

## 📋 CHECKLIST DE LANCEMENT

Avant de lancer en production avec de vrais utilisateurs, vérifiez :

- [ ] Les mentions légales sont complètes (nom, adresse, contact)
- [ ] L'email de contact DPO est configuré
- [ ] Le domaine email est vérifié sur Resend
- [ ] La suppression de compte est implémentée
- [ ] Les CGU et Politique de Confidentialité sont accessibles
- [ ] Les emails contiennent le footer RGPD
- [ ] Le registre des traitements est créé
- [ ] Les clauses contractuelles avec les sous-traitants sont signées (Vercel, Neon, Resend)

---

## 🛡️ SOUS-TRAITANTS ET TRANSFERTS HORS UE

### Vercel (Hébergement)
- 🇺🇸 **Localisation :** USA
- ✅ **Conformité :** Clauses contractuelles types UE
- ✅ **Chiffrement :** HTTPS/TLS
- 📄 **DPA disponible :** https://vercel.com/legal/dpa

### Neon (Base de données)
- 🇺🇸 **Localisation :** USA (région eu-central-1 disponible)
- ✅ **Conformité :** Clauses contractuelles types UE
- ✅ **Chiffrement :** SSL/TLS + encryption at rest
- 📄 **DPA disponible :** https://neon.tech/dpa

### Resend (Emails)
- 🇺🇸 **Localisation :** USA
- ✅ **Conformité :** RGPD-ready
- ✅ **Chiffrement :** TLS
- 📄 **Privacy Policy :** https://resend.com/legal/privacy-policy

**ACTION REQUISE :**
Pour être 100% conforme, vous devez signer les **Data Processing Agreements (DPA)** avec chaque sous-traitant. Les liens sont fournis ci-dessus.

---

## 📞 EN CAS DE VIOLATION DE DONNÉES

**Obligation RGPD :** Notifier la CNIL sous **72 heures** en cas de violation de données personnelles.

**Procédure :**
1. Contenir la violation immédiatement
2. Évaluer l'impact sur les utilisateurs
3. Notifier la CNIL : https://www.cnil.fr/fr/notifier-une-violation-de-donnees-personnelles
4. Informer les utilisateurs concernés si le risque est élevé

---

## 📚 RESSOURCES UTILES

### CNIL (France)
- Site web : https://www.cnil.fr
- Guide RGPD développeurs : https://www.cnil.fr/fr/guide-rgpd-du-developpeur
- Modèles de documents : https://www.cnil.fr/fr/modeles

### Commission Européenne
- Texte RGPD complet : https://eur-lex.europa.eu/eli/reg/2016/679/oj
- Clauses contractuelles types : https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en

### EDPB (European Data Protection Board)
- Guidelines : https://edpb.europa.eu/our-work-tools/general-guidance/guidelines-recommendations-best-practices_en

---

## ✅ RÉSUMÉ : VOUS ÊTES CONFORME SI...

1. ✅ Les mentions légales sont complètes
2. ✅ Les CGU et Politique de Confidentialité sont accessibles
3. ✅ Le consentement est recueilli explicitement lors de l'inscription
4. ✅ Les utilisateurs peuvent consulter, modifier et supprimer leurs données
5. ✅ Les emails contiennent les mentions RGPD
6. ✅ Les DPA avec les sous-traitants sont signés
7. ✅ Un registre des traitements est tenu
8. ✅ Les données sont sécurisées (HTTPS, chiffrement, mots de passe hashés)

---

**Dernière mise à jour :** {new Date().toLocaleDateString('fr-FR')}

**Contact technique :** Voir `/legal/privacy` pour les coordonnées du responsable de traitement.
