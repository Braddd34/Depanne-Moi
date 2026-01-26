#!/bin/bash
# Script pour initialiser Git et pousser vers GitHub

cd "$(dirname "$0")"

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

echo "✅ Repo web poussé vers GitHub avec succès !"
