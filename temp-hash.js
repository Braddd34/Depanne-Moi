const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('Admin145896', 10);
console.log('HASH:', hash);
console.log('');
console.log('=== REQUÊTE SQL À EXÉCUTER DANS NEON ===');
console.log('');
console.log(`INSERT INTO users (id, email, password, name, phone, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'm.elfakir@outlook.fr',
  '${hash}',
  'Mehdi El Fakir',
  '+33600000000',
  'ADMIN',
  NOW(),
  NOW()
);`);
console.log('');
console.log('=== FIN DE LA REQUÊTE ===');
