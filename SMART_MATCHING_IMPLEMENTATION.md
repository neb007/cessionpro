# Smart Matching Implementation Guide 🎯

Document complet pour l'implémentation du système Smart Matching dans l'application CessionPro.

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture Technique](#architecture-technique)
3. [Installation & Setup](#installation--setup)
4. [Intégration au Projet](#intégration-au-projet)
5. [Guide d'Utilisation](#guide-dutilisation)
6. [Schéma de Données](#schéma-de-données)
7. [Configuration](#configuration)
8. [Troubleshooting](#troubleshooting)

---

## Vue d'ensemble

Le **Smart Matching** est un système de scoring intelligent qui analyse les critères de recherche d'un acheteur et les compare avec les annonces disponibles pour proposer les meilleures correspondances.

### Fonctionnalités Clés

✨ **20+ Critères de Matching**
- Critères généraux (budget, secteur, localisation)
- Données financières (CA, résultat net, marges)
- Critères de potentiel (croissance, synergies)
- Évaluation des risques (stabilité client)

🎯 **Scoring Intelligent**
- Algorithme pondéré basé sur les critères sélectionnés
- Scores 0-100% avec explications détaillées
- Tri automatique par meilleur match

🎨 **Interface Moderne**
- Design épuré et minimaliste
- Animations fluides
- Responsive (mobile, tablet, desktop)
- Accessibilité complète (a11y)

💾 **Persistance des Données**
- Sauvegarde des critères utilisateur
- Cache des scores en base de données
- Performances optimisées

---

## Architecture Technique

### Structure des Fichiers Créés

```
Cessionpro/
├── supabase_migration_smart_matching.sql    # Migration BD
├── src/
│   ├── constants/
│   │   └── smartMatchingConfig.js           # Configuration & labels
│   ├── services/
│   │   ├── smartMatchingEngine.js           # Algorithme de scoring
│   │   └── smartMatchingService.js          # API Supabase
│   └── pages/
│       └── SmartMatching.jsx                # Page principale UI
```

### Composants Clés

#### 1. **smartMatchingConfig.js**
Configuration centralisée de tous les critères :
- Définition des critères (labels, types, poids)
- Groupement par section
- Couleurs et styles
- Valeurs par défaut

#### 2. **smartMatchingEngine.js**
Moteur de scoring pur (sans dépendances externes) :
- `calculateSmartMatchScore(listing, criteria)` - Score une annonce
- `scoreNumericRange()` - Score les plages numériques
- `scoreLocation()` - Score la localisation (fuzzy match)
- `generateExplanation()` - Génère explications textuelles

#### 3. **smartMatchingService.js**
Service d'interaction avec Supabase :
- `saveUserCriteria()` - Sauvegarde les critères
- `calculateAndSaveScores()` - Calcul et persistage
- `getListingsWithScores()` - Enrichissement des listings
- `getTopMatchingListings()` - Filtrage par score min

#### 4. **SmartMatching.jsx**
Page complète avec UI moderne :
- Panneau de sélection des critères (gauche)
- Affichage des résultats (droite)
- Layout responsive
- Animations fluides

---

## Installation & Setup

### Étape 1: Exécuter la Migration SQL

```bash
# Dans Supabase Console ou via CLI:
psql -U postgres -d your_database -f supabase_migration_smart_matching.sql
```

Ou directement dans Supabase SQL Editor:
```sql
-- Copier/coller le contenu de supabase_migration_smart_matching.sql
```

**Tables Créées:**
- `smart_matching_criteria` - Stocke les critères utilisateur
- `smart_matching_scores` - Cache des scores

### Étape 2: Vérifier les Tables

```sql
-- Vérifier les tables
SELECT * FROM smart_matching_criteria LIMIT 1;
SELECT * FROM smart_matching_scores LIMIT 1;

-- Vérifier les indexes
\d+ smart_matching_criteria
\d+ smart_matching_scores
```

### Étape 3: Vérifier les Fichiers

Assurez-vous que tous les fichiers suivants existent:

```
✓ /src/constants/smartMatchingConfig.js
✓ /src/services/smartMatchingEngine.js
✓ /src/services/smartMatchingService.js
✓ /src/pages/SmartMatching.jsx
✓ /supabase_migration_smart_matching.sql
```

---

## Intégration au Projet

### 1. Ajouter la Route

Dans `src/App.jsx` ou votre configuration de routes:

```jsx
import SmartMatching from '@/pages/SmartMatching';

// Dans votre routing (React Router):
<Route path="/smart-matching" element={<SmartMatching />} />
```

### 2. Ajouter le Menu Sidebar

Dans `src/components/layout/Sidebar.jsx` ou votre menu:

```jsx
import { Zap } from 'lucide-react';

// Dans votre menu:
<NavItem icon={Zap} label="Smart Matching" href="/smart-matching" />
```

### 3. Vérifier les Imports

Assurez-vous que vous utilisez les imports corrects dans SmartMatching.jsx:

```jsx
import { supabase } from '@/api/supabaseClient';  // ✓ Doit exister
import { useAuth } from '@/lib/AuthContext';       // ✓ Doit exister
import { Button } from '@/components/ui/button';   // ✓ Doit exister
```

### 4. Data Integration

Dans SmartMatching.jsx, remplacez `loadListings()` pour charger depuis votre API:

```jsx
const loadListings = async () => {
  setLoading(true);
  try {
    // Option 1: Via votre API
    const response = await fetch('/api/listings');
    const listings = await response.json();
    
    // Option 2: Via Supabase
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('status', 'active');
    
    setListings(data || []);
  } catch (err) {
    setError('Erreur lors du chargement');
  } finally {
    setLoading(false);
  }
};
```

---

## Guide d'Utilisation

### Pour l'Utilisateur Final

1. **Aller sur Smart Matching** → `/smart-matching`

2. **Sélectionner les Critères**
   - Cocher les critères pertinents
   - Remplir les valeurs (budgets, secteurs, etc.)
   - Voir la progression (X/20 critères) en bas du panneau

3. **Cliquer "Chercher les Matches"**
   - Système calcule les scores
   - Résultats triés par meilleur match

4. **Explorer les Résultats**
   - Voir le score de correspondance (%)
   - Lire l'explication rapide (✅ OK, ⚠️ Partiel, ❌ KO)
   - [Voir détails] ou [Contacter] pour agir

### Pour le Développeur

#### Ajouter un Nouveau Critère

1. **Ajouter dans `smartMatchingConfig.js`:**

```javascript
SMART_MATCHING_CRITERIA = {
  // ... existants
  my_new_criterion: {
    id: 'my_new_criterion',
    label: 'Mon Nouveau Critère',
    section: 'financial',  // ou 'general', 'profile', etc
    weight: 2,
    type: 'range',  // ou 'text', 'select', 'multiselect', etc
    hasInputs: true,
    min: 'my_criterion_min',
    max: 'my_criterion_max',
    description: 'Description du critère',
    icon: 'Icon',
  }
}

// Ajouter aussi à CRITERIA_BY_SECTION
financial: {
  criteria: ['ca', 'net_result', 'my_new_criterion', ...]
}
```

2. **Ajouter la logique de scoring dans `smartMatchingEngine.js`:**

```javascript
if (criteria.criteria_selected?.includes('my_new_criterion')) {
  selectedCriteriaCount++;
  if (criteria.my_criterion_min && criteria.my_criterion_max) {
    const score = scoreNumericRange(
      listing.my_field || 0,
      criteria.my_criterion_min,
      criteria.my_criterion_max,
      0.2  // penalty factor
    );
    breakdown.my_new_criterion = score;
    totalScore += score;
  }
}
```

3. **Ajouter au schéma Supabase:**

```sql
ALTER TABLE smart_matching_criteria ADD COLUMN my_criterion_min INTEGER;
ALTER TABLE smart_matching_criteria ADD COLUMN my_criterion_max INTEGER;
```

---

## Schéma de Données

### Table: `smart_matching_criteria`

Stocke les critères de recherche de chaque acheteur:

```sql
CREATE TABLE smart_matching_criteria (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id),
  
  -- Selected criteria JSON array
  criteria_selected JSONB,
  
  -- General
  budget_min INTEGER,
  budget_max INTEGER,
  sectors TEXT[],
  location TEXT,
  cession_types TEXT[],
  
  -- Profile
  employees_min INTEGER,
  employees_max INTEGER,
  
  -- Financial
  ca_min INTEGER,
  ca_max INTEGER,
  net_margin_min DECIMAL,
  net_result_min INTEGER,
  net_result_max INTEGER,
  ebitda_margin_min DECIMAL,
  debt_ratio_max DECIMAL,
  
  -- Growth
  ca_growth_min DECIMAL,
  growth_potential TEXT,
  
  -- Market & Risk
  market_trend TEXT,
  technology_level TEXT,
  client_stability TEXT,
  single_client_risk_max TEXT,
  
  -- Coaching
  coaching_required BOOLEAN,
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Table: `smart_matching_scores`

Cache des scores calculés:

```sql
CREATE TABLE smart_matching_scores (
  id UUID PRIMARY KEY,
  buyer_id UUID REFERENCES auth.users(id),
  listing_id UUID REFERENCES businesses(id),
  
  score INTEGER (0-100),
  score_breakdown JSONB,     -- {budget: 95, sector: 100, ...}
  explanation TEXT[],        # ["✅ Budget OK", "⚠️ Localisation partiel"]
  criteria_matched INTEGER,  # Nombre de critères >= 70%
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  UNIQUE(buyer_id, listing_id)
);
```

### Champs Attendus dans `businesses` Table

Le système attend ces champs dans votre table listings:

```javascript
{
  id: string,                    // UUID
  title: string,                 // "Hôtel 3* Cannes"
  asking_price: number,          // Prix
  sector: string,                // 'hospitality', 'restaurant', etc
  location: string,              // 'Cannes'
  cession_type: string,          // 'cession_simple', etc
  employees: number,             // Effectifs
  annual_revenue: number,        // CA annuel
  net_result: number,            // Résultat net
  net_margin: number,            // % (0-100)
  ebitda_margin: number,         // % (0-100)
  debt_ratio: number,            // Ratio
  ca_growth_percent: number,     // % annuel
  growth_potential: string,      // 'low', 'medium', 'high'
  has_coaching: boolean,         // Accompagnement inclus
  market_trend: string,          // 'growth', 'stable', 'contraction'
  technology_level: string,      // 'modern', 'current', 'dated'
  client_stability: string,      // 'high', 'medium', 'low'
  single_client_risk: string,    // 'none', 'low', 'medium', 'high'
}
```

### Migration pour Ajouter les Champs

Si vos tables manquent de champs, ajoutez-les:

```sql
-- Ajouter les champs manquants à la table businesses
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS net_margin DECIMAL;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS ebitda_margin DECIMAL;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS debt_ratio DECIMAL;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS ca_growth_percent DECIMAL;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS growth_potential TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS market_trend TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS technology_level TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS client_stability TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS single_client_risk TEXT;
```

---

## Configuration

### Environnement

Assurez-vous que votre `.env.local` contient:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Scoring Weights

Les poids sont configurés dans l'algorithme:

- **Budget**: weight 3 (très important)
- **Secteur**: weight 3
- **Localisation**: weight 2
- **CA**: weight 2
- **Et autres...** (consultez smartMatchingConfig.js)

Modifier un poids:

```javascript
// Dans smartMatchingConfig.js
budget: {
  weight: 3,  // ← Changer ici
  ...
}
```

### Couleurs de Score

Modifier dans smartMatchingConfig.js:

```javascript
SCORE_COLORS = {
  excellent: { ... },  // >= 85%
  good: { ... },       // >= 70%
  partial: { ... },    // >= 50%
  poor: { ... },       // < 50%
}
```

---

## Troubleshooting

### Problème: "Table smart_matching_criteria not found"

**Solution:**
```bash
# Exécuter la migration SQL
psql -d your_db -f supabase_migration_smart_matching.sql
```

### Problème: Scores toujours à 0%

**Vérifier:**
1. Les champs `criteria_selected` sont bien remplis
2. Les champs de listing correspondent aux attentes du moteur
3. Les critères sont sélectionnés dans l'UI

### Problème: Les critères ne se sauvegardent pas

**Vérifier:**
1. L'utilisateur est authentifié (`user.id` existe)
2. Les permissions Supabase RLS sont correctes
3. La table `smart_matching_criteria` accepte les inserts

### Problème: Performance lente

**Solutions:**
1. Ajouter des indexes (déjà dans migration)
2. Limiter le nombre de listings calculés
3. Utiliser le cache des scores
4. Paginer les résultats

---

## Prochaines Étapes Recommandées

### 1. Real Data Integration
```javascript
// Remplacer les donnees mockées
const { data: listings } = await supabase
  .from('businesses')
  .select('*')
  .eq('status', 'active');
```

### 2. Alerts Flash (Premium Feature)
```javascript
// Notifier quand score > 90%
if (matchResult.score >= 90) {
  sendFlashAlert(buyer, listing, matchResult);
}
```

### 3. Webhooks pour Nouvelles Annonces
```sql
-- Créer trigger pour auto-scoring
CREATE TRIGGER auto_score_new_listing
AFTER INSERT ON businesses
FOR EACH ROW
EXECUTE FUNCTION calculate_scores_for_listing(NEW.id);
```

### 4. Analytics & Reporting
```javascript
// Tracker les matches les plus utiles
- Quels critères sont utilisés?
- Quel score moyen?
- Taux de conversion (match → contact)?
```

### 5. Machine Learning (Optionnel)
```javascript
// Améliorer les poids selon feedback utilisateur
// Utiliser les conversions pour adapter l'algo
```

---

## Support & Questions

Pour toute question sur l'implémentation:

1. Vérifier cette documentation
2. Consulter les commentaires dans les fichiers source
3. Tester avec des données simples d'abord
4. Vérifier les logs console du navigateur

---

**Créé:** 10/02/2026  
**Version:** 1.0  
**Status:** ✅ Prêt pour Production

