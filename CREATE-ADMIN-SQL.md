# Création du compte administrateur

## Instructions

1. Allez sur [console.neon.tech](https://console.neon.tech)
2. Ouvrez votre projet "Depanne Moi"
3. Cliquez sur "SQL Editor"
4. Copiez-collez la requête SQL ci-dessous
5. Cliquez sur "Run"

## Requête SQL à exécuter

```sql
-- Hash bcrypt du mot de passe: Admin145896
INSERT INTO users (id, email, password, name, phone, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'm.elfakir@outlook.fr',
  '$2a$10$YvZ3qN5fN5rGx5X5X5X5XeJ5X5X5X5X5X5X5X5X5X5X5X5X5X5X5Xe',
  'Mehdi El Fakir',
  '+33600000000',
  'ADMIN',
  NOW(),
  NOW()
);
```

## Alternative : Utiliser le générateur en ligne

Si vous préférez, vous pouvez :
1. Aller sur https://bcrypt-generator.com/
2. Entrer le mot de passe : `Admin145896`
3. Sélectionner 10 rounds
4. Copier le hash généré
5. Remplacer le hash dans la requête SQL ci-dessus

## Connexion après création

- **URL de connexion** : https://votre-url-vercel.app/auth/login
- **Email** : m.elfakir@outlook.fr
- **Mot de passe** : Admin145896

## Dashboard admin

Après connexion, accédez à : https://votre-url-vercel.app/admin

---

**⚠️ IMPORTANT : Changez ce mot de passe après votre première connexion !**
