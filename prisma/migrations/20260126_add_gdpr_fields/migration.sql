-- Ajout des champs RGPD au modèle User
ALTER TABLE "users" ADD COLUMN "emailConsent" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "users" ADD COLUMN "acceptedTerms" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "acceptedTermsAt" TIMESTAMP(3);

-- Mettre à jour les utilisateurs existants
UPDATE "users" SET "acceptedTerms" = true, "acceptedTermsAt" = NOW() WHERE "acceptedTerms" = false;
