const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const DATABASE_URL = "postgresql://neondb_owner:npg_Sens8V0rJKmu@ep-spring-morning-agsgf9c0-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function setup() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    console.log('🔌 Connexion à la base de données Neon...');
    await client.connect();
    console.log('✅ Connecté!\n');

    // Étape 1: Créer l'enum UserRole
    console.log('1️⃣ Création de l\'enum UserRole...');
    try {
      await client.query(`CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');`);
      console.log('✅ Enum UserRole créé\n');
    } catch (error) {
      if (error.code === '42710') {
        console.log('⚠️  Enum UserRole existe déjà\n');
      } else {
        throw error;
      }
    }

    // Étape 2: Ajouter le champ role
    console.log('2️⃣ Ajout du champ role à la table users...');
    try {
      await client.query(`ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';`);
      console.log('✅ Champ role ajouté\n');
    } catch (error) {
      if (error.code === '42701') {
        console.log('⚠️  Champ role existe déjà\n');
      } else {
        throw error;
      }
    }

    // Étape 3: Créer le compte admin
    console.log('3️⃣ Création du compte administrateur...');
    const email = 'm.elfakir@outlook.fr';
    const password = 'Admin145896';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Vérifier si l'utilisateur existe
    const checkUser = await client.query(
      'SELECT id, role FROM users WHERE email = $1',
      [email]
    );

    if (checkUser.rows.length > 0) {
      console.log('⚠️  Utilisateur existant trouvé. Mise à jour du rôle...');
      await client.query(
        `UPDATE users SET role = 'ADMIN', password = $1 WHERE email = $2`,
        [hashedPassword, email]
      );
      console.log('✅ Utilisateur mis à jour en ADMIN\n');
    } else {
      await client.query(
        `INSERT INTO users (id, email, password, name, phone, role, "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, 'ADMIN', NOW(), NOW())`,
        [email, hashedPassword, 'Mehdi El Fakir', '+33600000000']
      );
      console.log('✅ Compte admin créé avec succès!\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 INFORMATIONS DE CONNEXION ADMIN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email    :', email);
    console.log('🔑 Password :', password);
    console.log('🎭 Role     : ADMIN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Configuration terminée avec succès!\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

setup()
  .then(() => {
    console.log('🎉 Tout est prêt!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
