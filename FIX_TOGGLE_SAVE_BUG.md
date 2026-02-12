# 🔧 Guide de correction du bug du Toggle

## ✅ Étape 1 - Ajouter le débogage (FAIT)

J'ai ajouté des logs de débogage dans:
- `Profile.jsx` - voir les logs quand vous cliquez sur Enregistrer
- `profileService.js` - voir les données envoyées à Supabase

## 🔍 Étape 2 - Ouvrir la console du navigateur

1. Ouvrez votre page Profile
2. Appuyez sur **F12** (ou Cmd+Option+I sur Mac)
3. Allez à l'onglet **Console**
4. Voilà les messages de débogage s'afficheront

## 🎯 Étape 3 - Tester l'enregistrement

1. Allez à **Mon Profil > Mon Profil Vendeur**
2. Mettez vous en **Mode d'édition** (Modifier)
3. Cliquez sur le **toggle** "Afficher le logo dans les annonces"
4. Cliquez sur **Enregistrer**
5. **Regardez la console** pour voir les logs

### Vérifiez les logs:

**Si vous voyez:**
- ✅ "🔹 Saving profile..." → C'est bon
- ✅ "✅ updateSellerProfile result:" → C'est OK
- ❌ Aucun log après "Enregistrer" → Le toggle n'est pas activé correctement

## 🔐 Étape 4 - Vérifier les RLS Policies

Si les logs montrent que les données sont envoyées MAIS ne se sauvegardent pas, c'est probablement un problème de **Row Level Security (RLS)**.

### Allez à Supabase:

1. Ouvrez **Supabase Dashboard**
2. Allez à **Table Editor > profiles**
3. Allez à l'onglet **RLS** (en haut)
4. Vérifiez qu'il existe une policy pour permettre **UPDATE**

### Les policies doivent autoriser:

```
- SELECT (lire)
- INSERT (créer)
- UPDATE (modifier) ← C'EST CRUCIAL
- DELETE (supprimer)
```

## 🔧 Étape 5 - Si UPDATE n'existe pas

**Si vous ne voyez pas une policy pour UPDATE:**

Allez à **SQL Editor** et exécutez:

```sql
-- Vérifier les policies existantes
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Si UPDATE manque, ajouter une policy UPDATE simple
CREATE POLICY "Allow users to update their own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

## 📝 Compte-rendu à me donner

Après avoir suivi ces étapes, dites-moi:

1. **Quels logs voyez-vous** dans la console?
2. **Le toggle s'enregistre-t-il maintenant?**
3. **Avez-vous dû ajouter une policy UPDATE?**

Cela m'aidera à comprendre exactement où est le problème.
