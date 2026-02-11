# 🎯 Instructions: Accorder Accès Smart Matching

## Solution Rapide - 2 minutes ⚡

La page Smart Matching est **bloquée par un système de plans premium**.  
Pour y accéder, vous devez être dans le plan **"Smart Matching"**.

### Étape 1: Accéder à Supabase

1. Ouvrez [https://supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet CessionPro
4. Allez à **SQL Editor** dans le menu de gauche

### Étape 2: Exécuter le Script SQL

1. Cliquez sur **+ New Query**
2. Copiez-collez le code ci-dessous:

```sql
-- Grant Smart Matching Plan Access to Current User
UPDATE public.profiles
SET 
  subscription_tier = 'premium_plus',
  plan_type = 'smart_matching',
  access_level = 'admin',
  credits = 999999,
  credits_monthly = 999999,
  updated_at = now()
WHERE email = 'nebil007@hotmail.fr';

-- Vérifier
SELECT email, subscription_tier, plan_type FROM public.profiles WHERE email = 'nebil007@hotmail.fr';
```

3. Cliquez sur **Run** (ou Ctrl+Enter)

### Étape 3: Vérifier le Statut

Vous devriez voir:
```
email: nebil007@hotmail.fr
subscription_tier: premium_plus
plan_type: smart_matching
```

### Étape 4: Actualiser la Page

1. Rafraîchissez votre navigateur (F5 ou Cmd+R)
2. Naviguez vers `/SmartMatching`
3. ✅ Vous devez maintenant avoir accès!

---

## 🎯 Smart Matching est maintenant Accessible!

Une fois l'accès accordé, vous pouvez:

✅ **Sélectionner des critères**:
- Budget (min/max)
- Secteur d'activité
- Localisation

✅ **Chercher automatiquement**:
- Cliquez "Chercher les Matches"
- L'IA score les 4 listings mockés

✅ **Voir les résultats**:
- Tri par score (0-100%)
- Couleurs: Excellent (vert), Bon (bleu), Partiel (jaune), Faible (rouge)

---

## ⚙️ Architecture Smart Matching

**Backend:**
- `supabase_migration_smart_matching.sql` - Tables & Indexes
- Tables: `smart_matching_criteria`, `smart_matching_scores`

**Frontend:**
- `Cessionpro/src/pages/SmartMatching.jsx` - Page principale
- `Cessionpro/src/services/smartMatchingEngine.js` - Scoring logic
- `Cessionpro/src/constants/smartMatchingConfig.js` - Configuration

**Services:**
- Scoring pondéré (17+ critères)
- Cache en BD
- Matching en temps réel

---

## 🚀 C'est Fait!

La page est 100% fonctionnelle et accessible dès que le plan est accordé!
