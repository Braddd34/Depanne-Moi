# Instructions pour initialiser Git et pousser vers GitHub

## Pour le repo Web

Ouvrez un terminal et exécutez ces commandes :

```bash
cd "/Users/mehdielfakir/Desktop/Depanne moi/depanne-moi-web"

# Initialiser Git
git init
git branch -M main

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial commit: Next.js web app with Prisma, NextAuth, and API routes"

# Ajouter le remote
git remote add origin https://github.com/Braddd34/Depanne-Moi.git

# Push vers GitHub
git push -u origin main
```

## Pour le repo Mobile

Ouvrez un terminal et exécutez ces commandes :

```bash
cd "/Users/mehdielfakir/Desktop/depanne-moi-mobile"

# Initialiser Git
git init
git branch -M main

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial commit: Expo mobile app with React Native and Expo Router"

# Ajouter le remote
git remote add origin https://github.com/Braddd34/Depanne-moi-App.git

# Push vers GitHub
git push -u origin main
```

## Si vous avez des erreurs de permissions

Si vous obtenez "Operation not permitted", essayez :

1. Ouvrir Terminal avec les permissions administrateur
2. Ou exécuter : `sudo chmod -R u+w "/Users/mehdielfakir/Desktop/Depanne moi/depanne-moi-web"`
3. Ou vérifier les paramètres de sécurité macOS (Full Disk Access pour Terminal/Cursor)
