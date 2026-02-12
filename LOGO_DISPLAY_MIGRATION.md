# Migration: Ajout du champ show_logo_in_listings

## ⚠️ IMPORTANT - À FAIRE MANUELLEMENT

Le champ `show_logo_in_listings` doit être ajouté à la table `profiles` dans Supabase.

### Étapes:

1. **Allez à votre console Supabase**
   - URL: https://supabase.com/dashboard
   - Sélectionnez votre projet

2. **Ouvrez l'éditeur SQL**
   - Cliquez sur "SQL Editor" dans le menu latéral
   - Cliquez sur "New Query"

3. **Exécutez ce code SQL:**

```sql
-- Add show_logo_in_listings column to profiles table
ALTER TABLE profiles ADD COLUMN show_logo_in_listings BOOLEAN DEFAULT false;

-- Create index for faster queries
CREATE INDEX idx_profiles_show_logo_in_listings ON profiles(show_logo_in_listings);
```

4. **Cliquez sur "Run"**

### ✅ Après la migration:

- Le toggle "Afficher le logo dans les annonces" fonctionnera
- Les vendeurs pourront activer/désactiver l'affichage du logo
- Les logos s'afficheront dans les cartes annonces (h-16) et pages détail (h-20)

### 🔍 Vérification:

Pour vérifier que la migration a fonctionné:

```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name='profiles' AND column_name='show_logo_in_listings';
```

Vous devriez voir une ligne avec:
- column_name: `show_logo_in_listings`
- data_type: `boolean`
