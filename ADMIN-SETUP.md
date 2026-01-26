# Configuration de l'espace administrateur

## Création du premier compte administrateur

### Option 1 : Via Prisma Studio (Recommandé pour le MVP)

1. Lancez Prisma Studio :
```bash
npm run db:studio
```

2. Ouvrez le navigateur à `http://localhost:5555`

3. Créez un nouvel utilisateur avec les informations suivantes :
   - **email** : votre email admin
   - **password** : hash bcrypt de votre mot de passe (voir ci-dessous)
   - **name** : votre nom
   - **phone** : votre téléphone
   - **role** : **ADMIN** (important !)
   - **company** : (optionnel)
   - **vehicleType** : (optionnel)

4. Pour générer le hash bcrypt de votre mot de passe, utilisez Node.js :
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('VOTRE_MOT_DE_PASSE', 10));"
```

### Option 2 : Via SQL direct dans Neon

1. Connectez-vous à votre console Neon PostgreSQL

2. Exécutez la requête SQL suivante (remplacez les valeurs) :
```sql
INSERT INTO users (id, email, password, name, phone, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@depanne-moi.fr',
  '$2a$10$VOTRE_HASH_BCRYPT_ICI',
  'Administrateur',
  '+33612345678',
  'ADMIN',
  NOW(),
  NOW()
);
```

### Option 3 : Via script de seed Prisma (À développer)

Créez un fichier `prisma/seed-admin.ts` :
```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('votre-mot-de-passe-admin', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@depanne-moi.fr' },
    update: {},
    create: {
      email: 'admin@depanne-moi.fr',
      password: hashedPassword,
      name: 'Administrateur',
      phone: '+33612345678',
      role: 'ADMIN',
    },
  })
  
  console.log('Admin créé:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Puis exécutez :
```bash
npx tsx prisma/seed-admin.ts
```

## Accès à l'espace admin

1. Connectez-vous sur : `https://votre-domaine.vercel.app/auth/login`
2. Utilisez vos identifiants admin
3. Accédez à l'administration : `https://votre-domaine.vercel.app/admin`

## Fonctionnalités de l'espace admin

- **Vue d'ensemble** : Liste de tous les clients inscrits
- **Détails client** : Coordonnées complètes, trajets créés, réservations effectuées
- **Statistiques** : Nombre de trajets et réservations par client
- **Filtrage** : (À développer) Par date, statut, etc.

## Sécurité

- ✅ Routes API protégées (vérification du rôle ADMIN)
- ✅ Pages protégées (redirection si non-admin)
- ✅ Mots de passe hashés avec bcrypt
- ✅ Sessions JWT via NextAuth

## Notes importantes

- **Ne partagez jamais vos identifiants admin**
- **Changez le mot de passe par défaut immédiatement**
- **Utilisez un mot de passe fort (12+ caractères, majuscules, chiffres, symboles)**
- **Activez l'authentification à deux facteurs si disponible (future feature)**
