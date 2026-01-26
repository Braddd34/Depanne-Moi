# 🚚 Depanne Moi - Web (Next.js)

Application web et API backend pour la mise en relation de chauffeurs professionnels.

## 🚀 Démarrage

### Prérequis
- Node.js 18+
- Compte Neon PostgreSQL

### Installation

```bash
# Installer les dépendances
npm install
# ou
pnpm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos credentials

# Générer le client Prisma
npm run db:generate

# Lancer les migrations
npm run db:migrate

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure

- `app/` - Next.js App Router
  - `api/` - API Routes
  - `dashboard/` - Dashboard utilisateur
  - `auth/` - Pages d'authentification
  - `page.tsx` - Landing page
- `prisma/` - Schema Prisma
- `lib/` - Utilitaires (Prisma, auth, etc.)

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/[...nextauth]` - NextAuth (login/logout)

### Trajets
- `GET /api/trips` - Liste des trajets (filtres: fromCity, toCity, date, status)
- `POST /api/trips` - Créer un trajet (authentifié)
- `GET /api/trips/[id]` - Détail d'un trajet

### Réservations
- `GET /api/bookings` - Liste des réservations de l'utilisateur (authentifié)
- `POST /api/bookings` - Réserver un trajet (authentifié)

## 🗄️ Base de données

Le schéma Prisma est dans `prisma/schema.prisma`. Pour visualiser les données :

```bash
npm run db:studio
```

## 🚢 Déploiement

Ce projet est configuré pour Vercel. Connectez votre repo GitHub à Vercel et configurez les variables d'environnement.

## 🔧 Correction TypeScript

Les types NextAuth ont été étendus dans `types/next-auth.d.ts` pour supporter `session.user.id`.
