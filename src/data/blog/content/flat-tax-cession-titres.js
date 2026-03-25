export default {
  chapters: [
    {
      id: 'flat-tax-principe',
      title: 'La flat tax : principes et fonctionnement',
      content: `La **flat tax** (ou Prélèvement Forfaitaire Unique — PFU), instaurée par la loi de finances pour 2018, est devenue le régime d'imposition par défaut des plus-values de cession de titres en France. Avec un taux global de **30 %**, elle a profondément modifié le paysage fiscal de la cession d'entreprise.

**La composition de la flat tax**

Le PFU de 30 % se décompose en deux volets :

- **12,8 % au titre de l'impôt sur le revenu** (IR)
- **17,2 % au titre des prélèvements sociaux** (PS), comprenant :
  - CSG : 9,2 %
  - CRDS : 0,5 %
  - Prélèvement de solidarité : 7,5 %

**Le champ d'application**

La flat tax s'applique aux plus-values de cession de :

- **Parts sociales** (SARL, SCI, SNC, etc.)
- **Actions** (SA, SAS, SCA)
- **Titres de sociétés de personnes** (lorsque le contribuable n'exerce pas d'activité dans la société)
- **Droits sociaux assimilés** (obligations convertibles, bons de souscription, etc.)
- **Parts de fonds communs** (OPCVM, FCPR, FIP, FCPI)

**Le calcul de la plus-value**

La plus-value imposable est calculée comme suit :

- **Plus-value brute** = Prix de cession — Prix d'acquisition (ou valeur d'apport, de souscription ou de donation)
- **Frais déductibles** : frais d'acquisition (droits d'enregistrement, frais de courtage, honoraires de conseil — dans les conditions de l'article 150-0 D du CGI)
- **Plus-value nette** = Plus-value brute — Frais déductibles

**Exemple chiffré**

Un dirigeant cède les titres de sa SAS pour 2 000 000 €. Il les avait acquis (ou créés) pour 100 000 €.

- Plus-value brute : 2 000 000 — 100 000 = **1 900 000 €**
- Flat tax : 1 900 000 × 30 % = **570 000 €**
- Net après impôt : 1 900 000 — 570 000 = **1 330 000 €**

Pour les aspects généraux de la cession, consultez [[transmission-entreprise-guide-complet]].`
    },
    {
      id: 'bareme-progressif',
      title: 'L\'option pour le barème progressif de l\'IR',
      content: `Le contribuable peut renoncer à la flat tax et opter pour l'imposition au **barème progressif de l'impôt sur le revenu**. Cette option, prévue à l'article 200 A du CGI, peut s'avérer avantageuse dans certaines situations.

**Le mécanisme de l'option**

L'option pour le barème progressif est **globale** : elle s'applique à l'ensemble des revenus du capital du foyer fiscal pour l'année considérée (dividendes, intérêts, plus-values). Il n'est pas possible d'opter pour le barème sur les plus-values tout en conservant la flat tax sur les dividendes.

**Les abattements pour durée de détention**

L'option pour le barème progressif permet de bénéficier des **abattements pour durée de détention** prévus à l'article 150-0 D 1 ter du CGI (uniquement pour les titres acquis avant le 1er janvier 2018) :

- **50 %** d'abattement pour une détention de **2 à 8 ans**
- **65 %** d'abattement pour une détention de **plus de 8 ans**

**L'abattement renforcé** (article 150-0 D 1 quater) s'applique dans certains cas (PME de moins de 10 ans, cession intrafamiliale, départ en retraite) :

- **50 %** pour une détention de **1 à 4 ans**
- **65 %** pour une détention de **4 à 8 ans**
- **85 %** pour une détention de **plus de 8 ans**

**La déductibilité de la CSG**

En cas d'option pour le barème, une fraction de la **CSG est déductible** du revenu imposable de l'année suivante :

- CSG déductible : **6,8 %** (sur les 9,2 % de CSG totale)
- Cette déduction vient réduire la base imposable à l'IR de l'année suivante
- En flat tax, la CSG n'est **pas déductible**

**Comparaison flat tax vs barème progressif**

Le choix optimal dépend de plusieurs paramètres :

- **TMI (Tranche Marginale d'Imposition)** : si le TMI est de 11 % ou 30 %, le barème est souvent plus avantageux avec les abattements. Si le TMI est de 41 % ou 45 %, la flat tax est généralement préférable
- **Durée de détention** : plus la détention est longue (> 8 ans), plus l'abattement réduit l'avantage de la flat tax
- **Autres revenus du capital** : l'option est globale, il faut simuler l'impact sur l'ensemble des revenus du capital

Pour les abattements spécifiques en cas de départ en retraite, consultez [[abattement-depart-retraite-cession]].`
    },
    {
      id: 'simulations-comparatives',
      title: 'Simulations comparatives détaillées',
      content: `Pour déterminer le régime le plus favorable, il est indispensable de réaliser des **simulations chiffrées** tenant compte de l'ensemble des paramètres du foyer fiscal.

**Cas n°1 : Plus-value de 500 000 €, titres détenus depuis 12 ans, TMI 30 %**

**Flat tax :**
- Impôt : 500 000 × 30 % = **150 000 €**
- Net après impôt : **350 000 €**

**Barème progressif avec abattement renforcé (85 %) :**
- Base imposable IR : 500 000 × (1 — 85 %) = 75 000 €
- IR (TMI 30 %) : 75 000 × 30 % = **22 500 €** (estimation simplifiée)
- PS : 500 000 × 17,2 % = **86 000 €**
- CSG déductible N+1 : 500 000 × 6,8 % = 34 000 € (économie d'environ 10 200 € à TMI 30 %)
- Total impôt : 22 500 + 86 000 = **108 500 €** (hors effet CSG déductible)
- Net après impôt : **391 500 €**
- **Économie : 41 500 €** par rapport à la flat tax

**Cas n°2 : Plus-value de 2 000 000 €, titres détenus depuis 3 ans, TMI 45 %**

**Flat tax :**
- Impôt : 2 000 000 × 30 % = **600 000 €**
- Net après impôt : **1 400 000 €**

**Barème progressif avec abattement (50 %) :**
- Base imposable IR : 2 000 000 × 50 % = 1 000 000 €
- IR (TMI 45 %) : estimation environ **380 000 €** (en tenant compte de la progressivité)
- PS : 2 000 000 × 17,2 % = **344 000 €**
- Total impôt : 380 000 + 344 000 = **724 000 €**
- Net après impôt : **1 276 000 €**
- **Flat tax plus avantageuse de 124 000 €**

**Cas n°3 : Départ en retraite, plus-value de 1 500 000 €, titres détenus depuis 15 ans**

**Flat tax + abattement fixe de 500 000 € (article 150-0 D ter) :**
- Base imposable : 1 500 000 — 500 000 = 1 000 000 €
- Flat tax sur 1 000 000 : 300 000 €
- PS sur 1 500 000 : 258 000 € (les PS s'appliquent sur la PV totale, l'abattement ne s'impute que sur l'IR)
- Total : environ **428 000 €**

**Barème progressif + abattement fixe 500 000 € + abattement renforcé 85 % :**
- PV après abattement fixe : 1 000 000 €
- PV après abattement durée de détention (85 %) : 150 000 €
- IR (TMI estimé) : environ **50 000 €**
- PS : 1 500 000 × 17,2 % = **258 000 €**
- Total : environ **308 000 €**
- **Économie de 120 000 €** par rapport à la flat tax

**Règle générale**

En règle générale :
- **TMI ≤ 30 % et détention > 8 ans** → barème progressif souvent plus favorable
- **TMI ≥ 41 % et détention < 4 ans** → flat tax souvent plus favorable
- **Départ en retraite** → toujours simuler les deux options car l'abattement fixe de 500 000 € change la donne

Pour une analyse personnalisée, consultez [[valorisation-entreprise-methodes]].`
    },
    {
      id: 'strategies-optimisation',
      title: 'Stratégies d\'optimisation fiscale de la cession',
      content: `Au-delà du choix entre flat tax et barème progressif, plusieurs **stratégies d'optimisation** permettent de réduire la charge fiscale globale de la cession.

**Stratégie 1 : L'abattement fixe de 500 000 € pour départ en retraite**

L'article 150-0 D ter du CGI prévoit un **abattement fixe de 500 000 €** sur la plus-value de cession, sous conditions :

- Le cédant doit avoir exercé des fonctions de **direction** pendant au moins 5 ans dans les 10 années précédant la cession
- Il doit détenir au moins **25 % des droits de vote** de la société cédée (directement ou via son groupe familial)
- Il doit faire valoir ses droits à la **retraite** dans les 2 ans précédant ou suivant la cession
- La société doit être une **PME au sens communautaire** (< 250 salariés, CA < 50 M€)

Cet abattement est cumulable avec le barème progressif et les abattements pour durée de détention, ce qui en fait un outil puissant.

**Stratégie 2 : L'apport-cession (article 150-0 B ter)**

Comme détaillé dans [[regime-fiscal-apport-cession-150-0-b-ter]], l'apport-cession permet de **reporter l'imposition** en apportant les titres à une holding contrôlée avant la cession. Le produit de cession est alors réinvesti via la holding.

**Stratégie 3 : La donation avant cession**

La donation des titres avant leur cession permet de **purger la plus-value** :

- Le donateur transmet les titres à ses descendants ou héritiers
- Les droits de donation sont calculés sur la **valeur vénale** des titres au jour de la donation
- Le donataire cède ensuite les titres : la plus-value est calculée sur la différence entre le prix de cession et la valeur de donation (souvent faible ou nulle)
- **Attention** : la donation ne doit pas être conditionnée à la cession (risque d'abus de droit). Un délai raisonnable entre donation et cession est recommandé (2-3 mois minimum)

**Stratégie 4 : Le Pacte Dutreil (article 787 B du CGI)**

Pour les transmissions familiales à titre gratuit :

- **Abattement de 75 %** sur la valeur des titres transmis
- Conditions : engagement collectif de conservation de 2 ans, puis engagement individuel de 4 ans, exercice de fonctions de direction
- Peut se combiner avec une donation-partage et un démembrement de propriété

**Stratégie 5 : Le démembrement de propriété**

- Donation de la **nue-propriété** des titres aux enfants, le cédant conservant l'**usufruit**
- La valeur de la nue-propriété est décotée selon le barème de l'article 669 du CGI (par exemple, 60 % de la pleine propriété pour un usufruitier de 61 à 70 ans)
- Lors du décès de l'usufruitier, le nu-propriétaire récupère la pleine propriété sans droits supplémentaires

Pour les aspects patrimoniaux, consultez [[regime-fiscal-apport-cession-150-0-b-ter]] et [[abattement-depart-retraite-cession]].`
    },
    {
      id: 'cshm-contribution',
      title: 'CEHR, contributions exceptionnelles et prélèvements additionnels',
      content: `Au-delà de la flat tax et du barème progressif, d'autres prélèvements peuvent s'appliquer sur les plus-values de cession et doivent être intégrés dans la simulation fiscale.

**La Contribution Exceptionnelle sur les Hauts Revenus (CEHR)**

L'article 223 sexies du CGI instaure une contribution additionnelle pour les hauts revenus :

- **3 %** sur la fraction du revenu fiscal de référence comprise entre **250 001 €** et **500 000 €** (célibataire) ou entre **500 001 €** et **1 000 000 €** (couple)
- **4 %** sur la fraction excédant **500 000 €** (célibataire) ou **1 000 000 €** (couple)

La plus-value de cession de titres est incluse dans le revenu fiscal de référence et peut donc déclencher ou majorer la CEHR. Pour une plus-value de 2 M€, la CEHR peut représenter un surcoût de **60 000 à 80 000 €**.

**Le mécanisme du quotient (article 163-0 A du CGI)**

Le système du quotient permet de **lisser l'impact** d'un revenu exceptionnel sur la progressivité de l'IR :

- Il s'applique en cas d'option pour le barème progressif
- Le revenu exceptionnel est divisé par un coefficient (généralement 4)
- L'impôt supplémentaire est calculé sur cette fraction, puis multiplié par le coefficient
- Ce mécanisme atténue l'effet de la progressivité mais n'élimine pas la CEHR

**Le mécanisme de lissage de la CEHR**

Un mécanisme de lissage spécifique à la CEHR permet de limiter son impact pour les contribuables dont les revenus sont exceptionnellement élevés une année donnée :

- Comparaison entre le revenu de l'année et la **moyenne des revenus des deux années précédentes**
- Si le revenu est supérieur à 1,5 fois la moyenne, le lissage s'applique
- Le calcul est complexe et nécessite l'intervention d'un fiscaliste spécialisé

**Le cas particulier des dirigeants de PME partant en retraite**

Le cumul des dispositifs favorables permet de réduire significativement la charge :

- **Abattement fixe de 500 000 €** (article 150-0 D ter)
- **Abattement renforcé pour durée de détention** (jusqu'à 85 %)
- **Option pour le barème progressif** (taux effectif réduit grâce aux abattements)
- **CSG déductible** (6,8 % déductible l'année suivante)
- **Quotient** (lissage de la progressivité)

Pour un dirigeant partant en retraite avec une plus-value de 1,5 M€ et des titres détenus depuis plus de 8 ans, le taux effectif d'imposition peut descendre à **15-20 %** (contre 30 % en flat tax pure), soit une économie de **150 000 à 225 000 €**.

Pour l'optimisation du départ en retraite, consultez [[abattement-depart-retraite-cession]].`
    }
  ],
  faq: [
    {
      question: 'La flat tax est-elle toujours plus avantageuse que le barème progressif ?',
      answer: 'Non, la flat tax n\'est pas systématiquement la meilleure option. Le barème progressif peut être plus avantageux dans plusieurs situations : si votre TMI est inférieur ou égal à 30 % et que vous détenez les titres depuis plus de 8 ans (l\'abattement renforcé de 85 % réduit considérablement la base imposable), si vous partez en retraite et bénéficiez de l\'abattement fixe de 500 000 € cumulé avec les abattements pour durée de détention, ou si vos autres revenus du capital sont faibles (l\'option est globale). En revanche, pour les TMI de 41 % ou 45 % sans abattement significatif, la flat tax est généralement préférable. La simulation doit intégrer tous les paramètres du foyer fiscal, y compris la CEHR et la CSG déductible.'
    },
    {
      question: 'Comment fonctionne l\'abattement de 500 000 € pour départ en retraite avec la flat tax ?',
      answer: 'L\'abattement fixe de 500 000 € prévu à l\'article 150-0 D ter du CGI s\'applique uniquement sur la fraction soumise à l\'IR, pas sur les prélèvements sociaux. En flat tax, il vient réduire la base soumise aux 12,8 % d\'IR, mais les PS de 17,2 % s\'appliquent sur la totalité de la plus-value. Exemple : pour une plus-value de 1 000 000 €, l\'IR sera calculé sur 500 000 € (après abattement) soit 64 000 €, les PS seront de 172 000 € (sur la PV totale), pour un total de 236 000 € au lieu de 300 000 € en flat tax sans abattement. Si vous optez pour le barème progressif, l\'abattement de 500 000 € se cumule avec les abattements pour durée de détention, ce qui peut être encore plus favorable.'
    },
    {
      question: 'La CEHR est-elle évitable lors d\'une cession d\'entreprise ?',
      answer: 'La CEHR (Contribution Exceptionnelle sur les Hauts Revenus) est difficile à éviter car elle s\'applique sur le revenu fiscal de référence, qui inclut les plus-values de cession même en cas de flat tax. Cependant, plusieurs stratégies permettent d\'en limiter l\'impact : l\'apport-cession (article 150-0 B ter) qui reporte l\'imposition et donc la CEHR, la donation avant cession qui purge la plus-value chez le donateur, le mécanisme de lissage de la CEHR qui atténue l\'effet d\'un revenu exceptionnel par rapport à la moyenne des 2 années précédentes, et l\'étalement de la cession sur plusieurs exercices (cession partielle des titres année par année). Un avocat fiscaliste pourra modéliser l\'impact précis de chaque stratégie en fonction de votre situation.'
    }
  ],
  cta: {
    text: 'Simulez l\'imposition de votre cession : flat tax ou barème progressif ?',
    tool: 'Valuations'
  }
};
