# Spécifications de l'Outil de Valorisation Riviqo (Standard "Expertise M&A & Administration Fiscale")

## 1. Objectif et Positionnement
Créer un outil de valorisation de qualité institutionnelle (Investment Banking / Cabinet d'audit), adapté aux actifs digitaux et **conforme aux doctrines de l'administration fiscale française (Bercy)**.
**Promesse :** Obtenir une valorisation rigoureuse combinant les méthodes M&A modernes (Multiples, SDE) et les **méthodes traditionnelles reconnues par l'administration fiscale**. Cela apporte une crédibilité absolue (ex: pour une justification de prix lors d'un OBO, d'une donation, ou d'un contrôle).
**Modèle d'acquisition :** Résultat partiel affiché, et envoi d'un "Rapport d'Évaluation Préliminaire" (PDF) en échange d'informations de contact.

## 2. L'Architecture Financière (L'Approche Multi-Critères Mixte)

Pour offrir un calcul scientifique irréprochable et robuste, l'algorithme va croiser trois grandes familles de valorisation : l'Approche Comparative (Marché), l'Approche Patrimoniale (Fiscale/Bercy) et **l'Approche de Rentabilité (Flux de trésorerie)**.

### A. L'Approche Fondée sur la Rentabilité (Incontournable en M&A)
C'est la méthode reine pour déterminer la "valeur d'usage" d'une entreprise basée sur sa capacité future à générer du cash pour un repreneur.
1. **DCF Simplifié (Discounted Cash Flows) :**
   * L'outil demande (ou estime via l'historique) le taux de croissance du Résultat / Cash Flow sur les 3 à 5 prochaines années.
   * Il actualise ces flux futurs avec un **WACC (Coût Moyen Pondéré du Capital)** adapté au risque du secteur digital (généralement entre 12% et 20% pour une PME/Startup non cotée).
   * Formule : Somme des flux de trésorerie actualisés + Valeur Terminale.
2. **Capitalisation des Bénéfices (Vision Pratique) :**
   * Prends le Bénéfice Net (ou Flux de Trésorerie Libre) normatif de l'année N, divisé par un taux de capitalisation reflétant la perpétuité de l'entreprise.

### B. L'Approche Comparative (La Vision Transactionnelle / Marché)
1. **Méthode des Multiples (Market Multiples) :**
   * Multiple d'EBE (EBITDA), Multiple de SDE (Seller's Discretionary Earnings) ou Multiple d'ARR (Annual Recurring Revenue) selon le modèle économique choisi par l'utilisateur (SaaS, E-commerce, Agence).
   * Les multiples sont pondérés via un "Scoring de Risques" qualitatif (dépendance, concentration client).

### C. L'Approche Patrimoniale (La Vision "Bercy" / Valeur Plancher)
1. **La Valeur Mathématique (Actif Net Réévalué - ANR) :**
   * C'est le socle : Capitaux Propres + Réserves + Trésorerie - Dettes.
2. **La Méthode Mixte (Praticiens / Fiscale) :**
   * L'algorithme fait la moyenne entre la **Valeur Mathématique** et la **Valeur de Rendement** pour offrir un chiffre opposable à l'administration fiscale française. `(Valeur Mathématique + Valeur de Rendement) / 2`.
---

## 3. Le Parcours Utilisateur (Le "Due Diligence" Express)

Le formulaire collecte les données nécessaires aux deux mondes (M&A et Fisc) sans être trop lourd.

### Étape 1 : Profil & Business Model (Approche Marché)
* Modèle économique (SaaS, E-commerce, Agence, etc.).
* Secteur et Année de création.

### Étape 2 : Le Compte de Résultat (L'Approche Rendement)
* CA HT.
* EBE (EBITDA).
* **Bénéfice Net Courant (RN)** *<- Nouveau champ crucial pour les méthodes de Bercy (Capitalisation des bénéfices).*
* Rémunération du dirigeant.

### Étape 3 : Le Haut et Bas de Bilan (L'Approche Patrimoniale)
* **Capitaux Propres (Fonds Propres)** *<- Nouveau champ crucial (Valeur Mathématique).*
* Trésorerie & Valeur des Stocks.
* Dettes Financières.

### Étape 4 : Le Scoring de Qualité & Risque
* Pondère le "Taux de capitalisation" défini par Bercy en fonction :
  * Dépendance au dirigeant.
  * Récurrence du CA.
  * Concentration client.

### Étape 5 : L'Écran de Résultat (3 Valeurs en 1 seul écran)
* **Affichage unifié :** Le formulaire génère simultanément **3 résultats distincts** sur un seul tableau de bord élégant :
  1. **Valeur Fiscale (Bercy) :** "Base patrimoniale opposable à l'administration" (La fourchette basse).
  2. **Valeur de Marché (M&A) :** "Prix de cession estimé sur votre secteur" (La fourchette médiane).
  3. **Valeur de Rentabilité (DCF) :** "Valeur d'usage basée sur vos flux futurs" (La fourchette haute).
* **Capture du Lead :** "Saisissez votre email pro pour débloquer le détail de ces 3 calculs et recevoir votre Mémorandum d'évaluation gratuit (PDF)."

---

## 4. Le Livrable (Rapport "Évaluation Hybride" PDF)
Le livrable devient un document de très haute valeur, utilisable non seulement pour vendre, mais aussi pour les formalités (pactes d'associés, levée, restructuration).
* **Page 1 : Synthèse de la Valorisation.** Fourchette de valeur avec indication de la "Valeur de Marché" vs "Valeur Patrimoniale".
* **Page 2 : Méthodologie M&A (Multiples de l'EBE/SDE).** Comment le marché valorise l'actif selon ses métriques (règle des 40, CAC, ARR).
* **Page 3 : Méthodologie de l'Administration Fiscale (Bercy).**
  * Détail du calcul de la Valeur Mathématique (ANR).
  * Détail du calcul de la Valeur de Rendement (Capitalisation des bénéfices).
  * Application de la Méthode des Praticiens (mix des deux).
* **Page 4 : Analyse des Risques (Décotes & Surcotes qualitatives).**
* **Page 5 : Appel à l'action vers Riviqo M&A.**
