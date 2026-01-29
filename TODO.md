# 📋 TODO - Depanne Moi

## 🚨 PRIORITÉ HAUTE

### 📸 Système de Photos (Garantie & Transparence)
- [ ] **Setup Cloudinary** (ou autre service cloud)
  - Créer compte gratuit
  - Récupérer credentials (Cloud Name, API Key, Secret)
  - Ajouter dans .env
- [ ] **Modifier Prisma Schema**
  - Créer modèle `TripImage`
  - Enum `ImageType` (VEHICLE, BEFORE_TRANSPORT, AFTER_TRANSPORT)
  - Relations avec Trip et User
- [ ] **Upload de photos - Client (création trajet)**
  - Component upload drag & drop
  - Prévisualisation images
  - Upload vers Cloudinary
  - 3-5 photos max du véhicule à transporter
- [ ] **Upload de photos - Transporteur (avant/après)**
  - Interface "Photos avant transport" (preuve état initial)
  - Interface "Photos après transport" (preuve état final)
  - Comparaison avant/après
- [ ] **API Routes**
  - POST /api/upload - Upload image
  - GET /api/trips/[id]/images - Liste photos
  - POST /api/trips/[id]/images - Ajouter photo
  - DELETE /api/trips/[id]/images/[id] - Supprimer photo
- [ ] **Intégration pages**
  - Form création trajet (upload photos véhicule)
  - Page détail trajet (voir toutes les photos)
  - Interface transporteur (upload avant/après)
  - Galerie photos dans historique
- [ ] **Code modulaire**
  - Abstraction StorageProvider
  - Facile changement de service cloud plus tard

**Avantages :**
- 🤝 Confiance client/transporteur
- 📋 Preuve en cas de litige
- 🛡️ Transparence totale du service
- ✅ Garantie état du véhicule

---

## 🗺️ À faire plus tard

### Carte Interactive
- [ ] **Choisir la technologie de carte** :
  - Option 1 : Mapbox (moderne, gratuit jusqu'à 50k vues/mois)
  - Option 2 : Google Maps (le meilleur, mais payant)
  - Option 3 : Leaflet customisé (100% gratuit, design moderne)
- [ ] Implémenter la carte choisie
- [ ] Afficher les trajets avec markers A/B
- [ ] Tracer les itinéraires réels sur la carte
- [ ] Ajouter popups avec infos trajets
- [ ] Optimiser les performances (cache, loading progressif)

---

## 🚀 Fonctionnalités futures possibles

### Backend
- [ ] WebSockets pour notifications temps réel (au lieu de polling)
- [ ] Système de paiement intégré (Stripe)
- [ ] API publique pour intégrations tierces
- [ ] Notifications push mobile

### Frontend
- [ ] PWA (Progressive Web App)
- [ ] Mode hors ligne
- [ ] Dark mode
- [ ] Animations avancées

### Business
- [ ] Vérification d'identité (KYC)
- [ ] Assurance trajets
- [ ] Programme de parrainage
- [ ] Tableau de bord admin avancé

---

## ✅ Déjà fait

- [x] Authentification complète
- [x] Gestion trajets (CRUD)
- [x] Système de réservations
- [x] Accepter/refuser demandes
- [x] Système d'avis et notes (1-5 étoiles)
- [x] Messagerie instantanée
- [x] Notifications avec badge
- [x] Export PDF factures
- [x] Analytics & statistiques
- [x] Multi-langue (FR, EN, ES, IT)
- [x] Profil avec réputation
- [x] Historique complet
- [x] Filtres avancés
- [x] Design moderne glassmorphism

---

**Dernière mise à jour** : 27 janvier 2026
