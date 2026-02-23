# Structure du Composant "Valuation Wizard" (React)

Ce document détaille l'architecture et la logique du composant React principal qui gérera le formulaire étape par étape ("Wizard") du simulateur de valorisation. Ce composant est pensé pour s'intégrer facilement dans l'application front-end (ex: Next.js).

---

## 1. Architecture Globale
Le module est découpé en un composant "Parent" (Le contrôleur d'état) et de multiples composants "Enfants" (Les vues de chaque étape).

```text
ValuationWizard/ (Dossier du composant principal)
├── index.tsx                 (Le composant Parent qui gère le State global & l'affichage conditionnel)
├── ValuationContext.tsx      (Ou un simple useState profond, pour stocker les réponses)
├── steps/                    (Sous-dossier contenant les vues de chaque étape)
│   ├── Step1BusinessModel.tsx
│   ├── Step2Financials.tsx
│   ├── Step3BalanceSheet.tsx
│   ├── Step4Risks.tsx
│   ├── Step5Loading.tsx      (L'animation d'attente "Analyse en cours")
│   └── Step6Results.tsx      (L'écran final avec les 3 valeurs + Capture Lead)
└── utils/
    └── valuationEngines.ts   (Les formules mathématiques définies dans valuation_formulas.md)
```

---

## 2. Le State Principal (Les Données Collectées)

Le composant Parent (`ValuationWizard/index.tsx`) maintient deux états principaux : l'étape actuelle (de 1 à 6) et les données saisies par l'utilisateur.

### Interface TypeScript (Data Model)
```typescript
interface ValuationData {
  // Étape 1 : Profil
  businessModel: 'saas' | 'ecommerce' | 'agence' | 'autre' | null;
  
  // Étape 2 : Compte de résultat N-1
  revenue: number | null;        // CA
  ebitda: number | null;         // EBE
  netIncome: number | null;      // Résultat Net courant
  ownerSalary: number | null;    // Rémunération dirigeant
  
  // Étape 3 : Bilan
  equity: number | null;         // Capitaux Propres
  cash: number | null;           // Trésorerie dispo
  debt: number | null;           // Dettes financières
  
  // Étape 4 : Scan Qualitatif (Menu déroulants ou Boutons radio)
  dependencyRisk: 'high' | 'medium' | 'low' | null;
  clientConcentration: 'high' | 'medium' | 'low' | null;
  revenueRecurrence: 'high' | 'medium' | 'low' | null;
}
```

---

## 3. Logique de Navigation (Controller)

Le composant Parent utilise une fonction de rendu conditionnelle (`switch` ou dictionnaire) pour n'afficher qu'**une seule étape à la fois**.

### Props passées aux composants Enfants (Steps)
Chaque composant "Étape" (ex: `Step2Financials.tsx`) reçoit des props pour pouvoir lire et modifier le State global, ainsi que pour passer à la vue suivante.

```typescript
interface StepProps {
  data: ValuationData;                 // Les données actuelles
  updateData: (newData: Partial<ValuationData>) => void; // Fonction pour fusionner les nouvelles données
  onNext: () => void;                  // Passer à l'écran suivant
  onBack: () => void;                  // Retour à l'écran précédent
}
```

---

## 4. Spécifications Détaillées par Composant (Steps)

### `Step1BusinessModel` (Choix du secteur)
*   **Comportement :** Affiche de grandes "Cards" illustrées.
*   **Action spéciale :** Cliquer sur une carte met immédiatement à jour `updateData({ businessModel: '...' })` et appelle `onNext()` automatiquement (pas besoin de bouton "Suivant", ce qui fluidifie l'UX).

### `Step2Financials` & `Step3BalanceSheet` (Les Chiffres)
*   **Comportement :** Des champs "InputNumber" de grande taille.
*   **Validation côté client (UX) :** Le bouton `onNext()` est désactivé (`disabled`) tant que tous les champs obligatoires de l'étape ne sont pas remplis.
*   **Formatage :** Les inputs ajoutent automatiquement des espaces séparateurs de milliers (ex: au lieu de `1500000`, on affiche `1 500 000`) avec un préfixe ou suffixe `€`.

### `Step4Risks` (Questions QCM)
*   **Comportement :** Liste de questions avec des boutons de type "Groupes de boutons radios" (ex: 3 boutons alignés pour choisir la réponse).

### `Step5Loading` (L'écran de transition "Fake")
*   **Comportement :** C'est un composant sans interaction utilisateur. Lors de son montage (`useEffect`), il lance le calcul via `valuationEngines.ts`. Il affiche un "Loader" animé (Framer Motion ou CSS Spinner) pendant 2500ms (2.5 secondes) pour créer de la valeur perçue, puis appelle automatiquement `onNext()` pour afficher les résultats.

### `Step6Results` (L'Écran Final & Gated Content)
*   **Comportement :** 
    1. Affiche le titre de succès et les 3 cartes (Fiscale, Marché, Rentabilité) basées sur les résultats du calcul.
    2. Les montants à l'intérieur des cartes sont stylisés avec une classe CSS de "flou" (`blur-sm` sur Tailwind) ou remplacés par une large fourchette (`[ 1.5M€ - 4.5M€ ]`).
    3. Au centre, un formulaire de capture (Prénom, Nom, Email Pro).
*   **Action côté serveur :** À la soumission de l'email, le composant envoie l'objet entier `ValuationData` + l'email à un endpoint Backend (API Riviqo). En retour, le backend déclenche la création du PDF complet et son envoi par mail, et le composant React retire le filtre de flou.
