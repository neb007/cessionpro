export default {
  chapters: [
    {
      id: 'panorama-assurances-cession',
      title: 'Panorama des assurances et garanties dans une opération de cession',
      content: `Les opérations de cession d'entreprise impliquent des **risques multiples** qui peuvent être couverts par des mécanismes d'assurance et de garantie spécifiques. Au-delà de la traditionnelle garantie d'actif et de passif (GAP), un écosystème complet de produits d'assurance s'est développé pour sécuriser les transactions.

**Les risques inhérents à une cession**

- **Risque de passif caché** : découverte post-cession de dettes non déclarées (redressement fiscal, contentieux prud'homal, pollution environnementale, dette fournisseur non provisionnée)
- **Risque de surévaluation d'actif** : stocks obsolètes, créances irrécouvrables, actifs incorporels surévalués
- **Risque opérationnel** : perte de clients clés, départ de personnel essentiel, rupture de contrat fournisseur
- **Risque réglementaire** : non-conformité découverte après la cession (RGPD, environnement, normes sectorielles)
- **Risque de responsabilité** : mise en cause de la responsabilité de l'entreprise pour des faits antérieurs à la cession

**La garantie d'actif et de passif (GAP) : socle de la sécurisation**

La GAP est le mécanisme contractuel central de toute cession de titres. Elle constitue l'engagement du vendeur d'indemniser l'acquéreur en cas d'apparition de passifs non déclarés ou de diminution d'actifs survenue avant la cession.

Les éléments structurants de la GAP :

- **Déclarations du vendeur (representations & warranties)** : le vendeur déclare la sincérité des comptes, l'absence de litiges non déclarés, la conformité réglementaire, la validité des contrats
- **Obligation d'indemnisation** : en cas de fausseté d'une déclaration ou d'apparition d'un passif non déclaré, le vendeur indemnise l'acquéreur
- **Plafond (cap)** : montant maximum de l'indemnisation (généralement 20 à 50 % du prix de cession)
- **Seuil de déclenchement (basket)** : montant en deçà duquel l'acquéreur ne peut pas actionner la GAP (généralement 0,5 à 1,5 % du prix)
- **Franchise (deductible)** : montant restant à la charge de l'acquéreur (de minimis)
- **Durée** : 2 à 5 ans selon les risques couverts (3 ans pour les risques fiscaux et sociaux, 5 ans pour les risques environnementaux, 10 ans pour les risques pénaux)

Pour les aspects juridiques, consultez [[audit-juridique-acquisition]].`
    },
    {
      id: 'assurance-gap',
      title: 'L\'assurance de garantie de passif (W&I Insurance)',
      content: `L'**assurance de garantie de passif** (Warranty & Indemnity Insurance, ou W&I Insurance) est un produit d'assurance permettant de **transférer à un assureur** tout ou partie du risque couvert par la GAP. Ce marché a connu une croissance exponentielle en France, passant de quelques opérations par an en 2010 à **plus de 200 polices souscrites en 2024** (source : Marsh, 2024).

**Le principe**

L'assureur W&I souscrit une police qui couvre les déclarations du vendeur (representations & warranties) contenues dans la GAP. En cas de sinistre (passif caché, fausseté d'une déclaration), c'est l'**assureur qui indemnise** l'acquéreur, et non le vendeur.

**Les deux types de polices**

- **Police vendeur (Sell-side policy)** : souscrite par le vendeur, elle rembourse le vendeur s'il est appelé en garantie par l'acquéreur. Moins fréquente en pratique
- **Police acquéreur (Buy-side policy)** : souscrite par l'acquéreur, elle indemnise directement l'acquéreur en cas de sinistre. C'est la forme la plus courante (90 % des polices)

**Les avantages**

Pour le vendeur :
- **Sortie propre (clean exit)** : le vendeur n'a plus d'engagement financier post-cession
- **Distribution du prix** : dans le cas d'un fonds de PE vendeur, le prix peut être distribué aux investisseurs sans retenir de réserve GAP
- **Élimination du séquestre** : pas besoin de bloquer une partie du prix en séquestre

Pour l'acquéreur :
- **Couverture élargie** : la police W&I peut offrir des plafonds de couverture supérieurs à la GAP contractuelle
- **Interlocuteur solvable** : l'assureur est un tiers solvable, contrairement à un vendeur qui pourrait être insolvable au moment de l'appel en garantie
- **Avantage compétitif** : dans un processus compétitif, proposer une W&I Insurance au vendeur renforce l'attractivité de l'offre

**Les conditions de marché**

- **Prime** : 1 à 3 % du montant de couverture (ex : pour une couverture de 5 M€, prime de 50 000 à 150 000 €)
- **Rétention (excess)** : 0,25 à 1 % de la valeur d'entreprise (montant restant à la charge de l'assuré avant intervention de l'assureur)
- **Montant de couverture** : généralement 10 à 30 % de la valeur d'entreprise
- **Durée** : 2 à 7 ans selon les risques couverts (alignée sur la durée de la GAP)

**Les exclusions courantes**

Certains risques sont **systématiquement exclus** des polices W&I :

- Risques **connus** au moment de la souscription (identifiés dans la due diligence)
- **Ajustement de prix** post-closing (earn-out, correction de BFR)
- **Risques prospectifs** (perte de clients future, baisse de CA)
- **Amendes et pénalités pénales**
- **Amiante et pollution connue**

Pour la structuration de la data room, consultez [[data-room-cession]].`
    },
    {
      id: 'sequestre-mecanismes',
      title: 'Le séquestre et les mécanismes de rétention de prix',
      content: `Le **séquestre** et les mécanismes de rétention de prix sont des outils complémentaires à la GAP qui permettent de **sécuriser financièrement** l'exécution des garanties.

**Le séquestre conventionnel**

Le séquestre est le dépôt d'une partie du prix de cession auprès d'un **tiers séquestre** (avocat, notaire, banque) pour garantir l'exécution de la GAP.

**Caractéristiques :**

- **Montant** : 5 à 20 % du prix de cession (10 % étant la norme de marché)
- **Durée** : alignée sur la durée de la GAP (12 à 36 mois)
- **Rémunération** : les fonds séquestrés sont généralement placés sur un compte rémunéré (taux monétaire)
- **Libération** : automatique à l'expiration de la durée de séquestre, sauf si un sinistre est notifié

**Modalités de libération :**

- **Libération progressive** : une partie (ex : 50 %) est libérée après 12 mois, le solde après 24 mois
- **Libération anticipée** : possible sur accord conjoint vendeur-acquéreur ou sur décision judiciaire
- **Rétention en cas de sinistre** : si un sinistre est notifié, le montant correspondant est retenu jusqu'à résolution

**Le crédit-vendeur structuré**

Le **crédit-vendeur** peut être structuré pour jouer un rôle de garantie implicite :

- Le vendeur finance 10 à 30 % du prix de cession sur 2 à 5 ans
- En cas de sinistre GAP, l'acquéreur peut **compenser** sa créance d'indemnisation avec sa dette de crédit-vendeur
- Ce mécanisme évite le séquestre et aligne les intérêts du vendeur (il a intérêt à ce que l'entreprise performe pour être remboursé)

**Le earn-out (complément de prix conditionnel)**

Le earn-out est un complément de prix versé au vendeur si des objectifs de performance sont atteints post-cession :

- **Indexation** : CA, EBITDA, EBIT, nombre de clients, ou tout autre KPI mesurable
- **Durée** : 1 à 3 ans (rarement plus de 3 ans, source de contentieux)
- **Montant** : 10 à 30 % du prix total
- **Encadrement** : le vendeur doit rester impliqué (souvent en tant que consultant) pendant la période d'earn-out pour influencer la performance

**Les risques du earn-out :**

- **Contentieux fréquents** : désaccords sur le calcul des indicateurs, manipulation des résultats par l'acquéreur (augmentation artificielle des charges, report de CA)
- **Audit des comptes** : prévoir un droit d'audit du vendeur sur les comptes de la période d'earn-out
- **Clause d'arbitrage** : nommer un tiers (expert-comptable indépendant) pour trancher les différends

Pour les aspects de crédit-vendeur, consultez [[credit-vendeur-cession]].`
    },
    {
      id: 'assurances-operationnelles',
      title: 'Les assurances opérationnelles à vérifier lors d\'une cession',
      content: `Au-delà des assurances spécifiques à la transaction, la **couverture assurantielle de l'entreprise cible** doit faire l'objet d'un audit approfondi dans le cadre de la due diligence.

**Les assurances obligatoires**

Selon le secteur d'activité, certaines assurances sont **légalement obligatoires** :

- **RC Professionnelle** : obligatoire pour de nombreuses professions réglementées (avocats, experts-comptables, médecins, architectes, agents immobiliers)
- **Décennale** : obligatoire pour les constructeurs et les entreprises du BTP (article 1792 du Code civil et loi Spinetta du 4 janvier 1978)
- **RC exploitation** : responsabilité civile pour les dommages causés aux tiers dans le cadre de l'activité
- **Multirisque professionnelle** : couvre les locaux, le matériel, les stocks contre l'incendie, le dégât des eaux, le vol
- **Assurance flotte automobile** : obligatoire pour les véhicules de l'entreprise

**Les assurances recommandées**

- **Perte d'exploitation** : couvre le manque à gagner en cas de sinistre (incendie, catastrophe naturelle). Essentielle pour les entreprises à forte composante immobilière ou industrielle
- **Cyber-risques** : couverture des conséquences d'une cyberattaque (rançongiciel, vol de données, perte d'exploitation numérique). Marché en forte croissance (+25 % par an)
- **Homme clé (key person)** : indemnise l'entreprise en cas de décès ou d'invalidité d'un dirigeant ou d'un collaborateur essentiel. Montant : 3 à 5 fois la rémunération annuelle de la personne clé
- **Crédit (assurance-crédit)** : couvre le risque d'impayé des clients. Particulièrement importante pour les entreprises B2B avec des encours client significatifs
- **Transport** : couverture des marchandises en cours de transport (entreprises de négoce, e-commerce, industrie)

**L'audit assurantiel lors de la reprise**

Lors de la due diligence, le repreneur doit vérifier :

- **La continuité des couvertures** : les polices d'assurance ne sont pas automatiquement transférées en cas de cession de fonds de commerce (article L. 121-10 du Code des assurances). En revanche, en cas de cession de titres, les contrats restent dans la société
- **L'adéquation des garanties** : les plafonds de garantie sont-ils suffisants par rapport aux risques réels ? Les franchises sont-elles compatibles avec la trésorerie de l'entreprise ?
- **L'historique de sinistralité** : un historique de sinistres élevé peut entraîner des surprimes ou des résiliations à l'initiative de l'assureur
- **Les exclusions** : certaines polices comportent des exclusions importantes (faute intentionnelle, non-conformité réglementaire, pollution progressive)

**Le transfert des polices**

- **Cession de titres** : les polices d'assurance restent en vigueur (l'assuré est la société, pas les actionnaires). Le changement d'actionnariat doit être déclaré à l'assureur
- **Cession de fonds de commerce** : l'assurance est transférée de plein droit au cessionnaire, mais celui-ci peut résilier la police (article L. 121-10 du Code des assurances)
- **Fusion-absorption** : les polices de la société absorbée sont transférées à la société absorbante

Pour l'audit juridique, consultez [[audit-juridique-acquisition]].`
    },
    {
      id: 'assurance-dirigeant-repreneur',
      title: 'Assurances du dirigeant repreneur',
      content: `Le repreneur doit sécuriser sa **situation personnelle** en souscrivant des assurances adaptées à son nouveau statut de dirigeant d'entreprise.

**L'assurance emprunteur**

L'assurance emprunteur couvre le remboursement du prêt d'acquisition en cas de :

- **Décès** : le capital restant dû est remboursé à la banque
- **PTIA (Perte Totale et Irréversible d'Autonomie)** : même couverture que le décès
- **ITT (Incapacité Temporaire Totale)** : prise en charge des mensualités pendant l'arrêt de travail
- **Invalidité** : couverture partielle ou totale selon le taux d'invalidité

**Points d'attention :**

- **Délégation d'assurance** : depuis la loi Lagarde (2010) et la loi Lemoine (2022), le repreneur peut choisir librement son assureur (pas d'obligation de souscrire l'assurance proposée par la banque). Économie potentielle : 30 à 50 % de la prime
- **Quotité** : en cas de co-emprunteurs (couple), définir la répartition de la couverture (100 %/100 % pour une couverture maximale, 50 %/50 % pour réduire le coût)
- **Exclusions** : vérifier les exclusions (sports à risque, pathologies préexistantes, professions dangereuses)

**L'assurance homme clé (key person)**

Le repreneur est souvent la personne clé de l'entreprise reprise. L'assurance homme clé :

- **Bénéficiaire** : l'entreprise elle-même (pas le dirigeant ni ses héritiers)
- **Indemnisation** : couvre la perte de marge brute pendant la période de remplacement du dirigeant (généralement 12 à 24 mois)
- **Capital assuré** : 3 à 5 fois la rémunération annuelle du dirigeant
- **Déductibilité** : les primes sont déductibles du résultat fiscal de l'entreprise (article 39 du CGI, sous conditions)

**La prévoyance du dirigeant**

Le statut de dirigeant (TNS ou assimilé salarié) détermine la couverture sociale :

- **Gérant majoritaire SARL (TNS)** : couverture minimale en cas d'arrêt de travail (indemnités journalières faibles). Nécessité de souscrire un contrat de prévoyance complémentaire Madelin
- **Président SAS (assimilé salarié)** : couverture sociale plus protectrice (régime général), mais pas de couverture chômage
- **GSC (Garantie Sociale des Chefs d'entreprise)** : assurance chômage volontaire pour les dirigeants (cotisation annuelle de 0,5 à 2 % du revenu)

**L'assurance mandataire social**

Protège le dirigeant contre les mises en cause personnelles :

- **RC Mandataire Social (D&O — Directors & Officers)** : couvre les conséquences financières des fautes de gestion reprochées au dirigeant
- **Coût** : 1 000 à 5 000 € par an pour une PME
- **Couverture** : frais de défense, dommages-intérêts, amendes civiles (hors amendes pénales intentionnelles)
- **Période de couverture** : attention au fait antérieur (faits survenus avant la souscription de la police)

Pour les aspects de protection du repreneur, consultez [[financement-reprise-entreprise]] et [[closing-cession-entreprise]].`
    }
  ],
  faq: [
    {
      question: 'Qu\'est-ce qu\'une assurance W&I (Warranty & Indemnity) et quand est-elle utile ?',
      answer: 'L\'assurance W&I est un produit d\'assurance qui couvre les déclarations du vendeur contenues dans la garantie d\'actif et de passif (GAP). En cas de passif caché ou de fausseté d\'une déclaration, c\'est l\'assureur qui indemnise l\'acquéreur, et non le vendeur. Elle est particulièrement utile dans trois situations : lorsque le vendeur souhaite une sortie propre sans engagement résiduel (clean exit), lorsque l\'acquéreur veut renforcer sa protection (plafond de couverture supérieur à la GAP contractuelle), et dans les processus compétitifs où proposer une W&I rend l\'offre plus attractive. Son coût (1 à 3 % du montant de couverture) est raisonnable par rapport à la sécurité apportée. Elle est courante pour les transactions supérieures à 10 M€ mais se démocratise pour les opérations de 5 à 10 M€.'
    },
    {
      question: 'Comment négocier les termes de la garantie d\'actif et de passif ?',
      answer: 'La négociation de la GAP porte sur cinq paramètres clés : le plafond (cap), qui se négocie entre 20 et 50 % du prix (le vendeur pousse pour un plafond bas, l\'acquéreur pour un plafond élevé) ; le seuil de déclenchement (basket), généralement 0,5 à 1,5 % du prix, en deçà duquel l\'acquéreur ne peut pas réclamer ; la franchise (de minimis), qui exclut les sinistres individuels inférieurs à un montant donné (2 000 à 10 000 €) ; la durée, qui varie selon les risques (18 mois pour les risques généraux, 36 mois pour les risques fiscaux et sociaux, 60 mois pour les risques environnementaux) ; et le mécanisme de séquestre (5 à 15 % du prix bloqué pendant la durée de la GAP). L\'acquéreur doit insister sur des déclarations précises et exhaustives, tandis que le vendeur doit s\'assurer que les exclusions protègent contre les risques connus et assumés par l\'acquéreur.'
    },
    {
      question: 'Quelles assurances vérifier en priorité lors de la reprise d\'une entreprise ?',
      answer: 'Les assurances prioritaires à vérifier lors de la due diligence sont : la RC professionnelle (vérifier le maintien de la couverture des faits antérieurs — garantie subséquente), la multirisque professionnelle (adéquation des plafonds aux valeurs assurées, état des locaux), la perte d\'exploitation (durée d\'indemnisation suffisante, franchise compatible avec la trésorerie), l\'assurance cyber (de plus en plus critique, vérifier les plafonds et les exclusions), les assurances obligatoires sectorielles (décennale BTP, RC médicale, etc.), et l\'assurance homme clé (identifier les personnes clés et leur couverture). Post-acquisition, les actions prioritaires sont : déclarer le changement de propriétaire aux assureurs, revoir les plafonds de garantie, souscrire une assurance emprunteur pour le prêt d\'acquisition, et mettre en place une assurance mandataire social (D&O).'
    }
  ],
  cta: {
    text: 'Sécurisez votre opération de cession avec les bonnes garanties',
    tool: 'Valuations'
  }
};
