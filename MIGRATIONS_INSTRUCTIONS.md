# 🗄️ INSTRUCTIONS MIGRATIONS SQL

## ⚠️ OBLIGATOIRE AVANT D'UTILISER LES NOUVELLES FONCTIONNALITÉS !

Tu dois exécuter ce SQL dans **Neon SQL Editor** pour créer les tables manquantes.

---

## 📝 MIGRATION À EXÉCUTER

### 1. Ouvre Neon SQL Editor
- Va sur [https://console.neon.tech](https://console.neon.tech)
- Sélectionne ton projet "Depanne-Moi"
- Clique sur "SQL Editor"

### 2. Copie et exécute ce SQL :

```sql
-- Créer l'enum NotificationType
CREATE TYPE "NotificationType" AS ENUM ('BOOKING_REQUEST', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'TRIP_UPDATED', 'MESSAGE_RECEIVED', 'REVIEW_RECEIVED', 'SYSTEM');

-- Créer la table notifications
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- Créer la table conversations
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- Créer la table messages
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- Créer les index pour les notifications
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");

-- Créer les index pour les conversations
CREATE INDEX "conversations_user1Id_idx" ON "conversations"("user1Id");
CREATE INDEX "conversations_user2Id_idx" ON "conversations"("user2Id");
CREATE UNIQUE INDEX "conversations_user1Id_user2Id_key" ON "conversations"("user1Id", "user2Id");

-- Créer les index pour les messages
CREATE INDEX "messages_conversationId_idx" ON "messages"("conversationId");
CREATE INDEX "messages_senderId_idx" ON "messages"("senderId");

-- Ajouter les foreign keys pour notifications
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Ajouter les foreign keys pour conversations
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Ajouter les foreign keys pour messages
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### 3. Clique sur "Run" ▶️

---

## ✅ VÉRIFICATION

Une fois exécuté, tu peux vérifier que les tables ont été créées :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Tu devrais voir :
- ✅ notifications
- ✅ conversations  
- ✅ messages
- ✅ users
- ✅ trips
- ✅ bookings
- ✅ reviews

---

## 🚨 EN CAS D'ERREUR

### Erreur "already exists"
Si tu vois "already exists", c'est que les tables existent déjà ! ✅

### Erreur "does not exist" (pour reviews)
Si la table `reviews` n'existe pas, exécute d'abord :

```sql
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "reviewedUserId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "reviews_reviewerId_tripId_key" ON "reviews"("reviewerId", "tripId");

ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewedUserId_fkey" FOREIGN KEY ("reviewedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## 🎯 APRÈS LA MIGRATION

Une fois les migrations exécutées :
1. ✅ Vercel va terminer le build
2. ✅ Les nouvelles fonctionnalités seront disponibles :
   - 🔔 Notifications en temps réel
   - 💬 Messagerie instantanée
   - 📄 Export PDF des factures

---

## 💡 POURQUOI MANUELLEMENT ?

Prisma ne peut pas exécuter les migrations automatiquement sur Vercel
en production. C'est une bonne pratique de les exécuter manuellement
pour avoir un contrôle total sur la base de données.
