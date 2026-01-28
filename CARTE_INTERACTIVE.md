# 🗺️ Carte Interactive Leaflet - Guide d'installation

## ✅ Prérequis

La carte interactive utilise **Leaflet** (OpenStreetMap) - 100% gratuit et open-source !

---

## 📦 Installation

**Étape 1 : Installer les dépendances**

```bash
cd /Users/mehdielfakir/Desktop/Depanne\ moi/depanne-moi-web
npm install leaflet react-leaflet @types/leaflet
```

**Étape 2 : Vérifier que tout est installé**

Vérifie que `package.json` contient :

```json
{
  "dependencies": {
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.8"
  }
}
```

**Étape 3 : Lancer le serveur**

```bash
npm run dev
```

**Étape 4 : Tester la carte**

Ouvre `http://localhost:3000/dashboard/map` et admire ! 🎉

---

## 🎯 Fonctionnalités de la carte

### ✅ Ce qui est inclus

1. **Carte interactive complète**
   - Zoom, déplacement, scroll
   - OpenStreetMap (gratuit)
   - Responsive sur mobile

2. **Marqueurs de trajets**
   - 📍 Vert = Point de départ
   - 📍 Rouge = Point d'arrivée
   - Lignes violettes = Trajet

3. **Popups interactives**
   - Infos du trajet (villes, date, prix, véhicule)
   - Bouton "Voir détails" cliquable
   - Navigation vers la page du trajet

4. **Géocodage automatique**
   - API Nominatim (OpenStreetMap) - gratuite
   - Conversion ville → coordonnées GPS
   - Cache local pour performances

5. **Filtres rapides**
   - Par type de véhicule (camion, fourgon, etc.)
   - Mise à jour en temps réel
   - Compteur de trajets

6. **Légende visuelle**
   - Explication des couleurs
   - Compteur de trajets affichés
   - Toujours visible

---

## 🔧 Architecture technique

### Fichiers créés

1. **`components/TripMap.tsx`**
   - Composant carte principal
   - Géocodage via Nominatim
   - Marqueurs et lignes
   - Import dynamique (SSR safe)

2. **`app/dashboard/map/page.tsx`**
   - Page carte interactive
   - Filtres par véhicule
   - Fetch des trajets disponibles
   - Navigation vers détails

3. **`app/globals.css`**
   - Import CSS Leaflet
   - Styles de la carte

---

## 🚀 Comment ça fonctionne ?

### 1. Géocodage des villes

```typescript
// Convertit "Paris" en coordonnées GPS (48.8566, 2.3522)
await geocodeCity('Paris')
// → { lat: 48.8566, lon: 2.3522 }
```

L'API Nominatim est **gratuite** mais limitée à 1 requête/seconde.

### 2. Affichage sur la carte

- Chaque trajet = 2 marqueurs (départ + arrivée)
- Une ligne violette relie les deux points
- Click sur marqueur = popup avec infos

### 3. Performance

- **Import dynamique** : Leaflet ne charge que côté client
- **Cache** : Les coordonnées sont mémorisées
- **Lazy loading** : Chargement progressif des trajets

---

## ⚠️ Limites API Nominatim

- **1 requête par seconde** maximum
- **Fair use policy** : Ne pas abuser
- Si beaucoup de trajets : considérer un cache en BDD

### Solution si trop de trajets :

Ajouter un champ `coordinates` dans le modèle `Trip` :

```prisma
model Trip {
  // ... autres champs
  fromLat      Float?
  fromLon      Float?
  toLat        Float?
  toLon        Float?
}
```

Puis géocoder à la création du trajet (1 fois) au lieu de chaque affichage.

---

## 🎨 Personnalisation

### Changer la carte de fond

Remplace l'URL dans `TripMap.tsx` :

```tsx
// Style défaut (OpenStreetMap)
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

// Style sombre
url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"

// Style satellite (Esri)
url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
```

### Changer les couleurs des lignes

Dans `TripMap.tsx` :

```tsx
<Polyline
  positions={[[from.lat, from.lon], [to.lat, to.lon]]}
  color="#8b5cf6"  // Violet par défaut
  weight={3}        // Épaisseur
  opacity={0.7}     // Transparence
/>
```

---

## 🐛 Dépannage

### Erreur "document is not defined"

✅ **Solution** : Le composant utilise déjà `dynamic import` - c'est résolu !

### Marqueurs ne s'affichent pas

✅ **Solution** : Le CSS Leaflet est déjà importé dans `globals.css`

### Géocodage trop lent

💡 **Amélioration** : Ajouter les coordonnées en BDD (voir section "Limites API")

### Carte ne se charge pas

1. Vérifier que les packages sont installés : `npm list leaflet react-leaflet`
2. Vérifier la console navigateur (F12)
3. Relancer le serveur : `npm run dev`

---

## 📚 Ressources

- **Leaflet** : https://leafletjs.com/
- **React Leaflet** : https://react-leaflet.js.org/
- **Nominatim API** : https://nominatim.org/release-docs/develop/api/Overview/
- **Tiles gratuits** : https://wiki.openstreetmap.org/wiki/Tile_servers

---

## 🎉 C'est prêt !

La carte est **entièrement fonctionnelle** et **gratuite** !

Lance `npm install` + `npm run dev` et profite ! 🚀
