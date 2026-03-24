export default {
  chapters: [
    {
      id: 'principe-actualisation',
      title: 'Le principe de l\'actualisation des flux',
      content: `La **méthode DCF** (Discounted Cash Flows) repose sur un axiome fondamental de la finance moderne : **un euro aujourd'hui vaut plus qu'un euro demain**. Cette notion, appelée la **valeur temps de l'argent**, constitue le socle de toute analyse financière.

### Le raisonnement de l'investisseur

Lorsqu'un acquéreur achète une entreprise, il achète en réalité un **flux de revenus futurs**. La question centrale est : combien suis-je prêt à payer aujourd'hui pour recevoir ces flux dans le futur ?

La réponse dépend de trois facteurs :

- **Le montant des flux attendus** : plus les flux futurs sont importants, plus la valeur est élevée
- **Le calendrier des flux** : des flux proches valent plus que des flux lointains
- **Le risque associé** : des flux incertains valent moins que des flux garantis

### La formule d'actualisation

Pour chaque flux futur, on applique la formule :

**Valeur actuelle = Flux futur / (1 + taux d'actualisation)^n**

Où **n** est le nombre d'années entre aujourd'hui et la réception du flux.

### Les flux de trésorerie disponibles (Free Cash Flows)

Le flux retenu n'est pas le résultat net mais le **Free Cash Flow to Firm** (FCFF) :

- Résultat d'exploitation après impôts
- \\+ Dotations aux amortissements
- \\- Investissements de maintenance et de croissance (CAPEX)
- \\- Variation du besoin en fonds de roulement (BFR)

Ce flux représente la **trésorerie réellement disponible** pour rémunérer l'ensemble des apporteurs de capitaux (actionnaires et créanciers). Pour une vue d'ensemble des méthodes, consultez [[valorisation-entreprise-methodes]].`
    },
    {
      id: 'construire-business-plan',
      title: 'Construire le business plan prévisionnel',
      content: `La qualité d'une valorisation DCF dépend entièrement de la **fiabilité des projections financières**. Le business plan prévisionnel doit être réaliste, documenté et défendable.

### Horizon de projection

L'horizon de projection standard est de **5 à 7 ans**. Au-delà, les prévisions deviennent trop incertaines pour être crédibles. Pour les entreprises en phase de croissance rapide, on peut étendre l'horizon à 10 ans afin de capturer la phase de normalisation.

### Construire les projections

**Le chiffre d'affaires** : c'est le point de départ. Construisez-le de manière **bottom-up** :
- Nombre de clients × panier moyen × fréquence d'achat
- Volume × prix unitaire
- Récurrent + nouveau business

**Les charges variables** : elles doivent évoluer proportionnellement au CA, sauf justification d'économies d'échelle documentées.

**Les charges fixes** : projetez les grandes masses (loyers, salaires, assurances) avec une inflation raisonnable (2-3% par an).

**Les investissements (CAPEX)** : distinguez le CAPEX de maintenance (nécessaire pour maintenir l'outil productif) du CAPEX de croissance (développement de nouvelles capacités).

### Les erreurs classiques

- **L'excès d'optimisme** : des taux de croissance à deux chiffres pendant 7 ans sont rarement crédibles
- **L'oubli du BFR** : la croissance du CA entraîne mécaniquement une augmentation du BFR
- **Le sous-investissement** : projeter un CA en hausse sans investissement proportionnel n'est pas réaliste
- **L'absence de scénarios** : un seul scénario ne suffit pas, il faut au minimum trois cas (bas, central, haut)

Un business plan crédible est celui que le **dirigeant peut défendre ligne par ligne** face à un acquéreur expérimenté.`
    },
    {
      id: 'taux-actualisation-wacc',
      title: 'Le taux d\'actualisation (WACC)',
      content: `Le **WACC** (Weighted Average Cost of Capital), ou **coût moyen pondéré du capital**, est le taux utilisé pour actualiser les flux futurs. C'est un paramètre **critique** : une variation de 1 à 2 points peut modifier la valorisation de 20 à 30%.

### Composition du WACC

Le WACC combine le coût des fonds propres et le coût de la dette, pondérés par leur poids respectif dans la structure financière :

**WACC = (E/V × Ke) + (D/V × Kd × (1-t))**

Où :
- **E/V** : proportion des fonds propres dans le financement total
- **Ke** : coût des fonds propres (rendement exigé par les actionnaires)
- **D/V** : proportion de la dette dans le financement total
- **Kd** : coût de la dette avant impôt
- **t** : taux d'imposition (économie fiscale liée à la déductibilité des intérêts)

### Estimer le coût des fonds propres (Ke)

Pour les PME non cotées, le Ke se décompose comme suit :

- **Taux sans risque** : 2,5 à 3,5% (OAT 10 ans)
- **Prime de risque marché** : 5 à 6%
- **Bêta sectoriel** : coefficient de risque systématique du secteur (0,7 à 1,5)
- **Prime de taille** : 3 à 6% pour les PME (effet small cap)
- **Prime spécifique** : 2 à 8% selon les risques propres à l'entreprise

### Fourchettes typiques de WACC

- **Grandes entreprises cotées** : 7 à 10%
- **ETI solides** : 10 à 13%
- **PME établies** : 12 à 16%
- **Startups / entreprises risquées** : 18 à 25%+

### L'impact du WACC sur la valorisation

Prenons une entreprise générant 500 000 € de FCF constant :
- Avec un WACC de 12% : valeur ≈ 4 167 000 €
- Avec un WACC de 15% : valeur ≈ 3 333 000 €
- Avec un WACC de 18% : valeur ≈ 2 778 000 €

L'écart est considérable. C'est pourquoi le choix du WACC doit être **rigoureusement justifié** et fait l'objet de discussions approfondies entre cédant et acquéreur.`
    },
    {
      id: 'valeur-terminale',
      title: 'La valeur terminale : clé de voûte du DCF',
      content: `La **valeur terminale** (ou terminal value) représente la valeur de l'entreprise au-delà de l'horizon de projection explicite. Elle capture la valeur de **tous les flux futurs** après la période de prévision et représente typiquement **60 à 80%** de la valeur totale.

### Deux approches pour calculer la valeur terminale

**Approche par croissance perpétuelle (modèle de Gordon)**

**VT = FCF(n+1) / (WACC - g)**

Où **g** est le taux de croissance perpétuelle des flux après l'horizon de projection. Ce taux est généralement compris entre **1,5% et 3%** (proche de l'inflation ou de la croissance nominale du PIB).

**Approche par multiple de sortie**

**VT = EBITDA(n) × Multiple de sortie**

Le multiple de sortie est souvent égal au multiple d'entrée, parfois avec une légère décote.

### Quelle approche choisir ?

- L'approche par **croissance perpétuelle** est plus théorique et plus sensible aux hypothèses
- L'approche par **multiple de sortie** est plus intuitive et plus proche de la réalité du marché
- L'idéal est de **comparer les deux** pour vérifier la cohérence

### Sensibilité de la valeur terminale

Le taux de croissance perpétuelle a un impact déterminant :

- g = 1% → VT plus faible, hypothèse conservatrice
- g = 2% → VT modérée, hypothèse réaliste
- g = 3% → VT plus élevée, hypothèse à justifier solidement

**Attention** : un taux g supérieur à la croissance du PIB nominal sur le long terme (≈ 3-4%) n'est généralement pas justifiable, car il supposerait que l'entreprise finisse par dépasser l'économie toute entière.

La valeur terminale doit ensuite être **actualisée** à la date du jour en la divisant par (1 + WACC)^n.`
    },
    {
      id: 'exemple-chiffre',
      title: 'Exemple chiffré complet',
      content: `Prenons l'exemple d'une **PME industrielle** réalisant 5 M€ de CA avec un EBITDA de 800 000 €. L'actionnaire souhaite céder 100% des titres.

### Hypothèses retenues

- **Horizon de projection** : 5 ans
- **Croissance du CA** : 5% par an, décélération progressive
- **Marge d'EBITDA** : maintenue à 16%
- **CAPEX** : 3% du CA (maintenance + croissance modérée)
- **Variation du BFR** : 10% de la variation du CA
- **Taux d'imposition** : 25%
- **WACC** : 13%
- **Taux de croissance perpétuelle** : 2%

### Projection des Free Cash Flows (en k€)

- **Année 1** : CA 5 250 → EBITDA 840 → FCF 525
- **Année 2** : CA 5 513 → EBITDA 882 → FCF 551
- **Année 3** : CA 5 761 → EBITDA 922 → FCF 576
- **Année 4** : CA 5 991 → EBITDA 959 → FCF 599
- **Année 5** : CA 6 201 → EBITDA 992 → FCF 620

### Calcul de la valeur

**Somme des FCF actualisés (années 1-5)** : 525/(1,13)¹ + 551/(1,13)² + 576/(1,13)³ + 599/(1,13)⁴ + 620/(1,13)⁵ = **1 965 k€**

**Valeur terminale** : 620 × (1,02) / (0,13 - 0,02) = 5 749 k€
**Valeur terminale actualisée** : 5 749 / (1,13)⁵ = **3 121 k€**

**Valeur d'entreprise** = 1 965 + 3 121 = **5 086 k€**

### Passage au prix des titres

- VE : 5 086 k€
- Dette financière nette : -800 k€
- **Valeur des titres : 4 286 k€**

### Vérification par les multiples

VE / EBITDA = 5 086 / 800 = **6,4x** → cohérent avec les multiples du secteur industriel. Cette convergence entre DCF et multiples renforce la crédibilité de l'évaluation. Voir [[multiple-ebitda-valorisation]] pour la comparaison sectorielle.`
    },
    {
      id: 'avantages-limites',
      title: 'Avantages et limites de la méthode DCF',
      content: `La méthode DCF est considérée comme la plus **intellectuellement rigoureuse** des méthodes de valorisation, mais elle n'est pas exempte de critiques.

### Les avantages majeurs

- **Orientée vers le futur** : contrairement aux multiples qui s'appuient sur le passé, le DCF valorise le **potentiel futur** de l'entreprise
- **Personnalisable** : chaque hypothèse peut être ajustée au cas spécifique de l'entreprise
- **Transparente** : toutes les hypothèses sont explicites et discutables
- **Adaptée aux situations complexes** : entreprises en croissance, en retournement, ou avec des profils atypiques
- **Base de scénarios** : permet de quantifier l'impact de différentes stratégies

### Les limites à connaître

- **Sensibilité aux hypothèses** : de petites variations du WACC ou du taux de croissance modifient considérablement le résultat — un DCF peut justifier presque n'importe quel prix
- **Complexité** : nécessite une expertise financière solide et un business plan détaillé
- **Poids de la valeur terminale** : 60 à 80% de la valeur repose sur une hypothèse de croissance perpétuelle, ce qui est paradoxal pour une méthode censée être précise
- **Illusion de précision** : le résultat à l'euro près donne une fausse impression d'exactitude

### Recommandations pratiques

- Réalisez toujours une **analyse de sensibilité** sur les paramètres clés (WACC, g, marge)
- Présentez les résultats sous forme de **fourchette**, pas de valeur unique
- **Croisez** systématiquement avec la méthode des multiples pour valider la cohérence
- Faites **challenger** vos hypothèses par un tiers indépendant

La méthode DCF est particulièrement adaptée aux entreprises disposant d'un **business plan solide et crédible**. Pour les TPE sans prévisions fiables, la méthode des multiples ou du rendement sera plus pertinente. Consultez [[valorisation-entreprise-methodes]] pour choisir la bonne approche.`
    }
  ],
  faq: [
    {
      question: 'La méthode DCF est-elle adaptée pour valoriser une petite entreprise ?',
      answer: 'La méthode DCF peut être utilisée pour les petites entreprises, mais elle est moins pertinente si l\'entreprise ne dispose pas d\'un business plan détaillé et crédible. Pour les TPE, la méthode des multiples d\'EBITDA ou la méthode du rendement sont souvent plus adaptées car elles reposent sur des données historiques vérifiables plutôt que sur des projections incertaines.'
    },
    {
      question: 'Comment déterminer le bon taux d\'actualisation pour une PME ?',
      answer: 'Pour une PME française non cotée, le WACC se situe généralement entre 12% et 18%. Partez du taux sans risque (≈3%), ajoutez la prime de risque marché (≈5-6%), appliquez un bêta sectoriel, puis ajoutez les primes de taille (3-5%) et de risque spécifique (2-8%). Les principaux facteurs de risque spécifique sont la dépendance au dirigeant, la concentration client, la récurrence du CA et la qualité des actifs.'
    },
    {
      question: 'Pourquoi la valeur terminale représente-t-elle une si grande part de la valorisation DCF ?',
      answer: 'La valeur terminale capture la valeur de tous les flux au-delà de l\'horizon de projection (typiquement 5-7 ans). Comme l\'entreprise est supposée continuer d\'opérer indéfiniment, cette valeur est mécaniquement importante. Pour limiter ce biais, on recommande d\'allonger l\'horizon de projection (7-10 ans) et d\'utiliser un taux de croissance perpétuelle prudent (1,5 à 2,5%), proche de l\'inflation à long terme.'
    }
  ],
  cta: {
    tool: 'Valuations',
    text: 'Testez notre simulateur de valorisation'
  }
};
