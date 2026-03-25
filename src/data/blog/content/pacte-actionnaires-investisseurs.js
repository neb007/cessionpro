export default {
  chapters: [
    {
      id: 'role-pacte-actionnaires',
      title: 'Le rôle du pacte d\'actionnaires dans une opération avec investisseurs',
      content: `Le **pacte d'actionnaires** est une convention extra-statutaire qui organise les relations entre les associés d'une société, en complément des statuts. Lorsqu'un investisseur — fonds de private equity, venture capital ou investisseur privé — entre au capital, le pacte devient un document stratégique qui encadre la gouvernance, protège les minoritaires et organise la sortie.

**Pourquoi un pacte d'actionnaires est-il indispensable ?**

Les statuts, soumis à publicité au greffe du tribunal de commerce (articles L. 210-1 et suivants du Code de commerce), ne permettent pas de prévoir toutes les stipulations nécessaires. Le pacte d'actionnaires, **confidentiel**, offre une flexibilité supérieure :

- **Confidentialité** : contrairement aux statuts, le pacte n'est pas publié et reste entre les parties
- **Liberté contractuelle** : les parties peuvent prévoir des mécanismes sophistiqués non prévus par la loi
- **Protection renforcée** : l'investisseur y inscrit ses droits protecteurs, le fondateur ses garanties
- **Anticipation des conflits** : le pacte prévoit les mécanismes de résolution en cas de désaccord

**Le cadre juridique**

Le pacte d'actionnaires est régi par le droit commun des contrats (articles 1101 et suivants du Code civil). Sa validité est subordonnée aux conditions classiques :

- Consentement libre et éclairé des parties
- Conformité à l'ordre public et aux dispositions impératives du droit des sociétés
- Durée déterminée ou indéterminée (avec faculté de résiliation dans ce dernier cas)

En cas de violation, les sanctions sont principalement contractuelles : dommages et intérêts, exécution forcée (article 1221 du Code civil), voire nullité des actes pris en violation du pacte dans certains cas.

**La structure type d'un pacte avec investisseur**

Un pacte d'actionnaires dans le cadre d'une opération d'investissement comprend généralement :

- Les clauses relatives à la **gouvernance** de la société
- Les clauses relatives aux **mouvements de titres** (transfert, cession, émission)
- Les clauses relatives à la **sortie** des investisseurs
- Les clauses relatives à la **protection des minoritaires**
- Les clauses relatives aux **engagements des fondateurs/dirigeants**
- Les clauses de **reporting et d'information**

Pour comprendre le contexte global d'une opération avec un fonds, consultez [[venture-capital-vs-private-equity]].`
    },
    {
      id: 'tag-along-drag-along',
      title: 'Tag-along et drag-along : les clauses de sortie essentielles',
      content: `Les clauses de **tag-along** (droit de sortie conjointe) et de **drag-along** (obligation de sortie forcée) sont les deux piliers de la mécanique de sortie dans un pacte d'actionnaires avec investisseur.

**Le tag-along (droit de sortie conjointe)**

Le tag-along permet à un actionnaire minoritaire de se joindre à la cession réalisée par l'actionnaire majoritaire, aux mêmes conditions de prix et de modalités.

Fonctionnement :

- L'actionnaire majoritaire reçoit une offre d'achat pour ses titres
- Il en informe les bénéficiaires du tag-along, en communiquant les conditions de l'offre
- Les bénéficiaires disposent d'un délai (généralement 15 à 30 jours) pour exercer leur droit
- S'ils exercent leur droit, l'acquéreur doit acheter leurs titres aux mêmes conditions
- Si l'acquéreur refuse, la cession du majoritaire est bloquée

**Utilité pour l'investisseur** : le tag-along protège l'investisseur minoritaire contre le risque de se retrouver « piégé » avec un nouvel actionnaire majoritaire qu'il n'a pas choisi.

**Le drag-along (obligation de sortie forcée)**

Le drag-along permet à l'actionnaire majoritaire (ou à un groupe d'actionnaires détenant un seuil défini) de forcer l'ensemble des actionnaires à vendre leurs titres à un acquéreur tiers.

Fonctionnement :

- Le détenteur du droit de drag identifie un acquéreur et négocie les conditions de cession
- Il notifie les autres actionnaires de son intention d'exercer le drag-along
- Les actionnaires « draggés » sont obligés de céder leurs titres aux mêmes conditions
- Le refus constitue une violation contractuelle donnant lieu à exécution forcée

**Points de négociation critiques du drag-along** :

- **Seuil de déclenchement** : quel pourcentage de capital est nécessaire pour déclencher le drag ? (généralement 50 à 75 %)
- **Prix minimum** : le drag ne peut-il être exercé qu'au-delà d'un certain prix (floor price) ou d'un certain multiple de l'investissement initial ?
- **Délai** : le drag ne peut-il être exercé qu'après une certaine période (généralement 3 à 5 ans après l'investissement) ?
- **Conditions de marché** : le prix doit-il être validé par un expert indépendant ou résulter d'un processus compétitif ?

**L'articulation tag-along / drag-along**

Ces deux mécanismes sont complémentaires :

- Le **tag-along** protège le minoritaire : il peut sortir quand le majoritaire sort
- Le **drag-along** protège le majoritaire : il peut forcer la sortie de tous pour réaliser une cession à 100 %
- L'équilibre se trouve dans la négociation des conditions de déclenchement (seuils, prix minimum, délais)

Dans les opérations de LBO, le fonds PE détient généralement le drag-along et le cédant/management bénéficie du tag-along. En capital-risque, les clauses sont souvent plus symétriques.

Pour les aspects liés à la cession d'actions en SAS, voir [[cession-actions-sas]].`
    },
    {
      id: 'clause-ratchet',
      title: 'La clause de ratchet : protection anti-dilution',
      content: `Le **ratchet** est une clause de protection anti-dilution qui bénéficie à l'investisseur en cas de tour de financement ultérieur à une valorisation inférieure à celle à laquelle il a investi (down round).

**Le problème que résout le ratchet**

Un investisseur entre au capital à une valorisation de 10 M€ en investissant 2 M€, soit 20 % du capital. Si un tour ultérieur valorise la société à 5 M€, l'investisseur initial subit une perte de valeur disproportionnée par rapport à son niveau de risque initial. Le ratchet corrige cette asymétrie.

**Full ratchet**

Le full ratchet est la forme la plus protectrice pour l'investisseur :

- Le prix par action de l'investisseur est ajusté rétroactivement au prix du nouveau tour, quelle que soit la taille du nouveau tour
- Concrètement, l'investisseur reçoit des actions gratuites supplémentaires pour compenser la baisse de valorisation
- **Effet** : dilution maximale pour les fondateurs
- **Exemple** : investisseur ayant souscrit à 10 € par action. Nouveau tour à 5 € par action. Le full ratchet ramène le prix de l'investisseur initial à 5 €, doublant son nombre d'actions.

**Weighted average ratchet**

Le weighted average ratchet est la forme la plus courante et la plus équilibrée :

- L'ajustement prend en compte la taille du nouveau tour par rapport au capital existant
- **Broad-based weighted average** : inclut toutes les actions (ordinaires, préférentielles, options, warrants) dans le calcul
- **Narrow-based weighted average** : n'inclut que les actions préférentielles, offrant une protection plus forte à l'investisseur

La formule de calcul du nouveau prix est :

- Nouveau prix = Ancien prix × (Actions existantes + Actions à l'ancien prix) / (Actions existantes + Actions nouvelles)

**Points de négociation**

- **Type de ratchet** : full ratchet (rare, très protecteur) vs weighted average (standard du marché)
- **Durée** : le ratchet est-il limité dans le temps (sunset clause) ? Typiquement 12 à 24 mois.
- **Exceptions** : certains tours sont-ils exclus (augmentations de capital pour les salariés, petits tours de bridge) ?
- **Pay-to-play** : l'investisseur doit-il participer au nouveau tour pour bénéficier du ratchet ?

**Impact fiscal**

En droit fiscal français, l'émission d'actions gratuites dans le cadre d'un mécanisme de ratchet peut avoir des conséquences fiscales :

- Pour le bénéficiaire : possible imposition au titre de l'avantage en nature (si le mécanisme est assimilé à une rémunération)
- Pour les fondateurs dilués : pas d'imposition directe, mais réduction de la valeur de leur participation
- L'administration fiscale (BOI-RPPM-PVBMI) peut requalifier certains mécanismes

Il est fortement recommandé de consulter un avocat fiscaliste pour structurer le ratchet de manière optimale.

Pour une vue d'ensemble des différences entre VC et PE, voir [[venture-capital-vs-private-equity]].`
    },
    {
      id: 'gouvernance-reporting',
      title: 'Gouvernance et obligations de reporting',
      content: `Le pacte d'actionnaires avec investisseur instaure un cadre de gouvernance structuré qui va bien au-delà des dispositions statutaires. Ce cadre vise à protéger l'investissement tout en laissant au management la latitude nécessaire pour opérer.

**La composition des organes de gouvernance**

Le pacte définit la composition du conseil d'administration (SA) ou du comité stratégique (SAS) :

- **Représentation de l'investisseur** : 1 à 3 sièges selon sa participation au capital
- **Représentation du fondateur/management** : nombre de sièges proportionnel ou garanti
- **Administrateurs indépendants** : parfois exigés par le fonds, notamment en LBO
- **Observateurs (censeurs)** : droit de participer aux réunions sans droit de vote

**Les décisions soumises à autorisation préalable (reserved matters)**

Le pacte liste les décisions qui nécessitent l'accord préalable de l'investisseur, en plus des majorités légales :

- **Décisions stratégiques** : acquisitions ou cessions d'actifs au-delà d'un seuil, changement d'activité, partenariats stratégiques
- **Décisions financières** : endettement au-delà d'un plafond, investissements au-delà d'un budget, distribution de dividendes, augmentation de capital
- **Décisions RH** : recrutement ou licenciement de dirigeants clés, modification des rémunérations au-delà d'un seuil
- **Décisions corporate** : modification des statuts, fusion, transformation de la forme sociale, dissolution

**Les obligations de reporting**

L'investisseur exige généralement un reporting régulier et détaillé :

- **Reporting mensuel** : chiffre d'affaires, EBITDA, trésorerie, KPI opérationnels, comparaison budget/réalisé
- **Reporting trimestriel** : comptes trimestriels, situation de trésorerie, prévisions actualisées, revue des risques
- **Reporting annuel** : comptes annuels audités, budget de l'exercice suivant, plan stratégique à moyen terme
- **Reporting ad hoc** : information immédiate en cas d'événement significatif (litige majeur, perte d'un client clé, sinistre)

Le non-respect des obligations de reporting constitue généralement un cas de défaut (event of default) dans le pacte, pouvant déclencher des mécanismes de protection au bénéfice de l'investisseur.

**Les comités spécialisés**

Dans les opérations significatives, le pacte peut prévoir la création de comités :

- **Comité d'audit** : supervise les comptes et les procédures de contrôle interne
- **Comité des rémunérations** : valide les packages de rémunération du management
- **Comité stratégique** : discute des orientations stratégiques et des investissements
- **Comité M&A** : dans les stratégies de build-up, supervise les acquisitions complémentaires

Pour les aspects liés à la gouvernance familiale, voir [[gouvernance-familiale-succession]].`
    },
    {
      id: 'negociation-pieges-eviter',
      title: 'Négociation du pacte : les pièges à éviter',
      content: `La négociation du pacte d'actionnaires avec un investisseur est un exercice délicat qui requiert une expertise juridique et financière pointue. Voici les principaux pièges à éviter et les points de vigilance essentiels.

**Pour le fondateur / cédant**

Pièges courants :

- **Sous-estimer le drag-along** : accepter un drag-along sans prix minimum ou sans délai de maturité expose le fondateur à une vente forcée à un prix insuffisant
- **Ignorer la liquidation preference** : une liquidation preference participating avec un multiple supérieur à 1x réduit significativement le retour du fondateur en cas de sortie à un prix modeste
- **Accepter un full ratchet** : le full ratchet peut entraîner une dilution massive en cas de down round. Privilégier le weighted average.
- **Négliger les clauses de good leaver / bad leaver** : le fondateur doit s'assurer que les conditions de sortie « good leaver » sont clairement définies et incluent un rachat à la juste valeur
- **Omettre les clauses de protection personnelle** : garantie d'emploi, indemnité en cas de révocation, maintien de certains avantages

Points de négociation essentiels pour le fondateur :

- **Prix minimum de drag-along** : exiger un floor price basé sur un multiple minimum de l'investissement ou de l'EBITDA
- **Sunset clauses** : limiter la durée de certaines clauses (ratchet, non-concurrence, lock-up)
- **Droit de premier refus (right of first offer)** : possibilité de racheter les titres de l'investisseur avant qu'il ne les cède à un tiers
- **Clause de sortie du fondateur** : mécanisme de put permettant au fondateur de vendre ses titres après une certaine période

**Pour l'investisseur**

Points de vigilance :

- **Information asymétrique** : s'assurer que les obligations de reporting sont suffisamment précises et fréquentes
- **Protection contre la dilution** : anti-dilution (ratchet), droits préférentiels de souscription, clause d'agrément
- **Contrôle de la gouvernance** : droit de veto sur les décisions clés, représentation au board, droit d'audit
- **Mécanisme de sortie forcée** : s'assurer que le drag-along ou le put permettent de forcer une sortie à terme
- **Non-concurrence et exclusivité** : engagement du fondateur de se consacrer exclusivement à la société

**Bonnes pratiques de négociation**

- **Se faire accompagner** : avocat spécialisé en droit des sociétés et M&A, conseil financier
- **Négocier la term sheet avant le pacte** : la lettre d'intention fixe les grands principes, le pacte les détaille. Il est plus facile de négocier les principes en amont.
- **Benchmarker les clauses** : comparer avec les standards du marché (Galion Term Sheet pour le VC, standards AFIC/France Invest pour le PE)
- **Anticiper les scénarios de crise** : deadlock, désaccord stratégique, défaut de l'une des parties
- **Prévoir un mécanisme de résolution des conflits** : médiation, arbitrage (souvent ICC ou CMAP), ou clause attributive de juridiction

Le pacte d'actionnaires est un document vivant qui reflète l'équilibre des rapports de force au moment de sa signature. Sa rédaction doit être confiée à un avocat expérimenté en transactions avec investisseurs.

Pour les aspects liés à la responsabilité du dirigeant dans ce contexte, voir [[responsabilite-dirigeant-cession]].`
    }
  ],
  faq: [
    {
      question: 'Quelle est la différence entre un pacte d\'actionnaires et les statuts ?',
      answer: 'Les statuts sont le document constitutif de la société, publié au greffe du tribunal de commerce et opposable aux tiers. Le pacte d\'actionnaires est un contrat privé, confidentiel, qui complète les statuts avec des clauses plus détaillées et sophistiquées (tag-along, drag-along, ratchet, reporting). Les statuts sont limités par les dispositions impératives du Code de commerce, tandis que le pacte bénéficie d\'une plus grande liberté contractuelle.'
    },
    {
      question: 'Peut-on modifier un pacte d\'actionnaires après sa signature ?',
      answer: 'Oui, un pacte d\'actionnaires peut être modifié par avenant avec le consentement de toutes les parties (ou de la majorité définie dans le pacte). Les modifications courantes portent sur les seuils de gouvernance, les conditions de sortie, ou l\'ajout de nouveaux investisseurs. Chaque modification doit être formalisée par écrit et signée par les parties concernées.'
    },
    {
      question: 'Que se passe-t-il en cas de violation du pacte d\'actionnaires ?',
      answer: 'La violation d\'un pacte d\'actionnaires expose le contrevenant à des dommages et intérêts (article 1231-1 du Code civil) et potentiellement à une exécution forcée en nature (article 1221 du Code civil). La jurisprudence a évolué : depuis l\'arrêt de la Cour de cassation du 11 juillet 2006, les actes conclus en violation d\'un pacte de préférence peuvent être annulés si le tiers était de mauvaise foi. Le pacte prévoit souvent des clauses pénales ou des mécanismes spécifiques en cas de violation.'
    }
  ],
  cta: {
    text: 'Préparez votre entrée en négociation avec un investisseur : évaluez votre entreprise',
    tool: 'Valuations'
  }
};
