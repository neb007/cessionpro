# Guide d'Intégration Supabase - Cessionpro

## 📋 Vue d'ensemble

Ce guide explique comment les tables Supabase ont été intégrées à l'application Cessionpro. L'application est maintenant connectée à Supabase pour :
- **Authentification** : Gestion des utilisateurs via Supabase Auth
- **Base de données** : Stockage de toutes les données (Businesses, Leads, Messages, Conversations, Favorites)
- **Sécurité** : Row Level Security (RLS) pour contrôler l'accès aux données

---

## 🚀 Instructions de Setup

### 1. Configuration initiale (Déjà faite ✅)

- ✅ Package `@supabase/supabase-js` installé
- ✅ Variables d'environnement configurées dans `.env.local`
- ✅ Client Supabase créé (`src/api/supabaseClient.js`)
- ✅ AuthContext remplacé par Supabase Auth

### 2. Créer les tables dans Supabase

Pour que l'application fonctionne, vous devez créer les tables dans votre base de données Supabase.

#### Option A: Via l'éditeur SQL de Supabase (Recommandé)

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Ouvrez **SQL Editor** (dans la barre latérale)
4. Cliquez sur **New Query**
5. Copiez le contenu de `supabase_setup.sql` et collez-le
6. Cliquez sur **Run** ou **⌘+Entrée**

#### Option B: Via la CLI Supabase

```bash
# Installer la CLI Supabase
npm install -g supabase

# Se connecter à votre compte
supabase login

# Exécuter le script SQL
supabase db push

# Ou copier-coller le contenu du fichier directement
```

### 3. Vérifier la création des tables

Après avoir exécuté le script SQL, vérifiez que les tables ont été créées :
- `profiles` - Profils utilisateurs
- `businesses` - Annonces d'entreprises
- `leads` - Pistes commerciales
- `conversations` - Conversations entre utilisateurs
- `messages` - Messages dans les conversations
- `favorites` - Entreprises marquées comme favorites

---

## 📁 Structure des fichiers créés

### Authentification
```
src/lib/AuthContext.jsx      // Contexte d'authentification Supabase
```

### Services API
```
src/services/
  ├── businessService.js       // Opérations CRUD pour les businesses
  ├── leadService.js           // Opérations CRUD pour les leads
  ├── messageService.js        // Opérations CRUD pour les messages
  ├── conversationService.js   // Opérations CRUD pour les conversations
  └── favoriteService.js       // Opérations CRUD pour les favoris
```

### Configuration
```
src/api/supabaseClient.js     // Initialisation du client Supabase
.env.local                     // Variables d'environnement
supabase_setup.sql            // Script de création des tables
```

---

## 🔐 Sécurité et Row Level Security (RLS)

Toutes les tables ont le **Row Level Security (RLS)** activé. Voici comment cela fonctionne :

### Businesses
- ✅ Tous peuvent voir les annonces **actives**
- ✅ Le vendeur peut voir ses propres annonces (même en brouillon)
- ✅ Seul le vendeur peut modifier/supprimer ses annonces

### Leads
- ✅ Les acheteurs peuvent voir leurs propres pistes
- ✅ Les vendeurs peuvent voir les pistes pour leurs annonces
- ✅ Seul l'acheteur peut modifier ses pistes

### Conversations & Messages
- ✅ Seuls les participants peuvent voir la conversation
- ✅ Les utilisateurs peuvent envoyer des messages uniquement dans leurs conversations

### Favorites
- ✅ Chaque utilisateur voit seulement ses favoris

---

## 💻 Utilisation des Services

### Exemple 1: Créer une annonce d'entreprise

```javascript
import { businessService } from '@/services/businessService';

const createBusiness = async () => {
  try {
    const data = await businessService.createBusiness({
      title: "Boulangerie à vendre",
      description: "Boulangerie bien établie...",
      sector: "retail",
      asking_price: 50000,
      location: "Paris",
      country: "france"
    });
    console.log("Business créé:", data);
  } catch (error) {
    console.error("Erreur:", error);
  }
};
```

### Exemple 2: Récupérer les messages d'une conversation

```javascript
import { messageService } from '@/services/messageService';

const getMessages = async (conversationId) => {
  try {
    const messages = await messageService.listMessages(conversationId);
    console.log("Messages:", messages);
  } catch (error) {
    console.error("Erreur:", error);
  }
};
```

### Exemple 3: S'abonner aux messages en temps réel

```javascript
import { messageService } from '@/services/messageService';

const subscription = messageService.subscribeToMessages(conversationId, (newMessage) => {
  console.log("Nouveau message:", newMessage);
});

// Les messages s'ajoutent en temps réel !
```

### Exemple 4: Ajouter/Retirer des favoris

```javascript
import { favoriteService } from '@/services/favoriteService';

// Basculer le statut "favori"
const toggleFav = async (businessId) => {
  await favoriteService.toggleFavorite(businessId);
};

// Ou ajouter directement
const addFav = async (businessId) => {
  await favoriteService.addFavorite(businessId);
};
```

---

## 🔌 Intégration avec React Query

L'application utilise déjà **React Query** pour gérer le cache et la synchronisation des données. Vous pouvez créer des hooks personnalisés :

```javascript
// hooks/useBusinesses.js
import { useQuery } from '@tanstack/react-query';
import { businessService } from '@/services/businessService';

export const useBusinesses = (filters) => {
  return useQuery({
    queryKey: ['businesses', filters],
    queryFn: () => businessService.listBusinesses(filters)
  });
};

// Utilisation dans un composant
const MyComponent = () => {
  const { data: businesses, isLoading } = useBusinesses({ sector: 'retail' });
  
  if (isLoading) return <div>Chargement...</div>;
  return <div>{businesses?.length} annonces trouvées</div>;
};
```

---

## 🔄 Flux d'Authentification

### Inscription
```javascript
const { register } = useAuth();
await register('user@example.com', 'password123');
```

### Connexion
```javascript
const { login } = useAuth();
await login('user@example.com', 'password123');
```

### Déconnexion
```javascript
const { logout } = useAuth();
await logout();
```

### Accès à l'utilisateur actuel
```javascript
const { user, isAuthenticated } = useAuth();
console.log(user.email); // Email de l'utilisateur authentifié
```

---

## 📊 Structure des Tables

### Table `profiles`
```sql
id              UUID (PRIMARY KEY)
email           TEXT
full_name       TEXT
avatar_url      TEXT
role            TEXT ('buyer', 'seller', 'both')
company_name    TEXT
phone           TEXT
bio             TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Table `businesses`
```sql
id                      UUID (PRIMARY KEY)
seller_id               UUID (FOREIGN KEY)
title                   TEXT * (required)
description             TEXT
sector                  TEXT
asking_price            DECIMAL
annual_revenue          DECIMAL
ebitda                  DECIMAL
employees               INTEGER
location                TEXT * (required)
country                 TEXT
region                  TEXT
status                  TEXT ('draft', 'active', 'pending', 'sold', 'withdrawn')
confidential            BOOLEAN
views_count             INTEGER
financial_years         JSONB
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

### Table `leads`
```sql
id              UUID (PRIMARY KEY)
buyer_id        UUID (FOREIGN KEY)
business_id     UUID (FOREIGN KEY)
status          TEXT ('new', 'contacted', 'interested', 'negotiating', 'closed')
notes           TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Table `conversations`
```sql
id              UUID (PRIMARY KEY)
participant_1_id UUID (FOREIGN KEY)
participant_2_id UUID (FOREIGN KEY)
business_id     UUID (FOREIGN KEY, nullable)
subject         TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Table `messages`
```sql
id              UUID (PRIMARY KEY)
conversation_id UUID (FOREIGN KEY)
sender_id       UUID (FOREIGN KEY)
content         TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Table `favorites`
```sql
id              UUID (PRIMARY KEY)
user_id         UUID (FOREIGN KEY)
business_id     UUID (FOREIGN KEY)
created_at      TIMESTAMP
```

---

## ⚠️ Points importants

1. **Authentification requise**: La plupart des opérations nécessitent un utilisateur authentifié
2. **RLS activé**: Les politiques de sécurité s'appliquent automatiquement
3. **Timestamps**: Les champs `created_at` et `updated_at` sont gérés automatiquement
4. **Indexes créés**: Pour optimiser les performances des requêtes

---

## 🆘 Dépannage

### Erreur: "Missing Supabase credentials"
➜ Vérifiez que `.env.local` contient `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

### Erreur: "Tables not found"
➜ Exécutez le script `supabase_setup.sql` dans l'éditeur SQL de Supabase

### Erreur: "Unauthorized" lors de l'accès aux données
➜ Vérifiez que l'utilisateur est authentifié avec `useAuth()`

### Les modifications ne se sauvegardent pas
➜ Vérifiez les politiques RLS pour les permissions d'écriture

---

## 📚 Ressources utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ✅ Prochaines étapes

1. **Exécutez `supabase_setup.sql`** dans votre Dashboard Supabase
2. **Testez l'authentification** en créant un nouvel utilisateur
3. **Créez une annonce** pour tester les opérations CRUD
4. **Intégrez les services** dans vos pages React

Bonne chance ! 🚀
