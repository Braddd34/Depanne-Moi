# 🌱 Script de Seed - Données de Test

Ce script crée automatiquement des utilisateurs et trajets de test pour peupler la base de données.

---

## 🚀 COMMENT L'EXÉCUTER SUR VERCEL

### **Option 1 : Via l'API Vercel (Recommandé)**

J'ai créé une route API spéciale que tu peux appeler depuis ton navigateur :

**URL à ouvrir :** `https://ton-site.vercel.app/api/seed-test-data`

⚠️ **IMPORTANT** : Cette route doit être protégée ! Je vais la créer pour toi.

---

### **Option 2 : Exécuter en local (si Node.js installé)**

Si tu installes Node.js plus tard, tu pourras lancer :

```bash
npm run seed-test
```

---

## 📊 CE QUE LE SCRIPT CRÉE

### **👥 4 Utilisateurs de test**

| Nom | Email | Mot de passe | Entreprise |
|-----|-------|--------------|------------|
| Jean Dupont | jean.dupont@test-depannemoi.com | Test123456! | Transport Dupont SARL |
| Marie Martin | marie.martin@test-depannemoi.com | Test123456! | Martin Logistics |
| Pierre Bernard | pierre.bernard@test-depannemoi.com | Test123456! | - |
| Sophie Dubois | sophie.dubois@test-depannemoi.com | Test123456! | Dubois Express |

**Tous vérifiés** avec niveau de vérification complet ✅

---

### **🚚 15 Trajets disponibles**

Exemples de trajets créés :

- **Paris → Lyon** (Camion, 250€) - Demain
- **Marseille → Toulouse** (Semi-remorque, 400€) - Dans 3 jours
- **Bordeaux → Paris** (Camion, 300€) - Demain
- **Lyon → Paris** (Fourgon, 220€) - Dans 7 jours
- **Nice → Marseille** (Fourgon, 80€) - Dans 5 jours
- Et 10 autres trajets variés !

**Toutes les grandes villes françaises** sont couvertes ! 🇫🇷

---

## 🗺️ VOIR LES TRAJETS SUR LA CARTE

### **Étapes :**

1. **Connecte-toi** avec UN des comptes de test
2. Va sur **"Carte 🗺️"** dans la navigation
3. **Admire** les 14-15 marqueurs affichés !
4. **Clique** sur les marqueurs pour voir les détails
5. **Filtre** par type de véhicule

---

## ⚠️ IMPORTANT

### **Pourquoi tu ne vois pas TES propres trajets ?**

Par design, la carte affiche **uniquement les trajets des autres utilisateurs**.

Si tu es connecté avec `jean.dupont@test-depannemoi.com`, tu verras :
- ✅ Les trajets de Marie, Pierre, Sophie
- ❌ PAS les trajets de Jean (c'est toi)

**C'est normal et voulu** ! 🎯

---

## 🔄 RELANCER LE SEED

Le script **supprime les anciennes données de test** avant d'en créer de nouvelles.

Tu peux le relancer autant de fois que tu veux ! 🔄

---

## 🧹 NETTOYER LES DONNÉES DE TEST

Pour supprimer TOUS les utilisateurs et trajets de test :

```sql
-- Dans Neon SQL Editor
DELETE FROM bookings WHERE booker_id IN (
  SELECT id FROM users WHERE email LIKE '%@test-depannemoi.com'
);
DELETE FROM trips WHERE driver_id IN (
  SELECT id FROM users WHERE email LIKE '%@test-depannemoi.com'
);
DELETE FROM users WHERE email LIKE '%@test-depannemoi.com';
```

---

## 💡 ASTUCE MULTI-COMPTES

Pour tester les réservations :

1. **Navigateur 1** (Chrome) → Connecté avec Jean
2. **Navigateur 2** (Firefox) → Connecté avec Marie
3. Jean publie un trajet
4. Marie le voit sur la carte et le réserve
5. Jean reçoit la demande dans "Gérer réservations"
6. Jean accepte/refuse

**Test complet du workflow !** 🎭

---

## 🎉 C'EST PRÊT !

Le script est créé et prêt à être exécuté !

**Prochaine étape** : Je vais créer une route API pour l'exécuter depuis Vercel ! 🚀
