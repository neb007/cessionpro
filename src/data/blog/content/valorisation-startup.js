export default {
  chapters: [
    {
      id: 'specificites-startups',
      title: 'Les spécificités de la valorisation de startups',
      content: `Valoriser une **startup** est un exercice fondamentalement différent de la valorisation d'une PME traditionnelle. Les méthodes classiques — multiples d'EBITDA, approche patrimoniale — sont souvent **inapplicables** car la startup n'a pas (ou peu) de chiffre d'affaires, pas de bénéfices, et des actifs limités.

### Pourquoi les méthodes classiques échouent

- **Pas d'EBITDA positif** : on ne peut pas appliquer un multiple à un résultat négatif
- **Actifs immatériels** : la valeur réside dans la technologie, l'équipe et le potentiel de marché, pas dans les actifs comptables
- **Croissance non linéaire** : les projections classiques ne capturent pas les dynamiques exponentielles
- **Incertitude radicale** : le taux d'échec des startups (90%) rend toute projection hautement spéculative

### Ce qui crée la valeur d'une startup

- **La taille du marché adressable** (TAM) : un marché de plusieurs milliards d'euros justifie une valorisation élevée même sans revenus
- **L'équipe fondatrice** : l'expérience, la complémentarité et le track record des fondateurs
- **La traction** : nombre d'utilisateurs, croissance mensuelle, rétention, NPS
- **La technologie** : propriété intellectuelle, barrières à l'entrée, avance technologique
- **Le modèle économique** : scalabilité, marges unitaires, coûts d'acquisition client

### Le contexte de la valorisation

La valorisation d'une startup intervient principalement lors des **levées de fonds**. Elle résulte d'une **négociation** entre fondateurs et investisseurs, influencée par le rapport de force, les conditions de marché et les termes de l'investissement (liquidation preference, anti-dilution, etc.).

Pour les entreprises plus matures, les méthodes traditionnelles restent pertinentes. Consultez [[valorisation-entreprise-methodes]] pour un panorama complet.`
    },
    {
      id: 'methode-berkus',
      title: 'La méthode Berkus',
      content: `Développée par l'investisseur américain **Dave Berkus**, cette méthode est conçue pour les startups en **phase pré-revenue**. Elle attribue une valeur maximale à cinq facteurs clés de succès.

### Les cinq critères d'évaluation

Chaque critère peut apporter jusqu'à **500 000 €** de valeur (ajustable selon le marché), pour une valorisation maximale théorique de **2,5 M€** en pré-revenue :

- **Qualité de l'idée** (risque produit) : 0 à 500 000 €
  - L'idée répond-elle à un problème réel et quantifiable ?
  - Le marché est-il suffisamment large ?

- **Prototype fonctionnel** (risque technologique) : 0 à 500 000 €
  - Le produit existe-t-il sous forme de MVP ?
  - La technologie a-t-elle été validée ?

- **Qualité de l'équipe** (risque d'exécution) : 0 à 500 000 €
  - Les fondateurs ont-ils l'expérience nécessaire ?
  - L'équipe est-elle complète (tech + business) ?

- **Relations stratégiques** (risque marché) : 0 à 500 000 €
  - Y a-t-il des partenariats signés ou en cours ?
  - Des lettres d'intention de clients potentiels ?

- **Premiers revenus ou traction** (risque financier) : 0 à 500 000 €
  - Y a-t-il des premiers clients payants ?
  - La croissance est-elle mesurable ?

### Application pratique

Une startup deep-tech avec une équipe solide (400 k€), un prototype validé (350 k€), une idée sur un grand marché (400 k€), mais sans partenariat (100 k€) ni revenu (0 k€) serait valorisée à :

400 + 350 + 400 + 100 + 0 = **1 250 000 €**

### Limites de la méthode

La méthode Berkus est **subjective** par nature et les montants par critère varient selon les marchés (plus élevés dans la Silicon Valley, plus modestes en France). Elle est surtout utile pour les **rounds d'amorçage** et doit être complétée par d'autres approches pour les startups plus avancées.`
    },
    {
      id: 'scorecard-method',
      title: 'La méthode Scorecard (Bill Payne)',
      content: `La **méthode Scorecard**, popularisée par l'investisseur **Bill Payne**, est une évolution sophistiquée de la méthode Berkus. Elle part de la **valorisation médiane** des startups comparables dans la même région et au même stade, puis l'ajuste selon un score multicritères.

### Étape 1 : Déterminer la valorisation médiane de référence

En France, les valorisations médianes pré-money en seed sont approximativement :

- **Pré-seed** : 500 000 € à 1 500 000 €
- **Seed** : 1 500 000 € à 4 000 000 €
- **Série A** : 5 000 000 € à 15 000 000 €

### Étape 2 : Pondérer les critères de comparaison

Chaque critère reçoit un poids et un score relatif (comparé à la médiane) :

- **Équipe fondatrice** (30%) : la qualité de l'équipe est le facteur le plus important pour les investisseurs early-stage
- **Taille de l'opportunité** (25%) : le marché adressable doit justifier un retour de 10x minimum pour le fonds
- **Produit / Technologie** (15%) : maturité du produit, propriété intellectuelle, avance concurrentielle
- **Environnement concurrentiel** (10%) : nombre de concurrents, barrières à l'entrée
- **Marketing / Ventes** (10%) : canaux d'acquisition, coût d'acquisition, pipeline commercial
- **Besoin de financement supplémentaire** (5%) : la startup aura-t-elle besoin de nombreux tours de table ?
- **Autres facteurs** (5%) : réglementation favorable, timing de marché, impact ESG

### Étape 3 : Calculer le facteur d'ajustement

Pour chaque critère, on attribue un score de **0,5x** (très inférieur à la médiane) à **1,5x** (très supérieur). On calcule le facteur pondéré total.

### Exemple

Valorisation médiane seed : 2 500 000 €

- Équipe : 1,3 × 30% = 0,39
- Marché : 1,2 × 25% = 0,30
- Produit : 1,0 × 15% = 0,15
- Concurrence : 0,8 × 10% = 0,08
- Marketing : 1,1 × 10% = 0,11
- Financement : 0,9 × 5% = 0,045
- Autres : 1,0 × 5% = 0,05

**Facteur total** = 1,125

**Valorisation ajustée** = 2 500 000 × 1,125 = **2 812 500 €**`
    },
    {
      id: 'vc-method',
      title: 'La méthode VC (Venture Capital)',
      content: `La **méthode VC** adopte le point de vue de l'investisseur en raisonnant à rebours depuis la **valeur de sortie** attendue. C'est la méthode la plus utilisée par les fonds de capital-risque pour déterminer la valorisation pré-money acceptable.

### Le raisonnement inversé

L'investisseur VC raisonne ainsi :
1. Quelle sera la **valeur de l'entreprise à la sortie** (dans 5-7 ans) ?
2. Quel **retour sur investissement** (ROI) dois-je obtenir pour compenser le risque ?
3. Quelle est donc la **valorisation maximale** que je peux accepter aujourd'hui ?

### Formule

**Valorisation post-money = Valeur de sortie / ROI cible**

**Valorisation pré-money = Post-money - Montant investi**

### Détermination du ROI cible

Le ROI cible dépend du stade de la startup, reflétant le risque d'échec :

- **Pré-seed / Seed** : ROI cible de 20x à 30x
- **Série A** : ROI cible de 10x à 15x
- **Série B** : ROI cible de 5x à 8x
- **Série C et suivantes** : ROI cible de 3x à 5x

Ces multiples peuvent sembler élevés, mais ils intègrent le fait que **la majorité des investissements** d'un fonds VC échouent. Le ROI élevé sur les succès doit compenser les pertes sur les échecs.

### Exemple complet

Une startup SaaS B2B lève **1 M€** en Seed. Le fonds estime :

- **Valeur de sortie dans 6 ans** : la startup pourrait atteindre 5 M€ d'ARR avec une croissance de 80% par an pendant 3 ans puis 40%. Avec un multiple de sortie de 8x ARR = **40 M€**
- **ROI cible** : 20x (investissement seed)
- **Dilution anticipée** : le fonds sera dilué à 50% de sa participation initiale par les tours suivants

Valorisation post-money ajustée = 40 M€ / (20 × 2) = **1 M€**

Valorisation pré-money = 1 M€ - 1 M€ = **0 €** → le deal ne fonctionne pas à ces hypothèses.

En révisant la valeur de sortie à **80 M€** (hypothèse plus optimiste) : post-money = 80 / 40 = **2 M€**, pré-money = **1 M€**. Le fonds obtient 50% de la société.

Cette méthode montre pourquoi les **négociations VC** portent autant sur les hypothèses de sortie que sur la valorisation elle-même.`
    },
    {
      id: 'comparables-levees',
      title: 'Les comparables de levées de fonds',
      content: `L'analyse des **transactions comparables** est un complément indispensable aux méthodes théoriques. Elle ancre la valorisation dans la **réalité du marché** en s'appuyant sur des levées de fonds récentes de startups similaires.

### Sources de données en France

- **Dealroom** : base de données complète des levées de fonds européennes
- **Crunchbase** : référence mondiale, bonne couverture de l'écosystème français
- **Maddyness / FrenchWeb** : médias spécialisés qui couvrent les levées françaises
- **Eldorado** : plateforme française dédiée à la mise en relation startups/investisseurs
- **France Digitale** : baromètre annuel des performances du capital-risque français

### Critères de comparabilité

Pour constituer un échantillon pertinent, les startups comparables doivent partager :

- **Le même stade** : pré-seed, seed, série A, etc.
- **Le même secteur** : SaaS B2B, fintech, healthtech, etc.
- **La même géographie** : les valorisations varient considérablement entre Paris, la province et l'international
- **La même période** : les conditions de marché fluctuent (les valorisations 2021-2022 étaient 2 à 3 fois supérieures à celles de 2023-2024)
- **Des métriques similaires** : ARR, nombre d'utilisateurs, taux de croissance

### Métriques de référence par stade

- **Pré-seed** : valorisation de 10 à 30x le montant levé — focus sur l'équipe
- **Seed** : valorisation de 3 à 8x l'ARR — la traction commence à peser
- **Série A** : valorisation de 10 à 25x l'ARR — croissance et unit economics sont clés
- **Série B** : valorisation de 8 à 20x l'ARR — rentabilité en vue requise

### Le piège de la comparaison

Chaque startup est unique. Les valorisations affichées dans la presse sont souvent des **valorisations pré-money** qui n'incluent pas les conditions de l'investissement (liquidation preference, ratchet, anti-dilution). Une valorisation « élevée » assortie de conditions défavorables peut être moins avantageuse qu'une valorisation plus modeste avec des termes simples.`
    },
    {
      id: 'pieges-a-eviter',
      title: 'Les pièges à éviter en valorisation de startup',
      content: `La valorisation de startup est un exercice où l'**émotionnel** et le **biais d'optimisme** jouent un rôle disproportionné. Voici les erreurs les plus fréquentes commises par les fondateurs et comment les éviter.

### Piège n°1 : La survalorisation en seed

Lever à une valorisation trop élevée en seed crée un piège pour la suite : si la startup ne croît pas assez vite, le prochain tour se fera à une valorisation inférieure (**down round**), ce qui est désastreux pour le moral, la dilution et la crédibilité.

**Règle pratique** : la valorisation pré-money ne devrait pas dépasser **3 à 5 fois le montant levé** en seed.

### Piège n°2 : Confondre valorisation et valeur

La valorisation d'une levée de fonds est un **prix de marché négocié**, pas une valeur intrinsèque. Elle dépend du rapport de force, des conditions de marché et de la concurrence entre investisseurs. En période de bulle, les valorisations s'envolent ; en période de correction, elles s'effondrent — sans que la valeur réelle de la startup ait changé.

### Piège n°3 : Ignorer la dilution cumulée

Une valorisation élevée au premier tour est inutile si les fondateurs sont dilués massivement par la suite. Il faut raisonner en **dilution cumulée** sur l'ensemble des tours :

- Seed : 15-25% de dilution
- Série A : 20-30% de dilution
- Série B : 15-25% de dilution

Après 3 tours, les fondateurs ne détiennent plus que **30 à 50%** de la société dans le meilleur des cas.

### Piège n°4 : Ne pas connaître ses métriques

Un fondateur incapable de répondre précisément aux questions sur son **CAC**, son **LTV**, son **churn**, sa **marge brute** ou son **burn rate** perd toute crédibilité face à un investisseur. La maîtrise des métriques est le premier signal de qualité managériale.

### Piège n°5 : Négliger les termes au profit de la valorisation

Les **termes de l'investissement** (liquidation preference, participating preferred, anti-dilution full ratchet) peuvent avoir un impact bien plus important que la valorisation nominale. Un investisseur offrant 5 M€ de valorisation avec une liquidation preference 2x non-participating est potentiellement moins avantageux qu'un investisseur à 4 M€ avec des termes simples.

Pour les fondateurs qui envisagent une cession plutôt qu'une levée, consultez [[decote-surcote-valorisation]] pour comprendre les ajustements applicables.`
    }
  ],
  faq: [
    {
      question: 'À partir de quel stade peut-on utiliser les méthodes de valorisation classiques pour une startup ?',
      answer: 'Les méthodes classiques (multiples d\'EBITDA, DCF) deviennent pertinentes lorsque la startup atteint le stade de la profitabilité ou s\'en approche significativement, généralement à partir de la série B ou C. Avant cela, les méthodes spécifiques (Berkus, Scorecard, VC method) sont plus adaptées car elles intègrent l\'incertitude et le potentiel de croissance qui caractérisent les startups early-stage.'
    },
    {
      question: 'Comment valoriser une startup qui n\'a pas encore de chiffre d\'affaires ?',
      answer: 'Pour une startup pré-revenue, privilégiez la méthode Berkus (qui évalue 5 critères qualitatifs) ou la méthode Scorecard (qui compare à des startups similaires). La méthode VC peut aussi être utilisée si vous avez une vision claire de la valeur de sortie potentielle. Dans tous les cas, la valorisation pré-revenue repose essentiellement sur la qualité de l\'équipe, la taille du marché adressable et l\'avancement du produit.'
    },
    {
      question: 'Les valorisations de startups françaises sont-elles comparables aux valorisations américaines ?',
      answer: 'Non, les valorisations françaises sont structurellement inférieures de 30 à 50% par rapport aux valorisations américaines au même stade. Cela s\'explique par un écosystème VC moins profond, des multiples de sortie plus faibles en Europe et un marché domestique plus petit. Cependant, l\'écart se réduit progressivement grâce à la maturation de l\'écosystème French Tech et l\'arrivée de fonds américains en Europe.'
    }
  ],
  cta: {
    tool: 'Valuations',
    text: 'Utilisez notre outil de valorisation'
  }
};
