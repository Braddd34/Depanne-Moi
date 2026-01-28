import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/migrate
 * Exécute les migrations SQL nécessaires
 * 
 * ⚠️ IMPORTANT : Cette route devrait être protégée en production !
 */
export async function GET() {
  try {
    console.log('🔄 Début de la migration...')

    // Créer la table reviews
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "reviews" (
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
    `)

    console.log('✅ Table reviews créée')

    // Créer l'index unique
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "reviews_reviewerId_tripId_key" 
      ON "reviews"("reviewerId", "tripId");
    `)

    console.log('✅ Index unique créé')

    // Ajouter les contraintes de clés étrangères
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "reviews" 
        ADD CONSTRAINT "reviews_reviewerId_fkey" 
        FOREIGN KEY ("reviewerId") REFERENCES "users"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
      `)
      console.log('✅ Contrainte reviewerId ajoutée')
    } catch (e: any) {
      if (e.message.includes('already exists')) {
        console.log('⚠️ Contrainte reviewerId existe déjà')
      } else {
        throw e
      }
    }

    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "reviews" 
        ADD CONSTRAINT "reviews_reviewedUserId_fkey" 
        FOREIGN KEY ("reviewedUserId") REFERENCES "users"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
      `)
      console.log('✅ Contrainte reviewedUserId ajoutée')
    } catch (e: any) {
      if (e.message.includes('already exists')) {
        console.log('⚠️ Contrainte reviewedUserId existe déjà')
      } else {
        throw e
      }
    }

    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "reviews" 
        ADD CONSTRAINT "reviews_tripId_fkey" 
        FOREIGN KEY ("tripId") REFERENCES "trips"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
      `)
      console.log('✅ Contrainte tripId ajoutée')
    } catch (e: any) {
      if (e.message.includes('already exists')) {
        console.log('⚠️ Contrainte tripId existe déjà')
      } else {
        throw e
      }
    }

    // Générer le Prisma Client avec le nouveau modèle
    console.log('🔄 Génération du Prisma Client...')
    // Note: Le Prisma Client sera automatiquement régénéré au prochain build Vercel

    return NextResponse.json({
      success: true,
      message: '✅ Migration terminée avec succès !',
      details: {
        tableCreated: 'reviews',
        indexCreated: 'reviews_reviewerId_tripId_key',
        constraintsAdded: [
          'reviews_reviewerId_fkey',
          'reviews_reviewedUserId_fkey',
          'reviews_tripId_fkey'
        ]
      }
    })

  } catch (error: any) {
    console.error('❌ Erreur lors de la migration:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la migration',
      details: error.message
    }, { status: 500 })
  }
}
