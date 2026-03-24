export default {
  chapters: [
    {
      id: 'pourquoi-retraiter',
      title: 'Pourquoi les retraitements comptables sont indispensables',
      content: `Dans les PME et TPE françaises, les **comptes annuels** reflètent rarement la performance économique réelle de l'entreprise. Le dirigeant-propriétaire optimise naturellement sa comptabilité pour réduire la charge fiscale, ce qui conduit à un résultat comptable souvent **sous-évalué** par rapport à la capacité bénéficiaire réelle.

### Le problème des comptes bruts

Les comptes sociaux sont établis selon des **règles fiscales et comptables** qui ne visent pas à refléter la valeur économique de l'entreprise :

- La rémunération du dirigeant n'est pas normée
- Les charges personnelles passées en charges d'exploitation réduisent artificiellement le résultat
- Les provisions excessives minorent le bénéfice sans justification économique
- Les amortissements accélérés (fiscalement avantageux) ne correspondent pas à la réalité économique

### L'objectif des retraitements

L'objectif est de reconstituer un **résultat normatif** qui reflète ce que l'entreprise générerait si elle était dirigée par un manager salarié, sans optimisation fiscale personnelle du dirigeant. Ce résultat retraité sert de base aux méthodes de valorisation :

- **Méthode des multiples** : on applique le multiple à l'EBITDA retraité (voir [[multiple-ebitda-valorisation]])
- **Méthode DCF** : les flux de trésorerie projetés partent du résultat retraité (voir [[methode-dcf-valorisation]])
- **Méthode du rendement** : le taux de capitalisation s'applique au résultat retraité

### L'impact est souvent considérable

Dans les PME patrimoniales, les retraitements modifient l'EBITDA de **20 à 60%** en moyenne. Un EBITDA comptable de 250 000 € peut devenir un EBITDA retraité de 400 000 €. Avec un multiple de 6x, cela représente une différence de **900 000 € sur la valorisation**. Ignorer les retraitements, c'est se tromper massivement sur le prix.`
    },
    {
      id: 'remuneration-dirigeant',
      title: 'Le retraitement de la rémunération du dirigeant',
      content: `C'est le retraitement le plus important et le plus fréquent dans les PME. La rémunération du dirigeant-propriétaire est rarement au niveau du marché et inclut souvent des composantes qui ne seraient pas versées à un manager salarié.

### Le principe du retraitement

On remplace la rémunération réelle du dirigeant par le **coût d'un dirigeant salarié au prix du marché** pour la même fonction et la même taille d'entreprise.

### Cas n°1 : Rémunération excessive

Le dirigeant se verse 250 000 € bruts annuels (salaire + charges sociales), alors qu'un directeur général salarié coûterait 120 000 € pour une entreprise de cette taille.

**Retraitement** : on ajoute 130 000 € à l'EBITDA (250 000 - 120 000)

### Cas n°2 : Rémunération insuffisante

Le dirigeant se verse seulement 40 000 € par an (fréquent dans les premières années ou lorsque le dirigeant privilégie les dividendes). Un manager salarié coûterait 90 000 €.

**Retraitement** : on retranche 50 000 € de l'EBITDA (90 000 - 40 000)

### Les éléments à intégrer dans la rémunération totale

- **Salaire brut** + charges patronales
- **Cotisations retraite complémentaire** (Madelin, PER)
- **Assurance homme-clé** si elle bénéficie au dirigeant
- **Véhicule de fonction** personnel
- **Avantages en nature** : logement, voyages personnels
- **Emploi de proches** : conjoint, enfants employés sans justification opérationnelle

### Comment déterminer le salaire de marché ?

Les références fiables incluent :

- Les **études de rémunération** publiées par les cabinets de recrutement (Hays, Robert Half, Michael Page)
- Les **conventions collectives** applicables
- Les **offres d'emploi** pour des postes similaires dans la même zone géographique

Ce retraitement est systématiquement scruté par les acquéreurs lors de la [[due-diligence-acquisition]]. Il doit être documenté et justifié.`
    },
    {
      id: 'charges-exceptionnelles',
      title: 'Les charges exceptionnelles et non récurrentes',
      content: `Les charges **exceptionnelles** ou **non récurrentes** faussent l'image de la performance opérationnelle courante. Elles doivent être identifiées et neutralisées pour obtenir un résultat normatif fiable.

### Les charges à retraiter

**Charges véritablement exceptionnelles** :
- Frais de contentieux et procès (provision et décaissements)
- Sinistres non couverts par l'assurance
- Pénalités et amendes
- Coûts de restructuration (licenciements, déménagement)
- Pertes sur créances clients hors cycle normal
- Coûts liés à un événement unique (COVID-19, inondation, incendie)

**Charges liées au projet de cession** :
- Honoraires de conseil en cession
- Frais de valorisation et d'audit préalable
- Coûts de mise en conformité spécifiquement engagés pour la vente

**Investissements exceptionnels passés en charges** :
- Dépenses de R&D non capitalisées
- Formations exceptionnelles (mise à niveau d'une équipe entière)
- Campagne marketing ponctuelle (lancement produit)

### Les produits exceptionnels à neutraliser également

Le retraitement fonctionne dans les deux sens. Les **produits non récurrents** doivent aussi être exclus :

- Plus-values sur cession d'actifs
- Subventions d'investissement virées au résultat
- Indemnités d'assurance exceptionnelles
- Reprises de provisions devenues sans objet

### Méthode pratique

Analysez les comptes sur **3 à 5 exercices** et identifiez les charges et produits qui ne se reproduisent pas régulièrement. La règle est simple : si un élément n'apparaît pas au moins 2 années sur 3, il est probablement non récurrent et doit être retraité.

Une attention particulière doit être portée aux charges qui paraissent « courantes » mais sont en réalité **anormalement élevées** une année donnée (par exemple, des frais de maintenance 3 fois supérieurs à la normale suite à une panne majeure).`
    },
    {
      id: 'loyers-immobilier',
      title: 'Les retraitements liés aux loyers et à l\'immobilier',
      content: `Dans de nombreuses PME, les locaux d'exploitation appartiennent au dirigeant ou à une SCI familiale. Le loyer pratiqué est alors souvent **déconnecté du marché**, à la hausse ou à la baisse, ce qui fausse le résultat d'exploitation.

### Cas n°1 : Loyer sous-évalué

Le dirigeant détient les murs via une SCI et fait payer un loyer symbolique à son entreprise (500 €/mois pour des locaux qui en valent 3 000 €). Le résultat d'exploitation est gonflé artificiellement de 30 000 € par an.

**Retraitement** : on impute un loyer de marché et on réduit l'EBITDA de la différence.

### Cas n°2 : Loyer surévalué

À l'inverse, certains dirigeants majorent le loyer pour **extraire des revenus** de l'entreprise via la SCI (optimisation fiscale). Un loyer de 5 000 €/mois pour des locaux qui en valent 2 500 € réduit artificiellement le résultat de 30 000 € par an.

**Retraitement** : on ramène le loyer au prix de marché et on ajoute la différence à l'EBITDA.

### Comment déterminer le loyer de marché ?

- Consulter les **annonces immobilières** pour des locaux similaires dans la même zone
- Demander une **estimation** à un agent immobilier commercial ou un expert immobilier
- Se référer aux **indices INSEE** de loyers commerciaux (ILC) ou industriels (ILAT)
- Analyser les **baux comparables** dans le même secteur géographique

### Impact sur la structure de la transaction

La question du loyer est stratégique car elle influence la **structure de la cession** :

- Si les murs sont inclus dans la vente : pas de retraitement nécessaire, mais la valorisation des murs s'ajoute au prix
- Si les murs restent la propriété du cédant : le repreneur doit s'assurer que le bail sera renouvelé à des **conditions de marché** raisonnables
- **Bail à renégocier** : si le bail arrive à échéance, c'est un risque pour le repreneur et un facteur de décote (voir [[decote-surcote-valorisation]])

Il est fortement recommandé de sécuriser un **nouveau bail commercial** aux conditions de marché avant la cession, pour rassurer l'acquéreur et faciliter la transaction.`
    },
    {
      id: 'credit-bail-amortissements',
      title: 'Crédit-bail et politique d\'amortissement',
      content: `Les **contrats de crédit-bail** (leasing) et les **choix d'amortissement** sont des sources fréquentes de distorsion comptable qu'il faut neutraliser pour obtenir un EBITDA comparable.

### Le retraitement du crédit-bail

En comptabilité française, les redevances de crédit-bail sont comptabilisées en **charges d'exploitation**. Or, économiquement, le crédit-bail est un mode de financement : l'entreprise acquiert un bien en le payant sur la durée.

**Retraitement standard** :
- On retire la redevance de crédit-bail des charges d'exploitation
- On réintègre un **amortissement fictif** du bien (comme si l'entreprise l'avait acheté)
- On comptabilise les **intérêts financiers fictifs** correspondants

Ce retraitement **augmente l'EBITDA** car on remplace une charge d'exploitation (redevance) par un amortissement (sous l'EBITDA) et des intérêts financiers.

### Exemple chiffré

Un véhicule utilitaire en crédit-bail :
- Redevance annuelle : 12 000 €
- Valeur du bien : 45 000 €
- Durée : 4 ans
- Amortissement annuel fictif : 11 250 €
- Intérêts financiers fictifs : 750 €

**Impact sur l'EBITDA** : +12 000 € (suppression redevance) car l'amortissement et les intérêts sont sous l'EBITDA.

### La politique d'amortissement

Les choix d'amortissement n'impactent pas directement l'EBITDA (les dotations sont en dessous), mais ils affectent le **résultat net** et la **valeur des actifs** au bilan.

**Retraitements courants** :
- **Amortissement dégressif** : utilisé pour son avantage fiscal, il ne reflète pas la dépréciation économique réelle. On recalcule un amortissement **linéaire** sur la durée de vie réelle
- **Amortissements exceptionnels** : certaines charges sont amorties sur une durée anormalement courte pour maximiser la déduction fiscale
- **Actifs entièrement amortis mais encore utilisés** : ils ont une valeur d'usage à réintégrer

### L'importance pour l'acquéreur

Pour un acquéreur, le retraitement du crédit-bail et des amortissements permet de comparer des entreprises sur une **base homogène**, indépendamment de leurs choix de financement et de leur politique comptable. C'est un passage obligé dans tout processus de [[due-diligence-acquisition]].`
    },
    {
      id: 'impact-valorisation',
      title: 'L\'impact cumulé des retraitements sur la valorisation',
      content: `Pour mesurer l'importance des retraitements, prenons un **cas pratique complet** illustrant leur effet cumulé sur la valorisation d'une PME industrielle.

### Données de départ

- **Chiffre d'affaires** : 3 500 000 €
- **EBITDA comptable** : 280 000 €
- **Marge d'EBITDA apparente** : 8%

### Tableau des retraitements

**Rémunération du dirigeant** :
- Rémunération réelle (salaire + charges + avantages) : 180 000 €
- Rémunération normative d'un DG salarié : 110 000 €
- **Retraitement : +70 000 €**

**Emploi du conjoint** :
- Salaire chargé du conjoint employé à mi-temps : 25 000 €
- Travail effectif correspondant à un quart-temps : 12 500 €
- **Retraitement : +12 500 €**

**Véhicule personnel** :
- Véhicule premium en charges de l'entreprise (amortissement + frais) : 18 000 €/an
- Véhicule professionnel justifié : 8 000 €/an
- **Retraitement : +10 000 €**

**Loyer SCI** :
- Loyer payé à la SCI du dirigeant : 4 500 €/mois = 54 000 €/an
- Loyer de marché : 3 000 €/mois = 36 000 €/an
- **Retraitement : +18 000 €**

**Crédit-bail** :
- Redevances annuelles de crédit-bail : 24 000 €
- **Retraitement : +24 000 €**

**Charges exceptionnelles** :
- Procès (provision non récurrente) : 15 000 €
- Sinistre machines : 8 000 €
- **Retraitement : +23 000 €**

### Résultat retraité

- EBITDA comptable : 280 000 €
- Total des retraitements : **+157 500 €**
- **EBITDA retraité : 437 500 €**
- **Marge d'EBITDA réelle : 12,5%**

### Impact sur la valorisation

Avec un multiple sectoriel de 6x :

- Valorisation sur EBITDA comptable : 280 000 × 6 = **1 680 000 €**
- Valorisation sur EBITDA retraité : 437 500 × 6 = **2 625 000 €**
- **Différence : 945 000 €** soit +56%

Cet exemple illustre pourquoi les retraitements ne sont pas un détail technique mais un **enjeu financier majeur**. Pour une valorisation complète intégrant les retraitements, consultez [[valorisation-entreprise-methodes]].`
    }
  ],
  faq: [
    {
      question: 'Qui doit réaliser les retraitements comptables lors d\'une cession ?',
      answer: 'Les retraitements sont généralement réalisés par l\'expert-comptable du cédant en collaboration avec le conseil en cession (banquier d\'affaires ou intermédiaire). Du côté de l\'acquéreur, les retraitements sont vérifiés et parfois contestés lors de la due diligence financière menée par un cabinet d\'audit. Il est recommandé que le cédant fasse réaliser ses propres retraitements en amont pour maîtriser le narratif et anticiper les questions de l\'acquéreur.'
    },
    {
      question: 'Les retraitements sont-ils acceptés par les acquéreurs ou font-ils l\'objet de négociations ?',
      answer: 'Les retraitements font systématiquement l\'objet de discussions lors des négociations. Les retraitements les plus courants (rémunération du dirigeant, charges exceptionnelles documentées) sont généralement acceptés sans difficulté. En revanche, les retraitements plus subjectifs (optimisation du loyer, potentiel de synergies) sont souvent contestés. Il est crucial de documenter chaque retraitement avec des pièces justificatives solides : études de marché, factures, contrats de référence.'
    },
    {
      question: 'Peut-on retraiter les comptes sur plus de 3 ans ?',
      answer: 'Il est standard d\'analyser les 3 derniers exercices pour les retraitements, mais on peut remonter jusqu\'à 5 ans pour identifier les tendances et les anomalies récurrentes. Au-delà de 5 ans, les données sont généralement trop anciennes pour être pertinentes. L\'important est de constituer un historique suffisant pour distinguer les charges véritablement exceptionnelles des charges cycliques qui se reproduisent tous les 3-4 ans (remplacement de matériel, ravalement de façade, etc.).'
    }
  ],
  cta: {
    tool: 'Valuations',
    text: 'Obtenez une valorisation avec retraitements'
  }
};
