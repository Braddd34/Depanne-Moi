# Scripts d'administration

## Créer un compte administrateur

### Utilisation

```bash
npm run create-admin
```

Ce script va :
- ✅ Créer un compte admin avec l'email `m.elfakir@outlook.fr`
- ✅ Hasher automatiquement le mot de passe de manière sécurisée
- ✅ Assigner le rôle ADMIN
- ✅ Si le compte existe déjà, il sera mis à jour avec le rôle ADMIN

### Pré-requis

1. **Avoir configuré DATABASE_URL** dans votre `.env` :
   ```
   DATABASE_URL="votre-url-neon-postgresql"
   ```

2. **Avoir appliqué les migrations** :
   ```bash
   npm run db:migrate
   ```

### Après la création

Vous pouvez vous connecter avec :
- **Email** : `m.elfakir@outlook.fr`
- **Mot de passe** : `Admin145896`

**⚠️ IMPORTANT : Changez ce mot de passe après votre première connexion !**

### URLs d'accès

- **Connexion** : `https://votre-url-vercel.app/auth/login`
- **Dashboard admin** : `https://votre-url-vercel.app/admin`

## Personnaliser le script

Si vous voulez créer un autre admin, modifiez le fichier `scripts/create-admin.ts` :

```typescript
const email = 'autre-email@exemple.com'
const password = 'AutreMotDePasse123'
const name = 'Autre Nom'
const phone = '+33612345678'
```
