/**
 * Script pour créer un utilisateur de test
 * Lance avec: node scripts/create-test-user.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Création d\'un utilisateur de test...')

  // Email et mot de passe du test user
  const email = 'test@depannemoi.com'
  const password = 'test123456'
  const name = 'Utilisateur Test'
  const phone = '0612345678'

  try {
    // Vérifier si l'utilisateur existe déjà
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      console.log('⚠️  Utilisateur déjà existant. Suppression...')
      await prisma.user.delete({
        where: { email },
      })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        acceptedTerms: true,
        acceptedTermsAt: new Date(),
        emailConsent: true,
        // Les champs de vérification auront leurs valeurs par défaut
      },
    })

    console.log('✅ Utilisateur de test créé avec succès !')
    console.log('\n📝 Informations de connexion :')
    console.log(`Email: ${email}`)
    console.log(`Mot de passe: ${password}`)
    console.log(`\n🔗 Connectez-vous sur votre site avec ces identifiants`)
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur :', error)
    process.exit(1)
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
