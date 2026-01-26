# Instructions pour créer le compte admin

## Étape 1 : Configurer votre DATABASE_URL localement

1. Allez sur votre dashboard Vercel : https://vercel.com
2. Ouvrez votre projet "Depanne-Moi"
3. Allez dans **Settings** → **Environment Variables**
4. Copiez la valeur de `DATABASE_URL`

5. Créez un fichier `.env` dans le dossier `depanne-moi-web` :

```bash
cd "/Users/mehdielfakir/Desktop/Depanne moi/depanne-moi-web"
nano .env
```

6. Collez dedans :
```
DATABASE_URL="votre-url-copiée-depuis-vercel"
```

7. Sauvegardez (Ctrl+O, Enter, Ctrl+X)

## Étape 2 : Exécuter le script

```bash
npm run setup-admin
```

C'est tout ! Le script va :
- ✅ Se connecter à votre base Neon
- ✅ Créer l'enum UserRole si nécessaire
- ✅ Créer votre compte admin automatiquement

## Alternative : Donnez-moi votre DATABASE_URL

Si vous préférez, donnez-moi simplement votre `DATABASE_URL` et je l'exécuterai pour vous.
