# Modèle Mathématique de l'Outil de Valorisation Riviqo

Ce document définit les règles de calcul exactes qui seront traduites en code (JavaScript/TypeScript) pour le simulateur de Riviqo.

---

## 1. Variables d'Entrée (Inputs Utilisateur)
Pour que les algorithmes fonctionnent, nous devons collecter les données suivantes dans le formulaire :

**A. Inputs Financiers :**
* `CA` : Chiffre d'Affaires HT (N-1)
* `EBE` : Excédent Brut d'Exploitation déclaré
* `RN` : Résultat Net courant
* `REM_DIR` : Rémunération annuelle du dirigeant + charges (salaire net + cotisations)
* `CP` : Capitaux Propres (Fonds propres)
* `TRES` : Trésorerie disponible
* `DETTES` : Dettes financières à moyen/long terme

**B. Inputs Business / Croissance :**
* `TX_CROISS` : Taux de croissance estimé (% de croissance du CA/Résultat prévu). Peut être déduit (Faible = 2%, Moyen = 10%, Fort = 25%+).
* `BUSINESS_MODEL` : Type de modèle (SaaS, E-commerce, Agence, etc.).

**C. Inputs Qualitatifs (Modificateurs de Risque) :**
Chaque réponse donne un **Score de Risque** (pondération globale).
* *Dépendance Dirigeant* (Élevée = -15% / Modérée = -5% / Faible = +5%)
* *Concentration Client* (Forte = -10% / Répartie = 0%)
* *Récurrence du CA* (Faible = -10% / Forte = +15%)
* Soit un multiplicateur final de Qualité `MUX_QUALITE` (compris entre 0.8 et 1.25 par exemple).

---

## 2. Retraitements Préalables (Calculs de base)
Avant d'appliquer les méthodes de valorisation, nous devons "normaliser" la rentabilité.

* **Revenu Normatif du Dirigeant (`REM_NORM`) :** Salaire de marché qu'un repreneur devrait payer pour un DG (ex: fixe estimé à 80 K€ + charges si PME > 1M€ CA).
* **EBE Retraité (SDE - Seller's Discretionary Earnings) :**
  `EBE_RETRAITE = EBE + REM_DIR - REM_NORM`
  *(Si la TPE est petite, on utilise directement le SDE classique : EBE + Rémunération dirigeant totale).*

---

## 3. Les Trois Moteurs de Valorisation

### MOTEUR 1 : L'Approche Rentabilité (DCF et Capitalisation)
*Objectif : Estimer la valeur selon les flux futurs.*

**A. Capitalisation des Bénéfices (Méthode de Rendement) :**
On divise le bénéfice par un taux de risque "Taux de capitalisation" (`T_CAP`), souvent défini par l'administration fiscale ou les experts autour de 10% à 15% selon la solidité (modulé par `MUX_QUALITE`).
* `T_CAP` de base = 12% (0.12).
* `T_CAP_AJUSTE = 0.12 / MUX_QUALITE` (Si l'entreprise est risquée, le taux monte à 15%, diminuant la valeur).
* **Valeur de Rendement (VR) = `RN / T_CAP_AJUSTE`**

**B. DCF Simplifié sur 5 ans :**
On estime le Free Cash Flow (FCF) moyen sur 5 ans.
* FCF Année 1 = `(EBE_RETRAITE * (1 - ImpotIS))`
* Croissance du FCF = Appliquer `TX_CROISS` chaque année (Année 1 à 5).
* Actualisation avec un WACC (`T_WACC` ~ 15%).
* Formule : Somme des FCF actualisés (A1 à A5) + Valeur Terminale (A5 / `T_WACC`).
* **Valeur DCF = Somme(FCF_Act) + Valeur_Terminale_Act**

---

### MOTEUR 2 : L'Approche Comparative (Multiples M&A)
*Objectif : Savoir à combien se vendent les concurrents.*

Le *Multiple Sectoriel* de base (`MULT_BASE`) dépend du `BUSINESS_MODEL`.
* *SaaS :* `MULT_BASE` = 1.5x à 4x le CA (ou ARR).
* *E-commerce < 2M€ CA :* `MULT_BASE` = 3x à 4.5x l'EBE_RETRAITE (SDE).
* *Agence / ESN :* `MULT_BASE` = 5x à 7x l'EBE.

On applique le modificateur de qualité pour obtenir le multiple exact :
* `MULT_FINAL = MULT_BASE * MUX_QUALITE`

**Valeur Multiples (VM) = `EBE_RETRAITE * MULT_FINAL`**
*(Note: Pour le SaaS, ce sera souvent `CA * MULT_FINAL`)*

---

### MOTEUR 3 : L'Approche Patrimoniale (Bercy / Fiscale)
*Objectif : Avoir une valeur "socle" défendable juridiquement.*

**A. Valeur Mathématique (VMATH) :**
* **VMATH = `CP`** (Capitaux propres actuels, incluant idéalement les plus-values latentes).

**B. Méthode Mixte (Praticiens / Fiscale) :**
L'administration fiscale fait la moyenne entre la valeur patrimoniale et la valeur de rendement (Moteur 1).
* **Valeur Bercy (VB) = `(VMATH + VR) / 2`**

---

## 4. Synthèse et Livrable Final (Ce qui est affiché)

Le résultat affiché ne doit pas être un chiffre unique, mais une **"Enterprise Value" (Valeur d'Entreprise)** et une **"Equity Value" (Valeur des Titres)** présentées sous forme de **fourchettes**.

### Passage de la Valeur d'Entreprise à la Valeur des Titres
Les méthodes M&A (Multiples et DCF) calculent généralement la Valeur d'Entreprise. Pour savoir combien le cédant touchera, il faut ajouter la trésorerie et retirer la dette (*Cash-Free, Debt-Free*).

* **Prix de Cession (Equity Value) = `Valeur d'Entreprise + TRES - DETTES`**

*(Note : La Valeur Mathématique (Bercy) inclut déjà implicitement la trésorerie et la dette puisqu'elle se base sur les capitaux propres).*

### Le Tableau de Synthèse (La Fourchette)
L'outil créera un "mix" pour pondérer la valorisation finale :
1. **Borne Basse (Souvent l'approche Bercy / Mixte) :** `Valeur Bercy (VB)`
2. **Valeur Médiane (Le Marché M&A) :** `Prix de Cession issu des Multiples`
3. **Borne Haute (Projection de Rentabilité) :** `Prix de Cession issu du DCF Simplifié`

**Résultat présenté à l'utilisateur :**
"La valorisation estimée de vos titres se situe **entre [Borne Basse] € et [Borne Haute] €**, avec une valeur de marché centrale autour de **[Valeur Médiane] €**."
