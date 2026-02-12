# Instructions: Fix Logo Display in BusinessDetails

## Problem
Le logo ne s'affiche pas dans BusinessDetails. Deux causes possibles:

1. **Base44 API** - Les données peuvent être stockées via base44 et non directement dans Supabase
2. **Colonnes manquantes** - Les colonnes `logo_url` et `show_logo_in_listings` n'existent pas

## Solution

### Étape 1: Vérifier le Schema Supabase
1. Allez à https://supabase.com
2. SQL Editor → New Query
3. Exécutez:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema='public';
```

Cela montrera le vrai nom de la table business (peut être `businesses`, `announcements`, etc.)

### Étape 2: Ajouter les Colonnes
Une fois le nom trouvé, adaptez et exécutez la migration avec le bon nom de table.

### Étape 3 (Alternative)
Si les données viennent de base44 API:
- Les champs doivent être ajoutés via la configuration base44
- Contactez le support base44 pour ajouter `logo_url` et `show_logo_in_listings`

## Vérification
Après correction:
- Rechargez: `/BusinessDetails?id=c7007a11-855b-4102-a9ae-9e69ebc0c919`
- Le logo devrait s'afficher sous "Favoris" et "Partage"
