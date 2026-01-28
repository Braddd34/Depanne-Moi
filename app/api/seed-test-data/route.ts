import { NextResponse } from 'next/server'
import { PrismaClient, TripStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * GET /api/seed-test-data
 * Crée des données de test (utilisateurs + trajets)
 * 
 * ⚠️ IMPORTANT : Cette route devrait être protégée en production !
 * Pour l'instant, accessible uniquement en développement.
 */
export async function GET() {
  try {
    console.log('🌱 Début du seed des données de test...')

    // Supprimer les anciennes données de test
    await prisma.booking.deleteMany({
      where: {
        booker: {
          email: {
            contains: '@test-depannemoi.com'
          }
        }
      }
    })
    
    await prisma.trip.deleteMany({
      where: {
        driver: {
          email: {
            contains: '@test-depannemoi.com'
          }
        }
      }
    })
    
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@test-depannemoi.com'
        }
      }
    })

    // Créer des utilisateurs de test
    const hashedPassword = await bcrypt.hash('Test123456!', 10)

    const users = await Promise.all([
      prisma.user.create({
        data: {
          name: 'Jean Dupont',
          email: 'jean.dupont@test-depannemoi.com',
          password: hashedPassword,
          phone: '06 12 34 56 78',
          company: 'Transport Dupont SARL',
          isVerified: true,
          identityVerifiedAt: new Date(),
          verificationLevel: 'FULL',
        }
      }),
      prisma.user.create({
        data: {
          name: 'Marie Martin',
          email: 'marie.martin@test-depannemoi.com',
          password: hashedPassword,
          phone: '06 23 45 67 89',
          company: 'Martin Logistics',
          isVerified: true,
          identityVerifiedAt: new Date(),
          verificationLevel: 'DRIVER',
        }
      }),
      prisma.user.create({
        data: {
          name: 'Pierre Bernard',
          email: 'pierre.bernard@test-depannemoi.com',
          password: hashedPassword,
          phone: '06 34 56 78 90',
          company: null,
          isVerified: true,
          identityVerifiedAt: new Date(),
          verificationLevel: 'IDENTITY',
        }
      }),
      prisma.user.create({
        data: {
          name: 'Sophie Dubois',
          email: 'sophie.dubois@test-depannemoi.com',
          password: hashedPassword,
          phone: '06 45 67 89 01',
          company: 'Dubois Express',
          isVerified: true,
          identityVerifiedAt: new Date(),
          verificationLevel: 'FULL',
        }
      }),
    ])

    // Créer des trajets de test
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const in3Days = new Date(today)
    in3Days.setDate(in3Days.getDate() + 3)
    
    const in5Days = new Date(today)
    in5Days.setDate(in5Days.getDate() + 5)
    
    const in7Days = new Date(today)
    in7Days.setDate(in7Days.getDate() + 7)
    
    const in10Days = new Date(today)
    in10Days.setDate(in10Days.getDate() + 10)

    const trips = [
      // Jean Dupont
      { driverId: users[0].id, fromCity: 'Paris', toCity: 'Lyon', date: tomorrow, vehicleType: 'Camion', price: 250, status: TripStatus.AVAILABLE },
      { driverId: users[0].id, fromCity: 'Marseille', toCity: 'Toulouse', date: in3Days, vehicleType: 'Semi-remorque', price: 400, status: TripStatus.AVAILABLE },
      { driverId: users[0].id, fromCity: 'Lille', toCity: 'Strasbourg', date: in5Days, vehicleType: 'Fourgon', price: 180, status: TripStatus.AVAILABLE },
      
      // Marie Martin
      { driverId: users[1].id, fromCity: 'Bordeaux', toCity: 'Paris', date: tomorrow, vehicleType: 'Camion', price: 300, status: TripStatus.AVAILABLE },
      { driverId: users[1].id, fromCity: 'Nantes', toCity: 'Lyon', date: in3Days, vehicleType: 'Utilitaire', price: 150, status: TripStatus.AVAILABLE },
      { driverId: users[1].id, fromCity: 'Nice', toCity: 'Marseille', date: in5Days, vehicleType: 'Fourgon', price: 80, status: TripStatus.AVAILABLE },
      
      // Pierre Bernard
      { driverId: users[2].id, fromCity: 'Rennes', toCity: 'Nantes', date: in3Days, vehicleType: 'Camion', price: 120, status: TripStatus.AVAILABLE },
      { driverId: users[2].id, fromCity: 'Montpellier', toCity: 'Toulouse', date: in5Days, vehicleType: 'Remorque', price: 200, status: TripStatus.AVAILABLE },
      { driverId: users[2].id, fromCity: 'Dijon', toCity: 'Lyon', date: in7Days, vehicleType: 'Utilitaire', price: 100, status: TripStatus.AVAILABLE },
      
      // Sophie Dubois
      { driverId: users[3].id, fromCity: 'Paris', toCity: 'Bordeaux', date: in3Days, vehicleType: 'Camion', price: 350, status: TripStatus.AVAILABLE },
      { driverId: users[3].id, fromCity: 'Toulouse', toCity: 'Marseille', date: in5Days, vehicleType: 'Semi-remorque', price: 450, status: TripStatus.AVAILABLE },
      { driverId: users[3].id, fromCity: 'Lyon', toCity: 'Paris', date: in7Days, vehicleType: 'Fourgon', price: 220, status: TripStatus.AVAILABLE },
      { driverId: users[3].id, fromCity: 'Grenoble', toCity: 'Genève', date: in10Days, vehicleType: 'Utilitaire', price: 130, status: TripStatus.AVAILABLE },
      { driverId: users[3].id, fromCity: 'Strasbourg', toCity: 'Metz', date: in5Days, vehicleType: 'Camion', price: 90, status: TripStatus.AVAILABLE },
      { driverId: users[3].id, fromCity: 'Angers', toCity: 'Tours', date: in7Days, vehicleType: 'Fourgon', price: 70, status: TripStatus.AVAILABLE },
    ]

    const createdTrips = await Promise.all(
      trips.map(trip => prisma.trip.create({ data: trip }))
    )

    return NextResponse.json({
      success: true,
      message: '✅ Données de test créées avec succès !',
      data: {
        users: users.length,
        trips: createdTrips.length,
        testAccounts: users.map(u => ({
          name: u.name,
          email: u.email,
          password: 'Test123456!',
          company: u.company,
        }))
      }
    })

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la création des données de test',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
