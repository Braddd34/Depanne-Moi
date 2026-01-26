-- =====================================================
-- COMMANDES À EXÉCUTER DANS LA CONSOLE NEON SQL EDITOR
-- =====================================================

-- 1. Créer le type UserRole
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- 2. Ajouter le champ role à la table users
ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';

-- 3. Créer le compte admin
-- IMPORTANT: Remplacez VOTRE_HASH_BCRYPT par le hash généré sur https://bcrypt-generator.com/
-- Mot de passe: Admin145896, Rounds: 10

INSERT INTO users (id, email, password, name, phone, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'm.elfakir@outlook.fr',
  'VOTRE_HASH_BCRYPT',
  'Mehdi El Fakir',
  '+33600000000',
  'ADMIN',
  NOW(),
  NOW()
);

-- 4. Vérifier que l'admin est bien créé
SELECT id, email, name, role FROM users WHERE email = 'm.elfakir@outlook.fr';
