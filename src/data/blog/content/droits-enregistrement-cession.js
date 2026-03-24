export default {
  chapters: [
    {
      id: 'principe-des-droits',
      title: 'Principe des droits d\'enregistrement',
      content: `Les **droits d'enregistrement** sont des taxes perçues par l'État à l'occasion de la mutation de propriété d'un bien. Dans le cadre d'une cession d'entreprise, ils s'appliquent au transfert de propriété des **titres sociaux** (parts ou actions) ou du **fonds de commerce**.

**Nature des droits :**

- Il s'agit d'un **impôt indirect** sur la mutation à titre onéreux
- Les droits sont calculés sur le **prix de cession** effectif (ou la valeur vénale si supérieure)
- Ils sont exigibles au moment de l'**enregistrement de l'acte** de cession
- Le paiement est un **préalable obligatoire** à l'enregistrement

**Différence fondamentale selon la nature de la cession :**

- **Cession de fonds de commerce** : droits calculés selon un barème progressif (0 % à 5 %)
- **Cession de parts sociales (SARL)** : droit fixe de 3 % après abattement
- **Cession d'actions (SAS, SA)** : droit fixe de 0,1 %

Le **choix de la structure de l'opération** (cession de titres vs cession de fonds) a donc un impact fiscal direct considérable. C'est un élément clé de la négociation entre cédant et repreneur.

**Délai d'enregistrement :**

L'acte de cession doit être enregistré auprès du **service des impôts des entreprises (SIE)** dans un délai d'**un mois** à compter de la date de l'acte. Au-delà, des pénalités de retard s'appliquent.

Pour comprendre la fiscalité globale de la cession, consultez [[fiscalite-cession-entreprise]].`
    },
    {
      id: 'cession-fonds-commerce',
      title: 'Cession de fonds de commerce : barème 3-5 %',
      content: `La cession d'un fonds de commerce est soumise à un **barème progressif** de droits d'enregistrement, appliqué sur le prix de vente.

**Barème en vigueur (2026) :**

- De **0 à 23 000 euros** : 0 % (franchise)
- De **23 001 à 200 000 euros** : 3 %
- Au-delà de **200 000 euros** : 5 %

**Exemple de calcul :**

Pour un fonds de commerce cédé à **500 000 euros** :

- Tranche 0 - 23 000 euros : 0 euro
- Tranche 23 001 - 200 000 euros : 177 000 x 3 % = **5 310 euros**
- Tranche 200 001 - 500 000 euros : 300 000 x 5 % = **15 000 euros**
- **Total des droits** : 20 310 euros, soit **4,06 %** du prix

**Éléments inclus dans l'assiette :**

- **Clientèle** et achalandage
- **Droit au bail** commercial
- **Nom commercial**, enseigne, marques
- **Matériel et outillage** (sauf convention contraire)
- **Stocks de marchandises** : exonérés de droits d'enregistrement (soumis à la TVA)

**Ventilation du prix :**

Il est courant de **ventiler le prix** entre les différents éléments du fonds pour optimiser les droits :

- Le matériel neuf peut être valorisé séparément et soumis à la **TVA** (récupérable par l'acquéreur)
- Les stocks sont exclus de l'assiette des droits d'enregistrement
- Le droit au bail peut faire l'objet d'une valorisation distincte

**Point de vigilance** : l'administration fiscale peut contester une ventilation manifestement **sous-évaluée** sur certains éléments et **sur-évaluée** sur d'autres pour réduire l'assiette des droits.

Pour comprendre les spécificités de la cession de fonds, consultez [[vente-fonds-de-commerce]].`
    },
    {
      id: 'parts-sociales-sarl',
      title: 'Parts sociales de SARL : droits à 3 %',
      content: `La cession de **parts sociales de SARL** est soumise à un droit d'enregistrement de **3 %**, calculé après application d'un abattement.

**Calcul des droits :**

- **Taux** : 3 % du prix de cession
- **Abattement** : 23 000 euros x (nombre de parts cédées / nombre total de parts)
- **Base taxable** = prix de cession - abattement proportionnel

**Formule :**

Droits = (Prix de cession - 23 000 x parts cédées / total des parts) x 3 %

**Exemple :**

- SARL au capital de 1 000 parts
- Cession de la totalité (1 000 parts) pour **400 000 euros**
- Abattement : 23 000 x (1 000 / 1 000) = **23 000 euros**
- Base taxable : 400 000 - 23 000 = **377 000 euros**
- Droits : 377 000 x 3 % = **11 310 euros**

**Cession partielle :**

- Cession de 500 parts sur 1 000 pour **200 000 euros**
- Abattement : 23 000 x (500 / 1 000) = **11 500 euros**
- Base taxable : 200 000 - 11 500 = **188 500 euros**
- Droits : 188 500 x 3 % = **5 655 euros**

**Particularités :**

- Les droits sont dus même si la cession est réalisée **entre associés**
- Les droits s'appliquent sur le prix effectif ou la **valeur vénale** si elle est supérieure
- Les cessions de parts de **SNC** et de **sociétés civiles** sont soumises au même taux de 3 % (avec un abattement identique pour les sociétés civiles)
- Les cessions de parts de **sociétés à prépondérance immobilière** sont soumises au taux de **5 %** (sans abattement)

**Comparaison avec les actions :**

À 3 %, les droits sur les parts de SARL sont **30 fois supérieurs** à ceux sur les actions de SAS (0,1 %). Cette différence peut représenter des dizaines de milliers d'euros sur une opération importante. C'est un argument en faveur de la **transformation** de la SARL en SAS avant la cession.`
    },
    {
      id: 'actions-sas',
      title: 'Actions de SAS et SA : droits à 0,1 %',
      content: `La cession d'**actions** (SAS, SA, SCA) bénéficie du taux d'enregistrement le plus favorable : **0,1 %** du prix de cession, plafonné à 5 000 euros par mutation.

**Caractéristiques :**

- **Taux** : 0,1 % du prix de cession
- **Plafond** : 5 000 euros par acte de cession
- **Pas d'abattement** : le droit s'applique sur le prix intégral
- **Pas de barème progressif** : taux unique

**Exemple :**

- Cession de 100 % des actions d'une SAS pour **800 000 euros**
- Droits : 800 000 x 0,1 % = **800 euros**

- Cession d'actions pour **10 000 000 euros**
- Droits calculés : 10 000 000 x 0,1 % = 10 000 euros, **plafonné à 5 000 euros**

**Comparaison des droits selon la forme juridique :**

Pour une cession à 500 000 euros :

- **Fonds de commerce** : environ 20 310 euros (4 %)
- **Parts de SARL** : 14 310 euros (2,9 %)
- **Actions de SAS** : 500 euros (0,1 %)

**L'économie est massive** : jusqu'à **19 810 euros** de différence entre une cession de fonds et une cession d'actions de SAS.

**Transformation SARL en SAS avant cession :**

Compte tenu de l'écart de taxation, la **transformation de la SARL en SAS** avant la cession est une stratégie d'optimisation fréquente :

- La transformation est **neutre fiscalement** (pas de taxation de plus-value)
- Le coût de transformation est de **2 000 à 5 000 euros** (avocat + greffe + commissaire à la transformation)
- L'économie de droits d'enregistrement est souvent **supérieure à 10 000 euros**
- Délai : 2 à 3 mois

**Attention** : la transformation doit intervenir suffisamment **en amont** de la cession pour ne pas être qualifiée d'abus de droit. Un délai de 6 mois minimum est recommandé.`
    },
    {
      id: 'exonerations-possibles',
      title: 'Les exonérations et réductions possibles',
      content: `Plusieurs dispositifs permettent de **réduire ou supprimer** les droits d'enregistrement dans des situations spécifiques.

**Exonération en Zone de Revitalisation Rurale (ZRR) :**

- **Exonération totale** des droits d'enregistrement pour les acquisitions de fonds de commerce situés en ZRR
- Condition : le prix du fonds ne doit pas dépasser **300 000 euros** pour une exonération totale (avec montant révisable)
- Le repreneur doit s'engager à maintenir l'activité pendant **5 ans minimum**

**Exonération pour les rachats d'entreprise par les salariés :**

- **Exonération totale** des droits d'enregistrement lorsque le fonds est racheté par un ou plusieurs **salariés de l'entreprise**
- Applicable aux cessions de fonds de commerce dont la valeur est inférieure à **300 000 euros**
- Les salariés doivent avoir au moins **2 ans d'ancienneté**

**Réduction pour les cessions intra-familiales :**

- Un abattement de **300 000 euros** s'applique pour les cessions de fonds de commerce en ligne directe (parent-enfant)
- Cet abattement réduit significativement l'assiette des droits

**Cession de titres de sociétés en difficulté :**

- Les cessions réalisées dans le cadre d'une **procédure collective** (redressement, liquidation judiciaire) peuvent bénéficier d'une exonération partielle ou totale
- Le tribunal de commerce peut accorder une remise des droits dans le cadre du plan de reprise

**Régime des marchand de biens :**

- Les acquéreurs ayant le statut de **marchand de biens** bénéficient d'un droit fixe en lieu et place des droits proportionnels
- Condition : revendre le bien dans un délai de **5 ans**

**Conseil** : vérifiez systématiquement l'éligibilité de votre transaction à l'un de ces dispositifs d'exonération. L'économie peut être substantielle et ces dispositifs sont souvent méconnus des praticiens.`
    },
    {
      id: 'qui-paie',
      title: 'Qui paie les droits d\'enregistrement ?',
      content: `La question de la prise en charge des droits d'enregistrement fait partie intégrante de la **négociation** entre cédant et repreneur.

**Principe légal :**

- En matière de cession de fonds de commerce, les droits sont légalement à la charge de l'**acquéreur**
- En matière de cession de parts sociales ou d'actions, les droits sont également à la charge de l'**acquéreur** par principe
- Toutefois, les parties peuvent **convenir autrement** dans l'acte de cession

**En pratique :**

- Dans **la majorité des cas**, c'est l'**acquéreur** qui supporte les droits d'enregistrement
- Le cédant peut accepter de **partager** les droits pour faciliter la transaction
- Exceptionnellement, le cédant prend en charge les droits pour rendre son prix plus attractif

**Impact sur la négociation du prix :**

- Si l'acquéreur paie les droits, il intègre ce coût dans son **prix total d'acquisition**
- Les droits d'enregistrement ne sont **pas déductibles** du résultat de l'acquéreur (ils font partie du coût d'acquisition des titres)
- Pour un acquéreur finançant son acquisition par emprunt, les droits alourdissent le **montant à emprunter**

**Exemple d'impact :**

Acquisition d'un fonds de commerce à 500 000 euros :

- Droits d'enregistrement : **20 310 euros** (à la charge de l'acquéreur)
- Honoraires d'avocat : environ **8 000 euros**
- Frais d'audit : environ **5 000 euros**
- **Coût total de la transaction** : 533 310 euros
- Les droits représentent **3,8 %** du coût additionnel

**Clause type dans l'acte de cession :**

« Les droits d'enregistrement et tous frais résultant de la présente cession seront supportés par le cessionnaire / seront partagés par moitié entre le cédant et le cessionnaire. »

**Conseil** : si vous êtes repreneur, négociez la prise en charge des droits par le cédant en contrepartie d'un **prix légèrement supérieur**. Le cédant peut ainsi déduire ces frais de sa plus-value, alors que l'acquéreur ne peut pas les déduire.`
    },
    {
      id: 'optimiser-les-droits',
      title: 'Optimiser les droits d\'enregistrement',
      content: `Plusieurs stratégies permettent de **minimiser l'impact** des droits d'enregistrement sur le coût total de l'acquisition.

**Stratégie 1 : Cession de titres plutôt que de fonds**

La différence de taxation est considérable :

- Fonds de commerce (500 000 euros) : **20 310 euros** de droits
- Parts de SARL (500 000 euros) : **14 310 euros** de droits
- Actions de SAS (500 000 euros) : **500 euros** de droits

Quand c'est possible, **privilégiez la cession de titres** plutôt que la cession de fonds de commerce.

**Stratégie 2 : Transformation SARL en SAS**

- Coût : 2 000 à 5 000 euros
- Économie : 3 % - 0,1 % = **2,9 %** du prix sur les droits
- Rentable dès que le prix de cession dépasse **100 000 euros**
- Délai : 2 à 3 mois avant la cession

**Stratégie 3 : Ventilation optimisée du prix (cession de fonds)**

- Valoriser séparément le **matériel** (soumis à la TVA récupérable, pas aux droits d'enregistrement)
- Exclure les **stocks** de l'assiette des droits (soumis à la TVA)
- Valoriser correctement le **droit au bail** vs la clientèle

**Stratégie 4 : Bénéficier des exonérations**

- Vérifier si l'entreprise est située en **ZRR** ou en **QPV**
- Explorer le rachat par les **salariés** si applicable
- Étudier les conditions d'exonération pour les cessions intra-familiales

**Stratégie 5 : Structuration en deux temps**

- **Étape 1** : le cédant apporte son fonds de commerce à une SAS qu'il crée (opération en franchise de droits sous certaines conditions)
- **Étape 2** : le cédant cède les actions de la SAS à l'acquéreur (droits de 0,1 %)
- **Attention** : cette opération doit avoir une **substance économique** et ne pas être réalisée dans un but exclusivement fiscal

**Stratégie 6 : Clause d'earn-out**

- L'earn-out réduit le prix initial et donc la base immédiate des droits d'enregistrement
- Les droits complémentaires ne sont dus qu'au moment du versement effectif de l'earn-out
- Avantage de **trésorerie** pour l'acquéreur

**Recommandation** : faites réaliser une **simulation complète** des droits d'enregistrement selon différentes structures de transaction (fonds, parts SARL, actions SAS) avant de finaliser la négociation. L'économie peut atteindre plusieurs dizaines de milliers d'euros.

Pour une vue globale de la négociation, consultez [[negociation-cession-entreprise]].`
    }
  ],
  faq: [
    {
      question: 'Peut-on transformer une SARL en SAS juste avant la cession pour réduire les droits ?',
      answer: 'Oui, la transformation d\'une SARL en SAS est une opération **fiscalement neutre** qui permet de passer d\'un taux de droits de 3 % à 0,1 %. Toutefois, il est recommandé de réaliser cette transformation **au moins 6 mois avant** la cession pour éviter le risque de requalification en abus de droit. Le coût de la transformation (2 000 à 5 000 euros) est très rapidement amorti par l\'économie de droits réalisée.'
    },
    {
      question: 'Les droits d\'enregistrement sont-ils récupérables par l\'acquéreur ?',
      answer: 'Non, les droits d\'enregistrement ne sont **pas récupérables** au sens fiscal. Ils ne sont pas déductibles du résultat de l\'acquéreur car ils font partie du coût d\'acquisition des titres ou du fonds. Ils viendront toutefois en augmentation du **prix de revient** des titres, ce qui réduira la plus-value en cas de revente ultérieure. C\'est un coût sec qui doit être intégré dans le plan de financement.'
    },
    {
      question: 'Les stocks sont-ils soumis aux droits d\'enregistrement dans une cession de fonds ?',
      answer: 'Non, les **stocks de marchandises** sont exclus de l\'assiette des droits d\'enregistrement. Ils sont soumis à la **TVA** au taux normal. C\'est pourquoi il est important de bien ventiler le prix entre les éléments incorporels du fonds (soumis aux droits d\'enregistrement) et les stocks (soumis à la TVA, récupérable par l\'acquéreur). Cette ventilation doit être réaliste et documentée pour éviter une contestation de l\'administration.'
    }
  ],
  cta: {
    tool: 'Contact',
    text: 'Optimisez vos droits d\'enregistrement'
  }
};
