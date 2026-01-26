import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'm.elfakir@outlook.fr'
  const password = 'Admin145896'
  const name = 'Mehdi El Fakir'
  const phone = '+33600000000' // Remplacez par votre vrai numéro si besoin
  
  console.log('🔐 Création du compte administrateur...')
  
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })
  
  if (existingUser) {
    console.log('⚠️  Un utilisateur avec cet email existe déjà.')
    
    // Mettre à jour pour donner le rôle admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        role: 'ADMIN',
        password: await bcrypt.hash(password, 10),
      },
    })
    
    console.log('✅ Utilisateur mis à jour avec le rôle ADMIN')
    console.log('📧 Email:', updatedUser.email)
    console.log('👤 Nom:', updatedUser.name)
    console.log('🔑 Rôle:', updatedUser.role)
    return
  }
  
  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10)
  
  // Créer l'utilisateur admin
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone,
      role: 'ADMIN',
    },
  })
  
  console.log('✅ Compte administrateur créé avec succès !')
  console.log('📧 Email:', admin.email)
  console.log('👤 Nom:', admin.name)
  console.log('📱 Téléphone:', admin.phone)
  console.log('🔑 Rôle:', admin.role)
  console.log('')
  console.log('🌐 Vous pouvez maintenant vous connecter sur :')
  console.log('   https://votre-url-vercel.app/auth/login')
  console.log('')
  console.log('📊 Accédez au dashboard admin sur :')
  console.log('   https://votre-url-vercel.app/admin')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la création du compte admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
