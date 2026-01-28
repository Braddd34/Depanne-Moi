-- Créer les enums de vérification
CREATE TYPE "VerificationLevel" AS ENUM ('NONE', 'IDENTITY', 'DRIVER', 'BUSINESS', 'FULL');
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'EXPIRED');

-- Ajouter les champs de vérification au modèle User
ALTER TABLE "users" ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "identityVerifiedAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "driverLicenseVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "businessVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "verificationLevel" "VerificationLevel" NOT NULL DEFAULT 'NONE';
ALTER TABLE "users" ADD COLUMN "diditSessionId" TEXT;

-- Créer la table verification_sessions
CREATE TABLE "verification_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "sessionUrl" TEXT NOT NULL,
    "verificationType" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "result" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "verification_sessions_pkey" PRIMARY KEY ("id")
);

-- Créer les index
CREATE UNIQUE INDEX "verification_sessions_sessionId_key" ON "verification_sessions"("sessionId");
CREATE INDEX "verification_sessions_userId_idx" ON "verification_sessions"("userId");

-- Ajouter les foreign keys
ALTER TABLE "verification_sessions" ADD CONSTRAINT "verification_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
