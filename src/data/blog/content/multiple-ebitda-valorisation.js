export default {
  chapters: [
    {
      id: 'quest-ce-que-ebitda',
      title: 'Qu\'est-ce que l\'EBITDA ?',
      content: `L'**EBITDA** (Earnings Before Interest, Taxes, Depreciation and Amortization) est l'équivalent anglo-saxon de l'**excédent brut d'exploitation** (EBE) en comptabilité française. C'est un indicateur central dans la valorisation des entreprises car il mesure la **performance opérationnelle pure** d'une activité.

### Calcul de l'EBITDA

L'EBITDA se calcule de deux façons :

- **Méthode soustractive** : Chiffre d'affaires - Achats et charges externes - Charges de personnel - Autres charges d'exploitation
- **Méthode additive** : Résultat net + Impôts + Intérêts financiers + Dotations aux amortissements et provisions

### Pourquoi l'EBITDA et pas le résultat net ?

L'EBITDA est préféré au résultat net car il **neutralise** :

- Les **choix de financement** (charges d'intérêts)
- Les **politiques d'amortissement** (qui peuvent varier d'une entreprise à l'autre)
- Les **éléments exceptionnels** qui ne reflètent pas la performance récurrente
- L'**optimisation fiscale** propre au cédant

Cela permet de comparer des entreprises sur une base **homogène**, quel que soit leur mode de financement ou leur politique comptable. C'est pourquoi les acquéreurs et les fonds d'investissement raisonnent systématiquement en multiples d'EBITDA.

Pour une vision complète des méthodes de valorisation, consultez [[valorisation-entreprise-methodes]].`
    },
    {
      id: 'pourquoi-les-multiples',
      title: 'Pourquoi raisonner en multiples ?',
      content: `Le **multiple d'EBITDA** est le ratio le plus utilisé en M&A pour valoriser une entreprise. La logique est intuitive : un acheteur paie un certain nombre de fois le bénéfice opérationnel annuel de l'entreprise qu'il acquiert.

### La formule fondamentale

**Valeur d'entreprise (VE) = EBITDA retraité × Multiple**

Le multiple exprime combien d'années de résultat l'acheteur est prêt à « payer d'avance ». Un multiple de 6x signifie que l'acheteur paie l'équivalent de 6 années d'EBITDA.

### Ce que le multiple intègre implicitement

Derrière un chiffre apparemment simple, le multiple capture de nombreuses informations :

- **Le risque sectoriel** : les secteurs stables (santé, agroalimentaire) ont des multiples plus élevés que les secteurs cycliques (BTP, automobile)
- **Les perspectives de croissance** : un secteur en expansion justifie un multiple supérieur
- **La rentabilité structurelle** : les secteurs à forte marge bénéficient de multiples plus élevés
- **Les conditions du marché M&A** : en période d'abondance de liquidités, les multiples augmentent globalement

### Multiple d'EBITDA vs multiple de CA

Le multiple de chiffre d'affaires est parfois utilisé pour les entreprises déficitaires (startups, tech). Mais il est **moins pertinent** car il ne tient pas compte de la rentabilité. Deux entreprises avec le même CA mais des marges de 5% et 20% n'ont évidemment pas la même valeur.`
    },
    {
      id: 'multiples-sectoriels',
      title: 'Les multiples sectoriels de référence',
      content: `Les multiples d'EBITDA varient considérablement d'un secteur à l'autre. Voici les **fourchettes indicatives** observées sur le marché français pour les PME (CA de 2 à 20 M€) :

### Multiples par secteur (PME françaises)

- **Services numériques / SaaS** : 8x à 14x EBITDA — prime pour la récurrence des revenus et la scalabilité
- **Santé / Pharmacie** : 7x à 11x EBITDA — secteur défensif avec une demande structurelle
- **Industrie spécialisée** : 5x à 8x EBITDA — dépend fortement du carnet de commandes et de l'outil industriel
- **Distribution spécialisée** : 4x à 7x EBITDA — marges plus faibles compensées par la récurrence
- **BTP / Construction** : 4x à 6x EBITDA — secteur cyclique, forte dépendance aux marchés publics
- **Restauration / Hôtellerie** : 4x à 7x EBITDA — très variable selon l'emplacement et le concept
- **Transport / Logistique** : 4x à 6x EBITDA — capitalistique, sensible aux coûts énergétiques
- **Commerce de détail** : 3x à 5x EBITDA — pression de la concurrence en ligne
- **Agriculture / Viticulture** : 5x à 9x EBITDA — forte composante patrimoniale (foncier)

### Facteurs qui font varier le multiple au sein d'un même secteur

- **La taille** : une entreprise plus grande commande un multiple plus élevé (prime de taille)
- **La croissance** : +10% de croissance annuelle peut ajouter 1 à 2 points de multiple
- **La récurrence** : un portefeuille de contrats récurrents justifie une prime de 20 à 40%
- **La géographie** : les entreprises franciliennes ont souvent des multiples supérieurs

Ces multiples sont des **ordres de grandeur**. Chaque transaction est unique et les ajustements spécifiques (décotes et surcotes) modifient significativement le résultat. Voir [[decote-surcote-valorisation]] pour approfondir.`
    },
    {
      id: 'retraitements-necessaires',
      title: 'Les retraitements indispensables de l\'EBITDA',
      content: `Appliquer un multiple à l'EBITDA comptable brut serait une erreur grossière. L'EBITDA doit impérativement être **retraité** pour refléter la performance économique réelle et récurrente de l'entreprise.

### Les principaux retraitements

**Rémunération du dirigeant** : dans les PME, le dirigeant se verse souvent une rémunération inférieure ou supérieure au marché. Il faut retraiter pour intégrer le **coût d'un dirigeant salarié** au prix du marché. Si le dirigeant-cédant se verse 150 000 € alors qu'un directeur général coûterait 100 000 €, on ajoute 50 000 € à l'EBITDA.

**Charges exceptionnelles ou non récurrentes** :
- Frais de procès ou contentieux
- Investissements de mise aux normes ponctuels
- Sinistres non couverts par l'assurance
- Frais de restructuration passés

**Loyers anormaux** : si l'entreprise occupe des locaux appartenant au dirigeant avec un loyer sous-évalué ou surévalué, il faut ajuster au **loyer de marché**.

**Avantages en nature** : véhicules personnels, voyages, charges familiales passées en charge de l'entreprise doivent être réintégrés.

**Charges de crédit-bail** : les redevances de crédit-bail doivent être retraitées en **amortissement + intérêts** pour reconstituer un EBITDA comparable.

### Impact sur la valorisation

Les retraitements peuvent modifier l'EBITDA de **20 à 50%** dans les PME patrimoniales. Un EBITDA comptable de 300 000 € peut devenir un EBITDA retraité de 450 000 € après correction. Avec un multiple de 6x, cela représente une différence de **900 000 €** sur la valorisation.

Pour un guide complet des retraitements, consultez [[retraitements-valorisation]].`
    },
    {
      id: 'appliquer-le-multiple',
      title: 'Appliquer le multiple : du calcul au prix de cession',
      content: `Une fois l'EBITDA retraité et le multiple sectoriel déterminé, le calcul de la **valeur d'entreprise** (VE) est mécanique. Mais il reste plusieurs étapes pour passer de la VE au **prix de cession des titres**.

### Étape 1 : Calcul de la valeur d'entreprise

**VE = EBITDA retraité × Multiple retenu**

Exemple : EBITDA retraité de 400 000 € × multiple de 6x = **VE de 2 400 000 €**

### Étape 2 : Passage à la valeur des titres (equity value)

La valeur d'entreprise inclut la dette financière. Pour obtenir la valeur des titres :

**Valeur des titres = VE - Dette financière nette**

Où la dette financière nette = Emprunts bancaires + Découverts - Trésorerie disponible - Placements financiers

Si l'entreprise a 300 000 € de dettes bancaires et 100 000 € de trésorerie :
Valeur des titres = 2 400 000 - 300 000 + 100 000 = **2 200 000 €**

### Étape 3 : Ajustements complémentaires

- **Besoin en fonds de roulement (BFR) normatif** : si le BFR réel est supérieur ou inférieur au BFR normatif, un ajustement de prix est opéré à la date de closing
- **Actifs hors exploitation** : un bien immobilier non nécessaire à l'exploitation est ajouté séparément
- **Provisions pour risques identifiés** : litiges en cours, redressement fiscal probable

### Étape 4 : Fourchette de négociation

En pratique, on retient une **fourchette de multiples** (ex : 5x à 7x) qui donne une fourchette de prix. Le positionnement dans cette fourchette dépendra du rapport de force entre vendeur et acheteur, de l'urgence de la transaction et du nombre de candidats repreneurs.

La structuration du prix final peut inclure un **earn-out** (complément de prix conditionnel) pour combler l'écart entre les attentes du cédant et celles de l'acquéreur.`
    },
    {
      id: 'limites-methode',
      title: 'Limites et pièges de la méthode des multiples',
      content: `Malgré sa popularité, la méthode des multiples présente des **limites significatives** qu'il est essentiel de connaître pour éviter les erreurs de valorisation.

### Les principaux pièges

**Utiliser un multiple inadapté** : appliquer un multiple de grande entreprise cotée à une TPE est une erreur classique. Les multiples des entreprises cotées intègrent une **prime de liquidité** que les PME non cotées ne méritent pas. Il faut systématiquement appliquer une **décote d'illiquidité** de 20 à 30%.

**Ignorer la qualité de l'EBITDA** : un EBITDA gonflé artificiellement (retard de maintenance, sous-investissement, report de charges) ne justifie pas le même multiple qu'un EBITDA de qualité.

**Négliger la dette cachée** : engagements hors bilan, provisions insuffisantes, litiges non provisionnés — autant d'éléments qui réduisent la valeur réelle des titres.

**Confondre moyenne et médiane** : dans un échantillon de transactions comparables, la médiane est souvent plus pertinente que la moyenne, car elle est moins sensible aux valeurs extrêmes.

### Quand la méthode des multiples n'est pas adaptée

- **Entreprises déficitaires** : impossible d'appliquer un multiple à un EBITDA négatif
- **Startups pré-revenue** : les méthodes spécifiques sont préférables (voir [[valorisation-startup]])
- **Entreprises en retournement** : l'EBITDA historique ne reflète pas le potentiel post-restructuration
- **Holdings mixtes** : la somme des parties (sum-of-the-parts) est plus appropriée

### Notre recommandation

La méthode des multiples doit toujours être **croisée avec au moins une autre approche** (DCF, patrimoniale, rendement) pour confirmer la fourchette de valorisation. Consultez [[valorisation-entreprise-methodes]] pour une vue d'ensemble des méthodes disponibles.`
    }
  ],
  faq: [
    {
      question: 'Comment trouver le multiple d\'EBITDA de mon secteur ?',
      answer: 'Les multiples sectoriels sont publiés par des bases de données spécialisées (Epsilon Research, Argos Index, MergerMarket) et par certains cabinets de conseil en M&A. Pour les PME françaises, l\'indice Argos publie trimestriellement les multiples médians par taille et secteur. Votre expert-comptable ou un conseil en cession peut également vous fournir des références de transactions récentes dans votre secteur.'
    },
    {
      question: 'Faut-il utiliser l\'EBITDA de la dernière année ou une moyenne ?',
      answer: 'Il est recommandé d\'utiliser une moyenne pondérée sur 3 ans, en donnant plus de poids aux années récentes (par exemple 50% pour N-1, 30% pour N-2, 20% pour N-3). Cela lisse les variations conjoncturelles. Si l\'entreprise est en forte croissance, on peut retenir l\'EBITDA prévisionnel de l\'année en cours, à condition qu\'il soit réaliste et documenté.'
    },
    {
      question: 'La dette de l\'entreprise réduit-elle le prix que je recevrai ?',
      answer: 'Oui, dans une cession de titres (parts sociales ou actions), la dette financière nette est déduite de la valeur d\'entreprise pour obtenir la valeur des titres. Concrètement, si votre entreprise vaut 2 M€ en valeur d\'entreprise et porte 500 000 € de dettes bancaires (net de trésorerie), le prix des titres sera de 1,5 M€. C\'est pourquoi il est souvent judicieux de rembourser les dettes avant la cession si la trésorerie le permet.'
    }
  ],
  cta: {
    tool: 'Valuations',
    text: 'Calculez la valorisation de votre PME'
  }
};
