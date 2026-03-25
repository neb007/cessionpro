export default {
  chapters: [
    {
      id: 'enjeux-valorisation-difficulte',
      title: 'Les enjeux spécifiques de la valorisation d\'une entreprise en difficulté',
      content: `Valoriser une entreprise en difficulté est un exercice radicalement différent de la valorisation d'une entreprise saine. Les méthodes classiques (multiples d'EBITDA, DCF) perdent en pertinence lorsque l'entreprise présente des résultats négatifs, une trésorerie en tension et un avenir incertain.

**Pourquoi la valorisation est-elle complexe ?**

Plusieurs facteurs compliquent l'exercice :

- **Résultats négatifs** : un EBITDA négatif ou erratique rend impossible l'application directe des multiples de marché
- **Incertitude sur la continuité d'exploitation** : le principe de going concern, fondement de toute valorisation, est remis en question
- **Perte de valeur accélérée** : chaque jour qui passe en situation de difficulté érode la valeur (fuite des clients, départ des talents, dégradation des actifs)
- **Asymétrie d'information** : le repreneur dispose souvent d'informations incomplètes, ce qui le pousse à appliquer des décotes de précaution
- **Contexte de vente forcée** : le cédant est en position de faiblesse, ce qui pèse sur le prix (fire sale discount)

**Les objectifs de la valorisation**

Selon l'interlocuteur, la valorisation poursuit des objectifs différents :

- **Pour le repreneur** : déterminer le prix maximum qu'il peut payer en intégrant le coût de retournement et le risque d'échec
- **Pour le tribunal** : évaluer si le prix offert est raisonnable au regard de la valeur des actifs
- **Pour les créanciers** : comparer le produit de la cession avec le dividende qu'ils percevraient en liquidation
- **Pour le dirigeant** : comprendre ce que vaut encore son entreprise et négocier au mieux

Les méthodes de valorisation classiques sont détaillées dans [[methodes-valorisation-entreprise]], mais doivent être adaptées au contexte de difficulté.

**L'impact du contexte juridique**

Le cadre juridique influence directement la valorisation :

- **Cession amiable** : le prix est librement négocié, mais la position de faiblesse du vendeur pèse
- **Redressement judiciaire** (voir [[tribunal-commerce-cession-plan]]) : le tribunal arbitre entre les offres selon des critères légaux (emploi, prix, projet)
- **Liquidation judiciaire** : le prix reflète la valeur de liquidation, souvent très inférieure à la valeur d'exploitation
- **Prepack cession** (voir [[prepack-cession-procedure]]) : la confidentialité de la phase de préparation préserve la valeur`
    },
    {
      id: 'methodes-valorisation-adaptees',
      title: 'Les méthodes de valorisation adaptées aux entreprises en difficulté',
      content: `Les méthodes de valorisation doivent être adaptées au contexte spécifique de l'entreprise en difficulté. Trois approches sont couramment utilisées, seules ou en combinaison.

**1. La valorisation par les actifs (approche patrimoniale)**

C'est souvent la méthode la plus pertinente pour une entreprise en difficulté :

- **Actif net comptable corrigé (ANCC)** : valeur des actifs au bilan, corrigée des plus ou moins-values latentes et des provisions insuffisantes ou excessives
- **Valeur de liquidation** : valeur des actifs en cas de vente forcée, avec application de décotes significatives :
  - Immobilier : décote de 20 à 40 % par rapport à la valeur vénale
  - Matériel industriel : décote de 40 à 70 % (plus encore pour le matériel spécifique)
  - Stocks : décote de 30 à 80 % selon l'obsolescence et la liquidité
  - Créances clients : décote de 20 à 50 % selon l'ancienneté et la solvabilité
- **Valeur de remplacement** : coût de reconstitution de l'outil de production, des brevets, de la clientèle

**2. La valorisation par les flux futurs (DCF adapté)**

La méthode des DCF (Discounted Cash-Flows) peut être adaptée :

- **Scénarios multiples** : établir plusieurs scénarios (pessimiste, base, optimiste) avec des probabilités pondérées
- **Business plan de retournement** : les flux futurs sont basés sur le plan de retournement du repreneur, pas sur les résultats passés (voir [[retournement-entreprise-strategies]])
- **Taux d'actualisation élevé** : le risque accru se traduit par un taux d'actualisation majoré (CMPC de 15 à 25 %, contre 8 à 12 % pour une entreprise saine)
- **Valeur terminale réduite** : l'incertitude sur le long terme justifie une valeur terminale plus faible ou l'absence de valeur terminale

**3. La valorisation par les transactions comparables**

L'analyse de transactions comparables dans le secteur fournit des repères utiles :

- **Transactions judiciaires** : prix payés dans d'autres plans de cession judiciaire du même secteur
- **Multiples de cession en difficulté** : typiquement 2 à 5x l'EBITDA normatif (contre 5 à 10x pour une entreprise saine)
- **Ratio prix/CA** : souvent utilisé lorsque l'EBITDA est négatif (multiples de 0,1 à 0,5x le CA pour les entreprises en difficulté)

**4. L'approche par le coût d'acquisition total (Total Cost of Acquisition)**

Cette méthode, spécifique au contexte de difficulté, intègre tous les coûts :

- **Prix de cession** : montant payé au vendeur ou au tribunal
- **Coût de retournement** : investissements nécessaires (CAPEX de remise à niveau, recrutement, marketing)
- **Pertes d'exploitation** : free cash-flow négatif pendant la phase de redressement (typiquement 6 à 18 mois)
- **BFR de relance** : reconstitution des stocks, avances aux fournisseurs (paiement comptant)
- **Coûts sociaux** : plan social éventuel, indemnités de licenciement
- **Honoraires** : avocats, conseils, experts

Le repreneur compare le coût d'acquisition total avec la valeur normative de l'entreprise une fois retournée (typiquement valorisée à 5-8x l'EBITDA normatif).`
    },
    {
      id: 'facteurs-decote-prime',
      title: 'Facteurs de décote et de prime dans la valorisation',
      content: `La valorisation d'une entreprise en difficulté est ajustée par des facteurs de décote (qui réduisent la valeur) et, plus rarement, des facteurs de prime (qui augmentent la valeur).

**Les facteurs de décote**

Décote de liquidité (fire sale discount) :

- Vente contrainte dans un délai court → pouvoir de négociation réduit
- Décote typique : 20 à 50 % par rapport à une cession amiable
- Plus le délai est court (liquidation judiciaire), plus la décote est forte

Décote de risque de retournement :

- Incertitude sur le succès du plan de redressement
- Décote proportionnelle au risque perçu : 10 à 40 %
- Facteurs aggravants : causes structurelles, marché en déclin, technologie obsolète

Décote de perte de substance :

- Clients perdus pendant la période de difficulté
- Salariés clés partis (savoir-faire perdu)
- Actifs dégradés par sous-investissement
- Décote variable selon la gravité de l'érosion : 10 à 30 %

Décote d'illiquidité informationnelle :

- Le repreneur dispose souvent d'informations incomplètes ou de mauvaise qualité
- L'asymétrie d'information pousse à la prudence
- Décote de 5 à 15 % pour compenser le risque de « cadavres dans le placard »

**Les facteurs de prime**

Dans certains cas, des éléments peuvent soutenir ou augmenter la valorisation :

- **Actifs stratégiques** : marque forte, brevets, technologie propriétaire, emplacement immobilier premium
- **Base clients fidèle** : un portefeuille de clients récurrents et diversifiés a une valeur intrinsèque
- **Savoir-faire unique** : compétences techniques rares, certifications, agréments réglementaires
- **Barrières à l'entrée** : autorisations administratives, licences, quota (pharmacie, transport, etc.)
- **Synergie avec l'acquéreur** : si le repreneur est un industriel, les synergies peuvent justifier un prix supérieur
- **Potentiel de rebond** : entreprise dont les difficultés sont conjoncturelles avec un marché porteur

**L'estimation de la valeur : une fourchette, pas un chiffre**

Dans le contexte de difficulté, il est essentiel de raisonner en **fourchette de valorisation** :

- **Plancher** : valeur de liquidation (le prix minimum en dessous duquel il vaut mieux liquider les actifs séparément)
- **Valeur centrale** : valeur d'exploitation en continuité, ajustée des décotes de risque
- **Plafond** : valeur normative de l'entreprise retournée, actualisée du risque et du coût de retournement

La différence entre le plancher et le plafond peut être considérable (facteur de 1 à 5 ou plus), ce qui explique la difficulté des négociations.

Pour les méthodes de valorisation classiques, voir [[methodes-valorisation-entreprise]].`
    },
    {
      id: 'role-expert-evaluation',
      title: 'Le rôle de l\'expert en évaluation et les bonnes pratiques',
      content: `L'évaluation d'une entreprise en difficulté nécessite l'intervention d'un professionnel expérimenté, capable de combiner analyse financière, vision stratégique et connaissance du droit des entreprises en difficulté.

**Qui réalise l'évaluation ?**

Plusieurs professionnels peuvent intervenir :

- **Expert-comptable** : évaluation patrimoniale, analyse des comptes, retraitements
- **Cabinet de conseil en évaluation** : méthodologie multicritères, benchmarks de marché, rapport d'évaluation formalisé
- **Banquier d'affaires** : dans les opérations mid-cap, le conseil financier réalise l'évaluation dans le cadre de son mandat
- **Expert judiciaire** : désigné par le tribunal pour évaluer les actifs dans le cadre d'une procédure collective (article 232 du Code de procédure civile)
- **Commissaire-priseur judiciaire** : pour l'évaluation des actifs mobiliers (machines, stocks, véhicules)

**Les bonnes pratiques d'évaluation**

L'évaluateur d'une entreprise en difficulté doit respecter plusieurs principes :

- **Multicritères** : utiliser au minimum deux méthodes et les croiser pour obtenir une fourchette de valeur
- **Transparence** : expliciter les hypothèses retenues, les retraitements effectués, les décotes appliquées
- **Prudence** : dans le doute, retenir l'hypothèse la plus conservatrice
- **Actualité** : les données doivent être récentes, la situation d'une entreprise en difficulté évoluant rapidement
- **Indépendance** : l'évaluateur doit être indépendant des parties pour que son travail soit crédible

**Les normes et référentiels**

L'évaluation doit s'appuyer sur des normes reconnues :

- **Référentiel de la CNCC** (Compagnie nationale des commissaires aux comptes) : guide d'évaluation pour les commissaires aux comptes
- **Normes IVSC** (International Valuation Standards Council) : normes internationales d'évaluation
- **Guide de l'évaluation des entreprises de la CCEF** (Compagnie des conseils et experts financiers) : méthodologie française de référence
- **Doctrine fiscale** : l'administration fiscale (BOI-ENR-DMTOM) a sa propre doctrine d'évaluation des titres de sociétés

**Les erreurs d'évaluation fréquentes**

- **Surestimer la valeur des actifs** : les valeurs comptables ne reflètent pas la réalité du marché (matériel amorti mais encore utilisé, matériel surévalué au bilan)
- **Ignorer le passif latent** : provisions insuffisantes, litiges non provisionnés, engagements hors bilan
- **Confondre valeur d'exploitation et valeur de liquidation** : la valeur en continuité d'exploitation est toujours supérieure à la valeur de liquidation
- **Négliger le coût de retournement** : le prix d'acquisition n'est qu'une composante du coût total pour le repreneur
- **Appliquer mécaniquement les multiples de marché** : les multiples d'entreprises saines ne s'appliquent pas aux entreprises en difficulté sans ajustement significatif

Pour comprendre les enjeux de la reprise d'entreprise en difficulté, voir [[reprendre-entreprise-difficulte]].`
    }
  ],
  faq: [
    {
      question: 'Quelle décote appliquer pour une entreprise en difficulté par rapport à une entreprise saine ?',
      answer: 'La décote totale varie généralement entre 30 % et 70 % par rapport à la valorisation d\'une entreprise saine comparable. Elle se décompose en : décote de liquidité/vente forcée (20-50 %), décote de risque de retournement (10-40 %), décote de perte de substance (10-30 %). La décote exacte dépend de la gravité de la situation, du contexte juridique (redressement vs liquidation), de la qualité des actifs et du potentiel de rebond.'
    },
    {
      question: 'Comment valoriser une entreprise dont l\'EBITDA est négatif ?',
      answer: 'Lorsque l\'EBITDA est négatif, les multiples d\'EBITDA ne sont pas applicables. Il faut recourir à d\'autres méthodes : la valorisation patrimoniale (actif net corrigé ou valeur de liquidation), le ratio prix/chiffre d\'affaires (multiples de 0,1 à 0,5x le CA), ou la méthode du coût d\'acquisition total (prix + coût de retournement vs valeur normative post-retournement). La méthode DCF peut aussi être adaptée en s\'appuyant sur les flux futurs du business plan de retournement, avec un taux d\'actualisation élevé.'
    },
    {
      question: 'Le prix de cession judiciaire est-il négociable ?',
      answer: 'Dans le cadre d\'un plan de cession judiciaire, le prix n\'est pas négocié au sens classique. Le repreneur dépose une offre avec un prix, et le tribunal choisit parmi les offres selon les critères légaux (emploi, prix, projet). Cependant, le repreneur a une marge de manœuvre dans la rédaction de son offre : il fixe librement son prix et peut structurer son offre de manière stratégique (prix immédiat + complément différé, engagement conditionnel). En prepack cession, le prix est effectivement négocié pendant la phase confidentielle avant d\'être soumis au tribunal.'
    }
  ],
  cta: {
    text: 'Estimez la valeur d\'une entreprise en difficulté avec notre outil de valorisation',
    tool: 'Valuations'
  }
};
