# Design & Maquette de l'Outil de Valorisation (UI/UX)

Ce document décrit l'interface utilisateur (UI) et l'expérience (UX) du simulateur de valorisation Riviqo. Il servira de guide pour l'intégration frontend (ex: React, Tailwind CSS, Framer Motion).

---

## 1. Principes de Design (Look & Feel)
*   **Minimalisme M&A :** L'outil ne doit pas ressembler à un formulaire administratif. Il doit évoquer le private equity, le luxe discret et la finance moderne.
*   **Couleurs :**
    *   Fond principal : Très sombre (ex: Slate 950 ou Zinc 950) pour un effet "Terminal Bloomberg" moderne, ou Blanc pur avec des ombres très douces (Glassmorphism). *Recommandation Riviqo : Le Dark Mode fait plus "Tech/Sérieux" pour ce genre d'outil.*
    *   Accent : Or, Bronze ou Bleu nuit (les couleurs de Riviqo) pour les boutons et indicateurs de progression.
*   **Typographie :** Linéales géométriques très propres (ex: *Inter*, *SF Pro*, *Outfit*) avec des gros titres (H1) fins et élégants.
*   **Animations :** Transitions fluides entre les questions (Fade in, Slide up). Pas de rechargement de page.

---

## 2. Le Parcours "Step-by-Step" (Wizard)

L'interface est centrée sur l'écran : **une seule question visible à la fois**, pour maximiser le taux de complétion.

### A. Layout Commun (Squelette)
*   **Header (Haut) :** Logo Riviqo (petit, centré) + Barre de progression discrète (ex: ligne fine en haut de l'écran qui se remplit).
*   **Zone Centrale :** La question posée en gros (H2), un sous-titre explicatif (gris clair), et le champ de saisie centré.
*   **Footer (Bas) :** Bouton "Suivant" (Large, couleur d'accent) ou "Entrée ↵" pour valider, et bouton "← Retour" très discret.

### B. Exemples d'Écrans de Saisie (Étapes 1 à 4)

**Écran Type 1 : Choix unique (Le Secteur/Business Model)**
*   **Titre :** "Quel est le modèle économique principal de l'entreprise ?"
*   **UI :** Grosses "Cards" (cartes clinquables) au lieu d'un menu déroulant banal.
    *   [ 💻 Logiciel SaaS B2B ]
    *   [ 📦 E-commerce & Retail ]
    *   [ 🤝 Agence & Services B2B ]
    *   *Effet 🔨 : Au clic, la carte s'illumine (bordure dorée) et passe automatiquement à la question suivante (pas besoin de cliquer sur "Suivant").*

**Écran Type 2 : Saisie de Montant Financier (Le CA et l'EBE)**
*   **Titre :** "Quel est l'Excédent Brut d'Exploitation (EBE) lors de votre dernier exercice ?"
*   **Sous-titre :** *(Aussi appelé EBITDA. Si vous ne l'avez pas, mettez votre Résultat d'Exploitation approximatif).*
*   **UI :** Un Input de texte **immense**, centré, avec préfixe "€".
    *   `[ € _ _ _ _ _ _ _ ]` (Le curseur clignote).
    *   Le texte se formate automatiquement avec des espaces (ex: `1 250 000`) pour éviter les erreurs de zéros.

**Écran Type 3 : Ajustements Qualitatifs (Les Risques)**
*   **Titre :** "Si vous (le dirigeant) partiez demain, l'entreprise pourrait-elle continuer à croître seule ?"
*   **UI :** 3 Boutons empilés verticalement, avec des descriptions claires :
    *   [ Oui, l'équipe management est 100% autonome ]
    *   [ Partiellement, il y aurait un ralentissement ]
    *   [ Non, je gère seul les clients clés et les opérations ]

---

## 3. L'Écran de Transition (L'Algorithme "Travaille")
C'est le moment crucial pour justifier l'attente et montrer la valeur de l'outil.
*   **UI :** Écran noir, un cercle de chargement fin tourne.
*   **Animation de textes (qui changent toutes les 1.5 sec) :**
    *   *"Requête des bases de données M&A sectorielles en cours..."*
    *   *"Calcul de l'EBITDA normatif..."*
    *   *"Application des décotes de risque..."*
    *   *"Agrégation des méthodes Bercy, Multiples et DCF..."*

---

## 4. L'Écran de Résultat (Les 3 Valeurs)

C'est l'écran de conversion (Gated Content). Il doit être spectaculaire mais "flouté" (ou partiel) pour forcer la saisie de l'email.

### A. Le Titre & L'Accroche
*   **Titre (H1) :** Les résultats de votre évaluation sont prêts.
*   **Sous-titre :** Notre algorithme institutionnel a calculé 3 valeurs distinctes pour votre entreprise, basées sur ses fondamentaux et les conditions de marché actuelles.

### B. Le Tableau de Bord à 3 Colonnes (Les 3 Valeurs)
L'UI présente 3 grandes "Cards" (Cartes) alignées horizontalement (ou verticalement sur mobile). Chaque carte a un style distinct.

**Carte 1 : Valeur Fiscale (Bercy) - Le Socle**
*   *Icône :* ⚖️ (Balance de justice ou Bâtiment classique)
*   *Titre :* Valeur Patrimoniale Fiscale
*   *Montant :* **Entre 1,2 M€ et 1,4 M€** *(Exemple de texte)*
*   *Description :* "Basée sur l'Actif Net Réévalué et la méthode de rentabilité de l'administration fiscale (DGFiP). Idéale pour les déclarations et pactes d'associés."

**Carte 2 : Valeur de Marché (M&A) - Le Réalisme (Mis en avant)**
*   **(Cette carte au centre est visuellement mise en valeur : plus grande, bordure dorée/brillante, effet 'Pop-up').**
*   *Icône :* 🤝 (Poignée de main ou Graphique en hausse)
*   *Titre :* Valeur de Cession Estimée (M&A)
*   *Montant :* **Entre 1,8 M€ et 2,3 M€**
*   *Description :* "Prix de marché estimé selon les multiples actuels de votre secteur. C'est la valeur de base pour démarrer des négociations avec un repreneur."

**Carte 3 : Valeur de Rentabilité (DCF) - Le Potentiel**
*   *Icône :* 🚀 (Fusée ou Éclair)
*   *Titre :* Valeur d'Usage Futurs (DCF)
*   *Montant :* **Entre 2,5 M€ et 3,1 M€**
*   *Description :* "Basée sur la modélisation de vos flux de trésorerie futurs. C'est la valeur 'premium' à défendre face à un fonds d'investissement stratégique."

*(Note : Dans la version Gated (avant de donner l'email), les montants réels peuvent être floutés type effet de verre (blur), ou seule une des 3 cartes affiche son prix, les autres montrant un cadenas 🔒).*

### C. Le Formulaire de Capture de Lead (Le Gated Content)
Placé juste en dessous (ou au-dessus si les résultats sont floutés).
*   **Titre :** Confirmez votre email professionnel pour débloquer le détail des calculs et recevoir par email votre rapport PDF complet (6 pages).
*   **UI du Formulaire (très compact, inline si possible) :**
    *   [ Prénom ] [ Nom ]
    *   [ Email Professionnel ]
    *   [ Bouton Principal Couleur Accent : "Débloquer mon évaluation complète" ]

*(Mention discrète en dessous : "Vos données financières restent strictement confidentielles et ne sont pas vendues à des tiers.")*
