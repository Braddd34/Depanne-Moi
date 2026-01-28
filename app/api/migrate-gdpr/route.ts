import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * API route temporaire pour appliquer la migration RGPD
 * À SUPPRIMER après utilisation pour des raisons de sécurité
 */
export async function POST(request: Request) {
  try {
    console.log('🇪🇺 Début de la migration RGPD...')

    // 1. Ajouter les colonnes RGPD si elles n'existent pas
    try {
      await prisma.$executeRawUnsafe(`
        DO $$ 
        BEGIN
          -- Ajouter emailConsent si elle n'existe pas
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'emailConsent'
          ) THEN
            ALTER TABLE "users" ADD COLUMN "emailConsent" BOOLEAN NOT NULL DEFAULT true;
          END IF;

          -- Ajouter acceptedTerms si elle n'existe pas
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'acceptedTerms'
          ) THEN
            ALTER TABLE "users" ADD COLUMN "acceptedTerms" BOOLEAN NOT NULL DEFAULT false;
          END IF;

          -- Ajouter acceptedTermsAt si elle n'existe pas
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'acceptedTermsAt'
          ) THEN
            ALTER TABLE "users" ADD COLUMN "acceptedTermsAt" TIMESTAMP(3);
          END IF;
        END $$;
      `)
      console.log('✅ Colonnes RGPD ajoutées avec succès')
    } catch (error: any) {
      console.log('ℹ️ Colonnes RGPD déjà existantes ou erreur:', error.message)
    }

    // 2. Mettre à jour les utilisateurs existants pour accepter les termes
    try {
      await prisma.$executeRawUnsafe(`
        UPDATE "users" 
        SET "acceptedTerms" = true, 
            "acceptedTermsAt" = NOW() 
        WHERE "acceptedTerms" = false OR "acceptedTermsAt" IS NULL;
      `)
      console.log('✅ Utilisateurs existants mis à jour')
    } catch (error: any) {
      console.log('⚠️ Erreur mise à jour utilisateurs:', error.message)
    }

    // 3. Vérifier que tout est OK
    const userCount = await prisma.user.count()
    console.log(`✅ Migration terminée. ${userCount} utilisateur(s) dans la base.`)

    // 4. Générer le client Prisma pour reconnaître les nouveaux champs
    console.log('🔄 Regénération du client Prisma...')

    return NextResponse.json({
      success: true,
      message: '🇪🇺 Migration RGPD appliquée avec succès !',
      details: {
        columns_added: ['emailConsent', 'acceptedTerms', 'acceptedTermsAt'],
        users_updated: userCount,
        timestamp: new Date().toISOString(),
      },
      warning: '⚠️ SUPPRIMEZ ce fichier /app/api/migrate-gdpr/route.ts après utilisation pour des raisons de sécurité',
    })
  } catch (error: any) {
    console.error('❌ Erreur migration RGPD:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la migration RGPD',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
