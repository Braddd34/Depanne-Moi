import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Configuration de la base de données et création du compte admin...\n')

  try {
    // Étape 1: Vérifier la connexion
    console.log('1️⃣ Vérification de la connexion à la base de données...')
    await prisma.$connect()
    console.log('✅ Connecté à la base de données\n')

    // Étape 2: Créer le compte admin
    console.log('2️⃣ Création du compte administrateur...')
    
    const email = 'm.elfakir@outlook.fr'
    const password = 'Admin145896'
    const hashedPassword = await bcrypt.hash(password, 10)

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log('⚠️  Un utilisateur avec cet email existe déjà.')
      console.log('🔄 Mise à jour du rôle en ADMIN...')
      
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          role: 'ADMIN',
          password: hashedPassword,
        },
      })
      
      console.log('✅ Utilisateur mis à jour avec succès !')
    } else {
      const admin = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Mehdi El Fakir',
          phone: '+33600000000',
          role: 'ADMIN',
        },
      })
      
      console.log('✅ Compte administrateur créé avec succès !')
    }

    console.log('\n📋 Informations de connexion :')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email     :', email)
    console.log('🔑 Password  :', password)
    console.log('🎭 Role      : ADMIN')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    console.log('🌐 URLs d\'accès :')
    console.log('   Connexion admin : https://votre-url-vercel.app/admin/login')
    console.log('   Dashboard admin : https://votre-url-vercel.app/admin\n')

    console.log('⚠️  IMPORTANT : Changez ce mot de passe après votre première connexion !\n')

  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    
    if (error.code === 'P2010') {
      console.log('\n💡 L\'enum UserRole n\'existe pas encore.')
      console.log('   La migration sera appliquée automatiquement lors du prochain déploiement.')
      console.log('   Ou exécutez : npm run db:migrate\n')
    }
    
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
