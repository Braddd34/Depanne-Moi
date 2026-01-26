import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { secret } = await request.json()
    
    if (secret !== 'setup-complete-db-123') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    console.log('🚀 Configuration complète de la base de données...')

    // Migration 1: Créer les enums et tables initiales
    console.log('1️⃣ Création des enums...')
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "TripStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'COMPLETED', 'CANCELLED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
    
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    console.log('2️⃣ Création de la table users...')
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT,
        "name" TEXT NOT NULL,
        "company" TEXT,
        "phone" TEXT NOT NULL,
        "vehicleType" TEXT,
        "role" "UserRole" NOT NULL DEFAULT 'USER',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
    `)

    console.log('3️⃣ Création de la table trips...')
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "trips" (
        "id" TEXT NOT NULL,
        "driverId" TEXT NOT NULL,
        "fromCity" TEXT NOT NULL,
        "toCity" TEXT NOT NULL,
        "date" TIMESTAMP(3) NOT NULL,
        "vehicleType" TEXT NOT NULL,
        "price" DOUBLE PRECISION,
        "status" "TripStatus" NOT NULL DEFAULT 'AVAILABLE',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
      );
    `)

    console.log('4️⃣ Création de la table bookings...')
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "bookings" (
        "id" TEXT NOT NULL,
        "tripId" TEXT NOT NULL,
        "bookerId" TEXT NOT NULL,
        "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
      );
    `)

    console.log('5️⃣ Ajout des contraintes de clés étrangères...')
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        ALTER TABLE "trips" ADD CONSTRAINT "trips_driverId_fkey" 
        FOREIGN KEY ("driverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tripId_fkey" 
        FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        ALTER TABLE "bookings" ADD CONSTRAINT "bookings_bookerId_fkey" 
        FOREIGN KEY ("bookerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    console.log('6️⃣ Création du compte administrateur...')
    const email = 'm.elfakir@outlook.fr'
    const password = 'Admin145896'
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN', password: hashedPassword },
      })
      console.log('✅ Compte admin mis à jour')
    } else {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Mehdi El Fakir',
          phone: '+33600000000',
          role: 'ADMIN',
        },
      })
      console.log('✅ Compte admin créé')
    }

    return NextResponse.json({
      success: true,
      message: 'Base de données configurée et compte admin créé avec succès',
      credentials: {
        email,
        password: 'Admin145896',
        loginUrl: '/admin/login',
      },
    })

  } catch (error: any) {
    console.error('Erreur setup DB:', error)
    return NextResponse.json(
      { error: error.message, details: error.toString() },
      { status: 500 }
    )
  }
}
