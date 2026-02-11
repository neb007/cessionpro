# 🚀 Déploiement - Système de Profils Hybrides Acheteur/Vendeur

## ✅ Ce Qui a Été Créé

### 1. **Migration Database** ✅
- **Fichier:** `supabase_migration_hybrid_profiles.sql`
- **Location:** `/home/ubuntu/Bureau/Cessionpro/`
- **Fonctionalités:**
  - Ajout colonnes `is_buyer` et `is_seller` (BOOLEAN)
  - Contrainte CHECK pour garantir au moins 1 rôle actif
  - Migration auto depuis ancien `user_goal` field
  - Indexes pour performance

### 2. **Service Complet** ✅
- **Fichier:** `Cessionpro/src/services/profileService.js`
- **Fonctionalités:**
  - `getProfile(userId)` - Récupère profil complet
  - `updateBuyerProfile(userId, data)` - Met à jour infos acheteur
  - `updateSellerProfile(userId, data)` - Met à jour infos vendeur
  - `uploadProfileDocument(userId, type, file)` - Upload CV/Documents
  - `deleteProfileDocument(userId, type)` - Supprime documents
  - `enableBuyerRole()`, `enableSellerRole()` - Active rôles
  - `disableBuyerRole()`, `disableSellerRole()` - Désactive rôles
  - Validation pour éviter profils sans rôles

### 3. **Page Profile Moderne** ✅
- **Fichier:** `Cessionpro/src/pages/Profile.jsx`
- **Design:** Option B - Moderne & Épuré
- **Layout:**
  - Grille 2 colonnes responsive
  - Colonne gauche: Formulaires (2/3)
  - Colonne droite: Résumé sticky
- **Champs Affichés:**
  - ✅ Infos Communes: Prénom, Nom, Téléphone, Entreprise, Localisation
  - ✅ Type Profil: Dropdown (Acheteur/Vendeur/Cabinet)
  - ✅ Langue Préférée
  - ✅ Présentation & Expérience
  - ✅ Secteurs d'intérêt (si Acheteur)
  - ✅ Budget Min/Max (si Acheteur)
  - ✅ Motivation pour reprise (si Acheteur)
  - ✅ LinkedIn URL (si Acheteur)
  - ✅ CV & Documents Financement (si Acheteur)
  - ✅ Entreprise (si Vendeur)

---

## 📋 Étapes de Déploiement

### **Étape 1: Migration Database** (Obligatoire)

1. Allez dans **Supabase Dashboard** → **SQL Editor**
2. Créez une **nouvelle query**
3. **Copiez** le contenu de `/home/ubuntu/Bureau/Cessionpro/supabase_migration_hybrid_profiles.sql`
4. **Exécutez** la migration

```bash
# Alternative: Depuis CLI
supabase db push supabase_migration_hybrid_profiles.sql
```

**Résultat attendu:** ✅ Colonnes is_buyer et is_seller ajoutées à la table profiles

### **Étape 2: Vérifier les Chemins** (Important)

```
Cessionpro/
├── src/
│   ├── pages/
│   │   └── Profile.jsx          ✅ Créé
│   ├── services/
│   │   └── profileService.js    ✅ Créé
│   ├── lib/
│   │   └── AuthContext.jsx      ✅ Doit exister
│   ├── api/
│   │   └── supabaseClient.js    ✅ Doit exister
│   └── components/
│       └── ui/
│           ├── button.jsx       ✅ Doit exister
│           ├── input.jsx        ✅ Doit exister
│           ├── label.jsx        ✅ Doit exister
│           └── alert.jsx        ✅ Doit exister
```

### **Étape 3: Ajouter Route Profile** (Si nécessaire)

Dans `Cessionpro/src/pages.config.js` ou votre routeur:

```jsx
import Profile from './pages/Profile';

// Ajouter à vos routes:
{
  path: '/Profile',
  component: Profile,
  requiresAuth: true
}
```

### **Étape 4: Ajouter Navigation** (Si nécessaire)

Dans votre Sidebar/Navigation, ajouter lien:

```jsx
<NavLink to="/Profile">Mon Profil</NavLink>
```

---

## 🧪 Tests de Vérification

### Test 1: Accès à la Page
- [ ] Naviguer vers `/Profile`
- [ ] Page charge sans erreurs
- [ ] Données du profil s'affichent

### Test 2: Affichage par Rôle
- [ ] **Acheteur seul:** Sections communes + acheteur (bleu)
- [ ] **Vendeur seul:** Sections communes + vendeur
- [ ] **Hybride:** Sections communes + acheteur + vendeur

### Test 3: Édition & Sauvegarde
- [ ] Cliquer "Modifier"
- [ ] Éditer un champ (ex: Prénom)
- [ ] Sauvegarder
- [ ] ✅ Données persistées

### Test 4: Changement de Type Profil
- [ ] En édition, changer dropdown "Type de profil"
- [ ] Sauvegarder
- [ ] ✅ is_buyer/is_seller mis à jour en base
- [ ] ✅ Sections visibles changent

### Test 5: Upload Document
- [ ] Cliquer "Upload CV"
- [ ] Sélectionner un PDF/Word
- [ ] ✅ Document uploadé
- [ ] ✅ Lien de téléchargement apparaît

### Test 6: Suppression Document
- [ ] Cliquer X sur document
- [ ] Confirmer
- [ ] ✅ Document supprimé

---

## 🎨 Charte Couleur Utilisée

```
Profil Acheteur:  🔵 bg-blue-50 / border-blue-100 / text-blue-900
Profil Vendeur:   ⚪ bg-white / gray theme
Résumé:           🎨 gradient from-primary/5 to-primary/10
```

---

## 📊 Structure des Données

### Colonnes Créées en Base
```sql
is_buyer BOOLEAN DEFAULT false          -- Acheteur actif?
is_seller BOOLEAN DEFAULT false         -- Vendeur actif?
-- Minimum 1 doit être TRUE
```

### Données Sauvegardées

**Acheteur:**
- sectors (array)
- motivation_reprise
- experience_professionnelle
- linkedin_url
- aide_vendeur_description
- cv_document_url, cv_document_name
- financing_document_url, financing_document_name

**Vendeur:**
- company_name
- (common fields: transaction_size, profile_type, phone, etc)

**Communs:**
- first_name, last_name
- phone
- transaction_size
- profile_type
- language_preference

---

## 🚨 Troubleshooting

### Problème: "Cannot find module profileService"
**Solution:** Vérifier que `Cessionpro/src/services/profileService.js` existe

### Problème: "Cannot find module supabaseClient"
**Solution:** Vérifier que `Cessionpro/src/api/supabaseClient.js` existe et est configuré

### Problème: Données ne se chargent pas
**Solution:** 
1. Ouvrir Console (F12)
2. Chercher erreurs Supabase
3. Vérifier RLS policies sur table profiles

### Problème: Upload document échoue
**Solution:**
1. Vérifier bucket 'profile' existe en Supabase Storage
2. Vérifier RLS policies sur storage bucket
3. Limits: PDF/Word, Max 5MB

---

## ✨ Fonctionalités Futures

- [ ] Smart matching basé sur is_buyer/is_seller
- [ ] Filtrer annonces par rôle
- [ ] Email notifications par rôle
- [ ] Commission tracking hybride
- [ ] Analytics conversion single→hybrid

---

## 📞 Support

**Fichiers de Documentation:**
- `HYBRID_PROFILE_SYSTEM_GUIDE.md` - Guide détaillé
- `INTEGRATION_HYBRID_PROFILE_SUMMARY.md` - Architecture
- `supabase_migration_hybrid_profiles.sql` - Schéma DB

---

**Status:** ✅ PRÊT POUR DÉPLOIEMENT

**Dernière mise à jour:** 11/02/2026
