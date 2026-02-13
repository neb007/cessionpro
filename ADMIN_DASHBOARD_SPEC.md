# Admin Dashboard Spec — CessionPro

Cette documentation décrit les **features**, la **sécurité d’accès**, les **règles métier**, et les **données minimales** pour l’interface d’administration des annonces.

---
## 1) Objectif
Mettre en place un dashboard admin pour **modérer, approuver, publier, certifier ou désactiver** des annonces avant mise en ligne.

---
## 2) Accès & Sécurité (Supabase)
### Accès recommandé
- **Compte admin unique + MFA** (authentication Supabase).
- **Contrôle obligatoire côté backend** : chaque action admin doit vérifier le rôle `admin`.

### Options d’implémentation
- **Role-based access** : `role = 'admin'` dans `auth.users.app_metadata` ou table `profiles`.
- **Whitelist d’emails** (option rapide) : `ADMIN_EMAILS=...`, mais **toujours** validée côté backend.

### Route d’accès
- Route interne recommandée : `/admin/annonces`

---
## 3) Dashboard — KPIs & filtres
### KPIs (en haut de page)
- **En attente** (`PENDING`)
- **Signalées** (`FLAGGED`)
- **Actives** (`ACTIVE`)

### Filtres
- Filtre de source : `All | Natives | Importées`
  - **Natives** = utilisateurs CessionPro
  - **Importées** = scraping (CessionPME, Fusacq)

### UX recommandé
- Bouton “Rafraîchir” + timestamp de dernière mise à jour

---
## 4) Table de gestion des annonces
### Colonnes minimales
- **Aperçu** : miniature photo principale (avec watermark)
- **Titre & Catégorie**
- **Vendeur/Source** : nom utilisateur ou logo source
- **Date** : date de soumission (DD/MM/YYYY)
- **Statut** : badge coloré
  - `PENDING` = orange
  - `ACTIVE` = vert
  - `DISABLED` = rouge
  - `FLAGGED` = violet (optionnel)

### UX recommandé
- Recherche par titre
- Tri par date
- Pagination

---
## 5) Actions de modération
### ✅ Approuver
- Passe le statut en `ACTIVE`
- Déclenche l’email “Annonce publiée”

### ❌ Refuser
- Ouvre une modale avec motifs + champ libre
- Passe le statut en `REJECTED`
- Envoie un email avec motif de refus

### 🛡️ Badge “Certifié”
- Toggle `is_certified = true/false`
- Affiché sur l’annonce publique

### 👁️ Quick View
- Modale preview “vue acheteur”

### 🧨 Kill Switch (Désactiver)
- Passe le statut en `DISABLED`
- Retire l’annonce du site public sans suppression

---
## 6) Règles métier backend
- **Lock editing** : si `PENDING`, l’utilisateur ne peut pas modifier l’annonce.
- **Traçabilité** : log admin sur chaque action (approved_by, rejected_by, action_date).
- **Notifications** : emails déclenchés côté backend (pas côté front).

---
## 7) Modèle de données minimal
```ts
Annonce {
  id
  title
  category
  main_image
  source_type: NATIVE | SCRAPED
  source_name: CessionPME | Fusacq | user
  submitted_at
  status: PENDING | ACTIVE | DISABLED | REJECTED | FLAGGED
  is_certified: boolean
  rejected_reason?: string
}
```

---
## 8) Critères de succès
- L’admin peut **approuver/refuser/désactiver/certifier** depuis la table.
- Les statuts sont visibles et mis à jour en temps réel.
- Le refus exige un motif.
- Les annonces `PENDING` sont verrouillées côté utilisateur.
- Les emails sont envoyés automatiquement.

---
## 9) Roadmap (optionnel)
### MVP
- KPIs + table + actions de modération + sécurité backend

### V2 recommandé
- Recherche + filtres avancés + pagination

### V3 avancé
- Règles automatiques + modération collaborative + historique détaillé
