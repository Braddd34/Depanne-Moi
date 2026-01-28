import { PrismaClient, TripStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed des données de test...\n')

  // Supprimer les anciennes données de test
  console.log('🗑️  Nettoyage des anciennes données de test...')
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

  console.log('✅ Données de test nettoyées\n')

  // Créer des utilisateurs de test
  console.log('👥 Création des utilisateurs de test...')
  
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

  console.log(`✅ ${users.length} utilisateurs créés\n`)

  // Créer des trajets de test
  console.log('🚚 Création des trajets de test...')

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
    // Trajets de Jean Dupont
    {
      driverId: users[0].id,
      fromCity: 'Paris',
      toCity: 'Lyon',
      date: tomorrow,
      vehicleType: 'Camion',
      price: 250,
      status: TripStatus.AVAILABLE,
    },
    {
      driverId: users[0].id,
      fromCity: 'Marseille',
      toCity: 'Toulouse',
      date: in3Days,
      vehicleType: 'Semi-remorque',
      price: 400,
      status: TripStatus.AVAILABLE,
    },
    {
      driverId: users[0].id,
      fromCity: 'Lille',
      toCity: 'Strasbourg',
      date: in5Days,
      vehicleType: 'Fourgon',
      price: 180,
      status: TripStatus.AVAILABLE,
    },
    
    // Trajets de Marie Martin
    {
      driverId: users[1].id,
      fromCity: 'Bordeaux',
      toCity: 'Paris',
      date: tomorrow,
      vehicleType: 'Camion',
      price: 300,
      status: TripStatus.AVAILABLE,
    },
    {
      driverId: users[1].id,
      fromCity: 'Nantes',
      toCity: 'Lyon',
      date: in3Days,
      vehicleType: 'Utilitaire',
      price: 150,
      status: TripStatus.AVAILABLE,
    },
    {
      driverId: users[1].id,
      fromCity: 'Nice',
      toCity: 'Marseille',
      date: in5Days,
      vehicleType: 'Fourgon',
      price: 80,
      status: TripStatus.AVAILABLE,
    },
    
    // Trajets de Pierre Bernard
    {
      driverId: users[2].id,
      fromCity: 'Rennes',
      toCity: 'Nantes',
      date: in3Days,
      vehicleType: 'Camion',
      price: 120,
      status: TripStatus.AVAILABLE,
    },
    {
      driverId: users[2].id,
      fromCity: 'Montpellier',
      toCity: 'Toulouse',
      date: in5Days,
      vehicleType: 'Remorque',
      price: 200,
      status: TripStatus.AVAILABLE,
    },
    {
      driverId: users[2].id,
      fromCity: 'Dijon',
      toCity: 'Lyon',
      date: in7Days,
      vehicleType: 'Utilitaire',
      price: 100,
      status: TripStatus.AVAILABLE,
    },
    
    // Trajets de Sophie Dubois
    {
      driverId: users[3].id,
      fromCity: 'Paris',
      toCity: 'Bordeaux',
      date: in3Days,
      vehicleType: 'Camion',
      price: 350,
      status: TripStatus.AVAILABLE,
    },
    {
      driverId: users[3].id,
      fromCity: 'Toulouse',
      toCity: 'Marseille',
      date: in5Days,
      vehicleType: 'Semi-remorque',
      price: 450,
      status: TripStatus.AVAILABLE,
    },
    {
      driverId: users[3].id,
      fromCity: 'Lyon',
      toCity: 'Paris',
      date: in7Days,
      vehicleType: 'Fourgon',
      price: 220,
      status: TripStatus.AVAILABLE,
    },
    {
      driverId: users[3].id,
      fromCity: 'Grenoble',
      toCity: 'Genève',
      date: in10Days,
      vehicleType: 'Utilitaire',
      price: 130,
      status: TripStatus.AVAILABLE,
    },
    {
      driverId: users[3].id,
      fromCity: 'Strasbourg',
      toCity: 'Metz',
      date: in5Days,
      vehicleType: 'Camion',
      price: 90,
      status: TripStatus.AVAILABLE,
    },
    {
      driverId: users[3].id,
      fromCity: 'Angers',
      toCity: 'Tours',
      date: in7Days,
      vehicleType: 'Fourgon',
      price: 70,
      status: TripStatus.AVAILABLE,
    },
  ]

  const createdTrips = await Promise.all(
    trips.map(trip => prisma.trip.create({ data: trip }))
  )

  console.log(`✅ ${createdTrips.length} trajets créés\n`)

  // Afficher le résumé
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ SEED TERMINÉ AVEC SUCCÈS !')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  console.log('👥 UTILISATEURS DE TEST CRÉÉS :')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  users.forEach((user, i) => {
    console.log(`${i + 1}. ${user.name}`)
    console.log(`   📧 Email: ${user.email}`)
    console.log(`   🔑 Mot de passe: Test123456!`)
    console.log(`   📱 Téléphone: ${user.phone}`)
    if (user.company) console.log(`   🏢 Entreprise: ${user.company}`)
    console.log(`   ✅ Vérifié: Oui (${user.verificationLevel})\n`)
  })

  console.log('\n🚚 TRAJETS CRÉÉS PAR VILLE :')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  const cityCounts = createdTrips.reduce((acc, trip) => {
    const key = `${trip.fromCity} → ${trip.toCity}`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  Object.entries(cityCounts).forEach(([route, count]) => {
    console.log(`  • ${route} (${count}x)`)
  })

  console.log('\n🎯 PROCHAINES ÉTAPES :')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('1. Connecte-toi avec UN de ces comptes')
  console.log('2. Va sur la page "Carte 🗺️"')
  console.log('3. Tu verras les trajets des AUTRES utilisateurs !')
  console.log('4. Clique sur les marqueurs pour voir les détails')
  console.log('5. Utilise les filtres par type de véhicule\n')

  console.log('💡 ASTUCE :')
  console.log('   Tu peux aussi te connecter avec plusieurs comptes')
  console.log('   dans différents navigateurs pour tester les réservations !\n')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erreur lors du seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
