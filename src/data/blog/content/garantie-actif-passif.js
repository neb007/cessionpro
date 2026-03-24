export default {
  chapters: [
    {
      id: 'principe-objectif',
      title: 'Principe et objectif de la garantie d\'actif et de passif',
      content: `La garantie d'actif et de passif (GAP), parfois appelée convention de garantie, est un mécanisme contractuel incontournable dans les cessions de titres de sociétés. Elle constitue la principale protection de l'acquéreur contre les risques cachés de l'entreprise qu'il rachète.

**Pourquoi la GAP est-elle nécessaire ?**

Lorsqu'un acquéreur achète les titres d'une société, il acquiert l'intégralité du patrimoine de cette société — actifs comme passifs. Contrairement à une cession de fonds de commerce où les dettes restent à la charge du vendeur, la cession de titres transfère tous les risques à l'acquéreur, y compris :

- Les passifs non comptabilisés (dettes fiscales, sociales, environnementales)
- Les actifs surévalués (créances irrécouvrables, stocks obsolètes, immobilisations dépréciées)
- Les litiges en cours ou à venir non déclarés
- Les risques de redressement fiscal
- Les engagements hors bilan

La GAP vient corriger cette asymétrie d'information entre le vendeur (qui connaît son entreprise) et l'acquéreur (qui la découvre).

**Le mécanisme de la GAP**

Le principe est simple : le vendeur s'engage à indemniser l'acquéreur si un passif non déclaré se révèle ou si un actif s'avère surévalué par rapport aux déclarations faites dans le SPA.

Concrètement :
- Le vendeur fait des déclarations (representations & warranties) sur la situation de l'entreprise dans le SPA
- Si une déclaration s'avère inexacte ou incomplète après le closing, le vendeur indemnise l'acquéreur du préjudice subi
- L'indemnisation est encadrée par des mécanismes de plafond, franchise, seuil et durée

**GAP vs garantie légale**

En droit français, l'acquéreur bénéficie déjà de la garantie légale des vices cachés (article 1641 du Code civil) et de la garantie d'éviction (article 1626). Mais ces garanties légales sont insuffisantes en pratique car :

- La charge de la preuve pèse sur l'acquéreur
- Les délais sont courts (2 ans pour les vices cachés)
- Les indemnisations sont limitées au prix de la chose
- Elles ne couvrent pas les simples insuffisances d'actif ou les passifs non déclarés

La GAP contractuelle offre une protection sur mesure, plus large et plus précise que les garanties légales.

**GAP de valeur vs GAP de reconstitution**

### Garantie de valeur
Le vendeur garantit la valeur des titres cédés. Si un passif se révèle, le vendeur indemnise directement l'acquéreur (en tant que détenteur des titres).

- Avantage pour l'acquéreur : indemnisation directe, simple à mettre en œuvre
- Inconvénient fiscal : l'indemnité reçue par l'acquéreur peut être imposable (traitement comme une réduction du prix de revient des titres)

### Garantie de reconstitution (ou garantie de passif)
Le vendeur s'engage à reconstituer l'actif net de la société en versant l'indemnité directement à la société cible.

- Avantage fiscal : l'indemnité versée à la société n'est pas imposable pour l'acquéreur
- Inconvénient : mécanisme plus complexe, l'indemnité bénéficie à la société et non directement à l'acquéreur

En pratique, les deux mécanismes sont souvent combinés dans une rédaction hybride qui laisse le choix au bénéficiaire.

Pour comprendre le contexte du SPA dans lequel s'inscrit la GAP, consultez [[protocole-accord-cession]].`
    },
    {
      id: 'champ-application',
      title: 'Champ d\'application de la garantie',
      content: `Le périmètre de la GAP est défini par les déclarations du vendeur dans le SPA. Tout fait entrant dans le champ des déclarations et s'avérant inexact peut donner lieu à une indemnisation.

**Les domaines couverts**

### Passifs non déclarés
- Dettes fournisseurs non comptabilisées
- Provisions pour risques insuffisantes
- Engagements hors bilan non révélés (cautions, garanties données, lettres de confort)
- Passifs sociaux non provisionnés (indemnités de départ en retraite, contentieux prud'homaux)
- Passifs fiscaux (redressements, rappels de TVA, droits de mutation)
- Passifs environnementaux (dépollution, mise en conformité)

### Actifs surévalués
- Créances clients irrécouvrables non dépréciées
- Stocks obsolètes ou surévalués
- Immobilisations corporelles surévaluées (machines vétustes, véhicules)
- Immobilisations incorporelles non justifiées (goodwill, brevets expirés)
- Trésorerie indisponible ou bloquée

### Risques fiscaux
- Redressement de l'impôt sur les sociétés
- Rappel de TVA (TVA déduite à tort, TVA collectée non reversée)
- Cotisation foncière des entreprises (CFE) ou CVAE
- Taxe sur les salaires
- Remise en cause de crédits d'impôt (CIR, CII)
- Redressement des droits d'enregistrement sur les opérations passées

### Risques sociaux
- Contentieux prud'homaux non déclarés
- Non-respect de la convention collective (heures supplémentaires, primes)
- Redressement URSSAF
- Travail dissimulé ou prêt de main-d'œuvre illicite
- Non-conformité des contrats de travail
- Risques liés à la requalification de contrats (CDD en CDI, auto-entrepreneurs en salariés)

### Risques juridiques et réglementaires
- Contrefaçon de propriété intellectuelle
- Non-conformité réglementaire (RGPD, normes sectorielles)
- Perte d'autorisations d'exploitation
- Contentieux commerciaux non déclarés

### Risques environnementaux
- Pollution des sols non identifiée
- Non-conformité aux normes environnementales (ICPE)
- Coûts de dépollution
- Amendes et sanctions environnementales

**Les exclusions habituelles**

Certains événements sont généralement exclus du périmètre de la GAP :

- Les faits connus de l'acquéreur (révélés dans la disclosure letter ou dans la data room)
- Les provisions déjà constituées dans les comptes de référence
- Les conséquences de changements législatifs ou réglementaires postérieurs au closing
- Les faits résultant des décisions de gestion de l'acquéreur post-closing
- Les événements couverts par une assurance

**La disclosure letter**

La disclosure letter (ou lettre d'information) est le document dans lequel le vendeur révèle les exceptions à ses déclarations. Tout fait déclaré dans la disclosure letter est réputé connu de l'acquéreur et ne peut donner lieu à indemnisation au titre de la GAP.

C'est un document stratégique :
- Pour le vendeur : intérêt à être le plus exhaustif possible pour limiter sa responsabilité
- Pour l'acquéreur : chaque disclosure réduit sa protection ; il doit évaluer l'impact de chaque exception et, le cas échéant, ajuster le prix`
    },
    {
      id: 'duree-plafond',
      title: 'Durée et plafond de la garantie',
      content: `La durée et le plafond de la GAP sont deux paramètres fondamentaux qui déterminent l'étendue de la protection de l'acquéreur et l'engagement du vendeur.

**La durée de la garantie**

### Durée de droit commun
La durée de la GAP est librement fixée par les parties. En pratique, on observe :

- **Garantie générale** : 3 à 5 ans après le closing (durée la plus courante : 3 ans)
- **Garantie fiscale** : alignée sur le délai de prescription fiscale, soit 3 ans en matière d'impôt sur les sociétés (article L. 169 du Livre des procédures fiscales), ou 6 ans en cas de manquement délibéré
- **Garantie sociale** : 3 à 5 ans (prescription prud'homale et URSSAF)
- **Garantie environnementale** : 5 à 10 ans (les risques environnementaux peuvent se révéler tardivement)
- **Garantie spécifique** : durée adaptée au risque identifié (ex. : contentieux en cours — durée jusqu'à la décision définitive)

### Point de départ
La durée court à compter de la date du closing (et non de la date de signature du SPA si les deux dates diffèrent).

### Délai de réclamation
Le bénéficiaire de la GAP doit formuler sa réclamation dans un délai déterminé à compter de la découverte du fait générateur :
- Délai de notification : 30 à 90 jours après la découverte
- Contenu de la notification : description du fait, estimation du préjudice, fondement juridique
- Conséquence du non-respect du délai : déchéance de la garantie pour le fait concerné

**Le plafond de garantie (cap)**

Le plafond fixe le montant maximum que le vendeur peut être amené à verser au titre de la GAP. En pratique :

- **Plafond standard** : 20 à 50 % du prix de cession pour la garantie générale
- **Plafond renforcé** : 80 à 100 % du prix pour les déclarations fondamentales (titre de propriété, capacité à contracter)
- **Plafond fiscal** : souvent aligné sur le plafond général ou légèrement supérieur

### La logique du plafond
- Pour le vendeur : le plafond limite son risque financier post-cession. Il ne veut pas remettre en jeu la totalité du prix de vente.
- Pour l'acquéreur : le plafond doit être suffisant pour couvrir les risques raisonnablement prévisibles.

### Recommandations selon la taille de la transaction
- PME valorisée < 1 M€ : plafond de 30 à 50 % du prix
- PME valorisée 1 à 5 M€ : plafond de 20 à 40 % du prix
- PME valorisée 5 à 20 M€ : plafond de 15 à 30 % du prix
- ETI valorisée > 20 M€ : plafond de 10 à 25 % du prix

**Le sous-plafond par catégorie**

Dans les transactions plus sophistiquées, des sous-plafonds sont négociés par catégorie de risque :
- Sous-plafond fiscal : X € ou Y % du prix
- Sous-plafond social : X € ou Y % du prix
- Sous-plafond environnemental : X € ou Y % du prix

Cette approche permet de limiter l'exposition du vendeur sur chaque catégorie tout en maintenant un plafond global significatif.`
    },
    {
      id: 'franchise-seuil',
      title: 'Franchise, seuil de déclenchement et panier',
      content: `Les mécanismes de franchise et de seuil sont des outils de calibrage de la GAP qui évitent la multiplication de petites réclamations et définissent le niveau de risque accepté par chaque partie.

**Les trois mécanismes à distinguer**

### 1. Le seuil de déclenchement individuel (de minimis)
C'est le montant en dessous duquel une réclamation individuelle n'est pas prise en compte. Les petits écarts sont considérés comme normaux et acceptables.

- Montant typique : 5 000 à 20 000 € selon la taille de la transaction
- Objectif : filtrer les réclamations mineures et éviter les litiges disproportionnés
- Exemple : si le de minimis est de 10 000 €, une réclamation de 8 000 € est écartée ; une réclamation de 15 000 € est prise en compte pour son montant total

### 2. Le panier (basket ou tipping basket)
C'est le montant cumulé des réclamations individuelles (au-dessus du de minimis) à partir duquel la garantie se déclenche effectivement.

Deux modalités :
- **Franchise (deductible basket)** : le vendeur ne paie que le montant excédant le panier. Si le panier est de 50 000 € et les réclamations cumulées atteignent 80 000 €, le vendeur paie 30 000 €.
- **Seuil de déclenchement (tipping basket ou first euro basket)** : une fois le panier atteint, le vendeur paie la totalité des réclamations, y compris le montant du panier. Avec le même exemple, le vendeur paie 80 000 €.

**Le seuil de déclenchement (tipping basket) est plus favorable à l'acquéreur**, la franchise (deductible basket) est plus favorable au vendeur.

### 3. Montant typique du panier
- En pourcentage du prix : 0,5 à 2 % du prix de cession
- En montant absolu : 10 000 à 100 000 € pour les PME
- Négociation : le vendeur pousse pour un panier élevé ; l'acquéreur pour un panier faible ou inexistant

**Exemples chiffrés**

Prenons une cession de PME au prix de 3 000 000 € :

### Configuration type 1 (favorable au vendeur)
- De minimis : 15 000 €
- Panier (franchise) : 60 000 € (2 % du prix)
- Plafond : 900 000 € (30 % du prix)

Scénario : 3 réclamations — 8 000 €, 25 000 € et 45 000 €
- La réclamation de 8 000 € est écartée (< de minimis)
- Cumul des réclamations éligibles : 25 000 + 45 000 = 70 000 €
- Montant > panier de 60 000 € → la garantie se déclenche
- Le vendeur paie 70 000 - 60 000 = **10 000 €** (franchise déduite)

### Configuration type 2 (favorable à l'acquéreur)
- De minimis : 5 000 €
- Panier (tipping basket) : 30 000 € (1 % du prix)
- Plafond : 1 500 000 € (50 % du prix)

Même scénario : 3 réclamations — 8 000 €, 25 000 € et 45 000 €
- La réclamation de 8 000 € est éligible (> de minimis de 5 000 €)
- Cumul : 8 000 + 25 000 + 45 000 = 78 000 €
- Montant > panier de 30 000 € → la garantie se déclenche
- Le vendeur paie **78 000 €** (tipping basket : pas de déduction)

**Négociation pratique**

### Position du vendeur
- Panier élevé (2 à 3 % du prix) avec franchise (deductible)
- De minimis élevé (15 000 à 25 000 €)
- Plafond bas (15 à 25 % du prix)
- Argument : « Les petits ajustements sont normaux dans toute entreprise. La GAP ne doit pas servir de mécanisme de réduction du prix post-closing. »

### Position de l'acquéreur
- Pas de panier ou panier faible (< 1 % du prix) avec seuil de déclenchement (tipping basket)
- De minimis faible (< 5 000 €) ou inexistant
- Plafond élevé (50 à 100 % du prix)
- Argument : « Si les déclarations du vendeur sont exactes, la GAP ne coûtera rien. Plus la GAP est large, plus le vendeur est crédible sur la qualité de son entreprise. »

### Le compromis
Typiquement, les parties se retrouvent sur :
- De minimis : 1 à 2 % du prix unitaire
- Panier : 1 à 2 % du prix cumulé
- Mécanisme mixte : franchise pour les petites réclamations, tipping basket au-delà d'un certain seuil`
    },
    {
      id: 'mise-en-jeu',
      title: 'La mise en jeu de la garantie : procédure et délais',
      content: `La mise en jeu de la GAP est un processus encadré par le contrat. Le non-respect de la procédure peut entraîner la perte du droit à indemnisation.

**Le fait générateur**

La garantie peut être mise en jeu lorsque l'acquéreur (ou la société cible) découvre :

- Un passif non déclaré dans les déclarations et garanties du SPA
- Un actif surévalué par rapport aux comptes de référence
- Une violation d'une déclaration du vendeur
- Un événement antérieur au closing ayant des conséquences financières défavorables

### Exemples courants de faits générateurs
- Réception d'un avis de vérification fiscale portant sur un exercice antérieur au closing
- Assignation en contentieux prud'homal par un salarié licencié avant le closing
- Découverte d'une créance client irrécouvrable qui n'avait pas été dépréciée
- Notification d'un rappel de charges sociales par l'URSSAF
- Mise en demeure pour non-conformité environnementale
- Résiliation d'un contrat majeur en raison d'une faute antérieure au closing

**La procédure de réclamation**

### Étape 1 : La notification
L'acquéreur doit notifier le vendeur par lettre recommandée avec accusé de réception (LRAR) dans un délai déterminé par le contrat (généralement 30 à 60 jours après la découverte du fait).

La notification doit contenir :
- La description précise du fait générateur
- La référence aux déclarations et garanties violées
- L'estimation du préjudice (même provisoire)
- Les pièces justificatives disponibles
- La demande d'indemnisation

### Étape 2 : La réponse du vendeur
Le vendeur dispose d'un délai (15 à 30 jours) pour :
- Accepter la réclamation en tout ou en partie
- Contester la réclamation en motivant son refus
- Demander des informations complémentaires

### Étape 3 : La gestion du litige sous-jacent
Si le fait générateur est un litige avec un tiers (contentieux fiscal, prud'homal, commercial), la GAP prévoit généralement :
- L'obligation d'informer le vendeur et de le consulter sur la stratégie de défense
- Le droit du vendeur de participer à la défense (voire de la diriger dans certains cas)
- L'interdiction de transiger sans l'accord du vendeur
- La prise en charge des frais de défense (avocat, expert)

### Étape 4 : L'indemnisation
Une fois le préjudice définitivement chiffré (décision de justice, transaction, avis de mise en recouvrement) :
- Le vendeur verse l'indemnité dans un délai déterminé (15 à 30 jours)
- L'indemnité est nette de tout avantage fiscal ou indemnitaire (assurance, provision récupérée)
- Le montant est imputé sur le plafond de garantie

**Les causes de déchéance**

L'acquéreur peut perdre le bénéfice de la garantie dans certains cas :

- **Non-respect du délai de notification** : si l'acquéreur découvre un fait et ne le notifie pas dans le délai contractuel
- **Défaut de preuve** : si l'acquéreur ne peut pas démontrer le lien entre le fait et une déclaration du vendeur
- **Fait connu de l'acquéreur** : si le fait avait été révélé dans la disclosure letter ou dans la data room
- **Expiration de la durée de garantie** : si la réclamation est formulée après l'expiration du délai
- **Transaction sans accord** : si l'acquéreur transige avec le tiers sans l'accord du vendeur

**Prescription et contentieux**

Si les parties ne parviennent pas à s'accorder sur l'indemnisation :
- Médiation ou conciliation (souvent prévue comme étape préalable obligatoire)
- Expertise indépendante (pour les litiges techniques ou comptables)
- Arbitrage (procédure confidentielle et souvent plus rapide que le judiciaire)
- Action en justice devant le tribunal de commerce ou le tribunal judiciaire

La prescription de l'action en garantie est celle prévue par le contrat (la durée de la GAP), dans la limite de la prescription légale de 5 ans (article 2224 du Code civil).`
    },
    {
      id: 'negociation-pratique',
      title: 'Négociation pratique de la GAP : conseils d\'experts',
      content: `La négociation de la GAP est un exercice d'équilibre entre la protection légitime de l'acquéreur et la limitation raisonnable de l'engagement du vendeur. Voici les conseils issus de la pratique M&A.

**Stratégie de négociation pour le vendeur**

### 1. Préparer le terrain en amont
- Réaliser une vendor due diligence pour identifier et corriger les risques avant la mise en vente
- Constituer une disclosure letter exhaustive et documentée
- Démontrer la transparence et la qualité de la gestion par une documentation irréprochable

### 2. Limiter l'engagement
- Négocier un plafond raisonnable (25 à 35 % du prix) avec des sous-plafonds par catégorie
- Exiger une franchise (deductible) plutôt qu'un seuil de déclenchement (tipping basket)
- Limiter la durée de la garantie générale à 3 ans maximum
- Prévoir des exclusions claires (changements de loi, décisions de l'acquéreur)

### 3. Contrôler le processus de réclamation
- Exiger une notification rapide et détaillée
- Se réserver le droit de participer à la gestion des litiges sous-jacents
- Imposer l'accord préalable pour toute transaction avec un tiers
- Prévoir un mécanisme d'expertise en cas de désaccord

### 4. Sécuriser sa sortie
- Prévoir un terme clair et impératif de la GAP (sunset clause)
- Limiter la survie des réclamations notifiées avant l'expiration (ex. : 6 mois supplémentaires pour les réclamations pendantes)
- Refuser les clauses d'extension automatique de la durée

**Stratégie de négociation pour l'acquéreur**

### 1. Maximiser la protection
- Négocier des déclarations larges couvrant tous les aspects de l'entreprise
- Obtenir un plafond élevé (50 % ou plus du prix) avec un seuil de déclenchement (tipping basket)
- Prévoir des durées différenciées par type de risque (5 ans pour le fiscal, 10 ans pour l'environnemental)
- Exiger une contre-garantie solide (séquestre, caution bancaire)

### 2. Sécuriser l'exécution
- Mettre en place un séquestre d'une partie du prix (10 à 20 %) pour garantir l'exécution de la GAP
- Prévoir un mécanisme de compensation sur le crédit-vendeur ou l'earn-out
- Exiger une caution bancaire si le vendeur part à l'étranger
- S'assurer que la GAP est solidaire entre co-vendeurs

### 3. Faciliter la mise en jeu
- Négocier des délais de notification longs (60 à 90 jours)
- Prévoir un de minimis faible ou inexistant
- Éviter les exclusions trop larges
- Prévoir un mécanisme de compensation directe (set-off) sur les sommes dues au vendeur

**La contre-garantie : comment sécuriser l'exécution de la GAP**

La GAP ne vaut que si le vendeur est solvable et disposé à payer. Plusieurs mécanismes de sécurisation existent :

### Le séquestre
- Une partie du prix (10 à 20 %) est séquestrée chez un tiers (notaire, avocat, banque)
- Le séquestre est libéré progressivement (par tiers annuel ou à l'expiration de la GAP)
- En cas de réclamation, les fonds sont bloqués à hauteur du montant réclamé

### La caution bancaire
- Une banque se porte garante des obligations du vendeur
- Mécanisme coûteux pour le vendeur (commission de 1 à 3 % par an)
- Protection maximale pour l'acquéreur (garantie à première demande ou caution solidaire)

### Le nantissement de compte
- Le vendeur nantit un compte bancaire au profit de l'acquéreur
- Les fonds restent disponibles mais ne peuvent être retirés sans accord

### La retenue sur le prix (holdback)
- Mécanisme similaire au séquestre mais sans tiers
- L'acquéreur conserve une partie du prix et la verse au vendeur à l'expiration de la GAP
- Risque pour le vendeur en cas de défaillance de l'acquéreur

### La garantie du repreneur sur le crédit-vendeur
- Si un crédit-vendeur est prévu, les échéances peuvent servir de garantie
- En cas de réclamation, l'acquéreur compense sa créance GAP avec sa dette de crédit-vendeur

**Les tendances récentes**

L'assurance de GAP (Warranty & Indemnity Insurance ou W&I Insurance) se développe rapidement en France :

- L'acquéreur (ou le vendeur) souscrit une assurance qui couvre tout ou partie de la GAP
- Prime : 1 à 3 % du montant garanti
- Avantage : le vendeur est libéré de ses obligations, l'acquéreur dispose d'un débiteur solvable (l'assureur)
- En plein essor pour les transactions > 10 M€, encore peu courante pour les PME plus petites

Pour comprendre l'ensemble du processus de cession, consultez [[transmission-entreprise-guide-complet]].`
    }
  ],
  faq: [
    {
      question: 'Quelle est la durée habituelle d\'une GAP pour une cession de PME ?',
      answer: 'La durée standard d\'une GAP pour une PME est de 3 ans pour la garantie générale, 3 à 4 ans pour la garantie fiscale (alignée sur le délai de prescription fiscale), et 3 à 5 ans pour la garantie sociale. Pour les risques spécifiques (environnement, contentieux en cours), des durées plus longues peuvent être négociées (5 à 10 ans). Le vendeur a intérêt à limiter la durée au maximum, tandis que l\'acquéreur souhaite une couverture la plus longue possible.'
    },
    {
      question: 'Le vendeur peut-il refuser de signer une GAP ?',
      answer: 'En théorie, la GAP n\'est pas légalement obligatoire. Mais en pratique, aucun acquéreur sérieux n\'achètera une entreprise sans GAP. Refuser de signer une GAP est un signal très négatif qui fait suspecter des passifs cachés. La seule alternative est la souscription d\'une assurance W&I (Warranty & Indemnity Insurance) qui se substitue à la garantie du vendeur, mais son coût (1 à 3 % du montant garanti) est significatif et elle n\'est accessible que pour les transactions d\'une certaine taille (généralement > 5 M€).'
    },
    {
      question: 'Comment se protéger en tant que vendeur contre des réclamations abusives ?',
      answer: 'Plusieurs mécanismes protègent le vendeur : un de minimis élevé (filtre les petites réclamations), une franchise (deductible basket) qui fait supporter à l\'acquéreur une partie du risque, un plafond strict et raisonnable (25 à 35 % du prix), des délais de notification courts pour obliger l\'acquéreur à réagir vite, et surtout une disclosure letter exhaustive qui exclut tous les faits déjà communiqués. Le vendeur doit également se réserver le droit de participer à la gestion des litiges sous-jacents et d\'approuver toute transaction. Enfin, une vendor due diligence préalable permet d\'anticiper et de corriger les risques avant la vente.'
    }
  ],
  cta: {
    tool: 'Contact',
    text: 'Faites-vous conseiller sur votre GAP'
  }
}
