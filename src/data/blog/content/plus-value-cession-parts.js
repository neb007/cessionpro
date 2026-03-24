export default {
  chapters: [
    {
      id: 'calcul-plus-value-brute',
      title: 'Calcul de la plus-value brute de cession',
      content: `La **plus-value brute** de cession de parts sociales correspond à la différence entre le prix de cession et le prix d'acquisition des titres. Ce calcul, apparemment simple, comporte plusieurs subtilités qu'il convient de maîtriser.

**Formule de base :**

**Plus-value brute = Prix de cession - Prix d'acquisition**

**Détermination du prix de cession :**

- Le prix effectivement convenu entre les parties dans l'acte de cession
- Incluant les **compléments de prix** éventuels (earn-out, clause de garantie de passif)
- Diminué des **frais de cession** supportés par le cédant (honoraires d'avocat, commissions)

**Détermination du prix d'acquisition :**

- **Acquisition à titre onéreux** : prix effectivement payé + droits de mutation + frais d'acquisition
- **Acquisition à titre gratuit** (donation, succession) : valeur retenue pour le calcul des droits de mutation
- **Souscription au capital** : montant de l'apport (nominal + prime d'émission)
- **Attribution gratuite** : valeur à la date d'acquisition définitive

**Cas des titres acquis par lots successifs :**

Si le cédant a acquis ses titres en **plusieurs fois** à des prix différents, deux méthodes s'appliquent :

- **Prix moyen pondéré d'acquisition (PMPA)** : méthode de droit commun, moyenne des prix d'achat pondérée par les quantités
- **Méthode PEPS (Premier Entré, Premier Sorti)** : les premiers titres acquis sont réputés cédés en premier

**Exemple :**

- 100 parts acquises en 2010 à 500 euros pièce = 50 000 euros
- 50 parts acquises en 2015 à 800 euros pièce = 40 000 euros
- Cession de 150 parts en 2026 à 1 500 euros pièce = 225 000 euros

PMPA : (50 000 + 40 000) / 150 = 600 euros par part
Plus-value brute : (1 500 - 600) x 150 = **135 000 euros**`
    },
    {
      id: 'frais-deductibles',
      title: 'Les frais déductibles de la plus-value',
      content: `Certains frais viennent **réduire la plus-value imposable**, soit en augmentant le prix d'acquisition, soit en diminuant le prix de cession.

**Frais venant en majoration du prix d'acquisition :**

- **Droits de mutation** payés lors de l'acquisition initiale (droits d'enregistrement)
- **Frais d'acte** : honoraires de notaire, frais de rédaction de l'acte d'acquisition
- **Commissions d'intermédiaire** payées lors de l'achat
- **Frais de courtage** pour les titres cotés

**Frais venant en diminution du prix de cession :**

- **Honoraires d'avocat** directement liés à la cession (rédaction du protocole, négociation)
- **Commissions d'intermédiaire** versées au titre de la cession (courtier, cabinet M&A)
- **Frais de diagnostic** obligatoires préalables à la cession
- **Indemnité de rupture** versée en cas de clause de non-concurrence accessoire à la cession

**Frais NON déductibles :**

- Frais de **valorisation** de l'entreprise (considérés comme un acte de gestion, non un frais de cession)
- Frais de **conseil fiscal** pour l'optimisation de la cession
- Frais de **due diligence** comptable et financière (sauf si à la charge du cédant)
- Frais de **déplacement** liés aux négociations

**Point d'attention** : la déductibilité des frais doit être justifiée par des **factures** et un lien direct avec l'opération de cession. L'administration fiscale peut remettre en cause la déduction de frais insuffisamment documentés.

**Conseil** : conservez l'ensemble des factures et justificatifs pendant **6 ans** après la cession (délai de prescription fiscale). Organisez un dossier fiscal complet avec votre expert-comptable.`
    },
    {
      id: 'pfu-vs-bareme',
      title: 'PFU vs barème progressif : comparaison détaillée',
      content: `Le choix entre le PFU et le barème progressif est **déterminant** pour le montant final d'imposition. Voici une comparaison approfondie.

**Régime PFU (par défaut) :**

- Taux global : **30 %** (12,8 % IR + 17,2 % PS)
- Base : plus-value **brute** (aucun abattement)
- CSG non déductible
- Pas de prise en compte de la situation familiale
- Pas de contribution CEHR spécifique (mais la PV entre dans le RFR)

**Régime barème progressif (sur option) :**

- Taux IR : **0 % à 45 %** selon le revenu global du foyer
- Prélèvements sociaux : **17,2 %** sur la PV brute (invariable)
- Abattements applicables (titres acquis avant 2018)
- CSG déductible à hauteur de **6,8 %**
- Quotient familial applicable

**Simulation comparative :**

Hypothèse : plus-value de 400 000 euros, titres PME acquis en 2010 (détention > 8 ans), cédant célibataire sans autre revenu significatif.

**PFU :**
- 400 000 x 30 % = **120 000 euros**

**Barème + abattement renforcé 85 % :**
- Base IR : 400 000 x 15 % = 60 000 euros
- IR sur 60 000 euros : environ **10 200 euros** (après déduction du quotient)
- CSG déductible : 400 000 x 6,8 % = 27 200 euros (impact sur IR année suivante : environ -8 160 euros)
- PS : 400 000 x 17,2 % = **68 800 euros**
- Total approximatif : **70 840 euros**
- **Économie** : environ 49 000 euros par rapport au PFU

**Seuil de bascule :**

Le barème devient plus avantageux que le PFU dès que l'abattement pour durée de détention réduit significativement la base IR. En règle générale, pour des titres acquis avant 2018 et détenus plus de 8 ans, le barème est **presque toujours** gagnant.

Pour comprendre l'ensemble des options fiscales, consultez [[fiscalite-cession-entreprise]].`
    },
    {
      id: 'abattements-anciennete',
      title: 'Les abattements pour ancienneté des titres',
      content: `Les abattements pour durée de détention constituent le principal **levier d'optimisation fiscale** pour les cédants de long terme.

**Régime transitoire (titres acquis avant le 1er janvier 2018) :**

Ces abattements ne s'appliquent que si le cédant **opte pour le barème progressif** (ils sont incompatibles avec le PFU).

**Abattement de droit commun :**

- 0 % pour une détention inférieure à 2 ans
- **50 %** pour une détention de 2 à moins de 8 ans
- **65 %** pour une détention de 8 ans et plus

**Abattement renforcé (PME éligibles) :**

Conditions cumulatives de la société :

- Effectif inférieur à **250 salariés**
- CA annuel inférieur à **50 millions d'euros** ou total du bilan inférieur à 43 millions
- Société créée depuis **moins de 10 ans** à la date d'acquisition des titres
- Société non issue d'une concentration, restructuration ou extension d'activité
- Société **passible de l'IS** en France

Barème renforcé :

- **50 %** pour une détention de 1 à moins de 4 ans
- **65 %** pour une détention de 4 à moins de 8 ans
- **85 %** pour une détention de 8 ans et plus

**Application de l'abattement :**

- L'abattement réduit la base d'imposition à l'**IR uniquement**
- Les **prélèvements sociaux** restent calculés sur la plus-value brute (sans abattement)
- L'abattement ne réduit pas non plus la base de la **CEHR**

**Calcul de la durée de détention :**

- Le point de départ est la **date d'acquisition** des titres (achat, souscription, donation)
- Le point d'arrivée est la **date de cession** (signature de l'acte de cession)
- Le calcul se fait en **années civiles complètes** (de date à date)

**Point de vigilance** : en cas d'acquisition par lots, chaque lot a sa propre durée de détention. Il convient de calculer l'abattement **lot par lot**.`
    },
    {
      id: 'contribution-exceptionnelle',
      title: 'La contribution exceptionnelle sur les hauts revenus (CEHR)',
      content: `La **CEHR** est un impôt additionnel qui frappe les contribuables dont le revenu fiscal de référence dépasse certains seuils. La plus-value de cession entre dans le calcul du RFR.

**Barème de la CEHR :**

Pour les contribuables célibataires :

- RFR de 250 001 à 500 000 euros : **3 %**
- RFR supérieur à 500 000 euros : **4 %**

Pour les contribuables mariés ou pacsés (déclaration commune) :

- RFR de 500 001 à 1 000 000 euros : **3 %**
- RFR supérieur à 1 000 000 euros : **4 %**

**Impact sur la cession :**

La plus-value de cession entre **intégralement** dans le revenu fiscal de référence (sans abattement, même en cas d'option pour le barème progressif). La CEHR peut donc s'ajouter au PFU ou au barème + prélèvements sociaux.

**Exemple :**

- Cédant célibataire, plus-value de 700 000 euros, pas d'autre revenu
- RFR : 700 000 euros
- CEHR : (500 000 - 250 000) x 3 % + (700 000 - 500 000) x 4 % = 7 500 + 8 000 = **15 500 euros**

**Mécanisme de lissage (quotient) :**

Un dispositif de **lissage** existe pour atténuer l'effet de seuil lorsque le revenu exceptionnel (plus-value) est significativement supérieur au revenu habituel du contribuable. Ce mécanisme permet de calculer la CEHR comme si la plus-value avait été perçue sur plusieurs années.

**Conseil** : intégrez systématiquement la CEHR dans vos simulations fiscales. Sur une plus-value de 1 000 000 euros, la CEHR peut représenter un surcoût de **25 000 à 35 000 euros** que beaucoup de cédants oublient d'anticiper.`
    },
    {
      id: 'declaration-paiement',
      title: 'Déclaration et paiement de l\'impôt',
      content: `La déclaration de la plus-value de cession suit un calendrier précis qu'il convient de respecter scrupuleusement pour éviter les pénalités.

**Formulaires à compléter :**

- **Déclaration n° 2074** : déclaration des plus-values et moins-values de cession de valeurs mobilières
- **Déclaration n° 2042** : report du résultat net de plus-value dans la déclaration de revenus
- **Déclaration n° 2042-C** : le cas échéant, pour l'option barème progressif et les abattements
- **Déclaration n° 2074-ABT** : pour le calcul des abattements pour durée de détention

**Calendrier :**

- Cession réalisée en année N
- Déclaration en année N+1 (mai-juin, selon le calendrier fiscal)
- Paiement de l'impôt au moment du **solde** (septembre de N+1)

**Acompte obligatoire :**

Depuis 2018, un **prélèvement à la source** de 12,8 % (au titre de l'IR) est effectué par l'établissement payeur lors de la cession de titres détenus dans un compte-titres. Ce prélèvement est un acompte imputable sur l'impôt final.

**Compensation des moins-values :**

- Les moins-values de cession sont **imputables** sur les plus-values de même nature réalisées la même année
- L'excédent de moins-values est reportable pendant **10 ans**
- Les moins-values s'imputent sur les plus-values **brutes** (avant abattement)

**Pénalités en cas de retard :**

- **Intérêts de retard** : 0,20 % par mois de retard
- **Majoration de 10 %** en cas de retard de déclaration
- **Majoration de 40 %** en cas de manquement délibéré
- **Majoration de 80 %** en cas de manoeuvres frauduleuses

**Conseil** : confiez la déclaration à votre **expert-comptable** ou à un conseil fiscal spécialisé. La complexité des formulaires et des options fiscales justifie pleinement l'intervention d'un professionnel.`
    },
    {
      id: 'exemple-chiffre',
      title: 'Exemple chiffré complet',
      content: `Illustrons le calcul complet de l'imposition sur une cession de parts sociales à travers un cas concret.

**Situation :**

- Monsieur Dupont, 58 ans, marié, 2 enfants
- Fondateur d'une SARL créée en 2012
- Parts souscrites pour **20 000 euros** (valeur nominale)
- Cession de la totalité des parts pour **800 000 euros** en 2026
- Frais de cession (avocat, intermédiaire) : **25 000 euros**
- Autres revenus du foyer : **60 000 euros**
- Pas de départ en retraite

**Calcul de la plus-value brute :**

- Prix de cession net : 800 000 - 25 000 = **775 000 euros**
- Prix d'acquisition : **20 000 euros**
- Plus-value brute : **755 000 euros**

**Option 1 — PFU :**

- IR : 755 000 x 12,8 % = 96 640 euros
- PS : 755 000 x 17,2 % = 129 860 euros
- CEHR (RFR 815 000 euros, couple) : (815 000 - 500 000) x 3 % = 9 450 euros
- **Total PFU** : 96 640 + 129 860 + 9 450 = **235 950 euros** (31,2 % de la PV)

**Option 2 — Barème + abattement renforcé :**

- Détention > 8 ans, PME éligible : abattement de **85 %**
- Base IR : 755 000 x 15 % = 113 250 euros
- Revenus totaux : 60 000 + 113 250 = 173 250 euros (3 parts)
- IR estimé : environ **25 800 euros** (après quotient familial)
- CSG déductible : 755 000 x 6,8 % = 51 340 euros (impact IR N+1 : -15 400 euros environ)
- PS : 755 000 x 17,2 % = **129 860 euros**
- CEHR : même base (RFR inclut la PV brute) : **9 450 euros**
- **Total barème** : 25 800 + 129 860 + 9 450 - 15 400 = **149 710 euros** (19,8 % de la PV)

**Résultat** : l'option barème progressif permet une **économie de 86 240 euros** par rapport au PFU.

**Produit net de la cession** :
- PFU : 800 000 - 25 000 - 235 950 = **539 050 euros**
- Barème : 800 000 - 25 000 - 149 710 = **625 290 euros**

Pour optimiser davantage via une holding, consultez [[holding-cession-entreprise]].`
    }
  ],
  faq: [
    {
      question: 'La plus-value est-elle calculée sur le prix total ou sur le bénéfice de l\'entreprise ?',
      answer: 'La plus-value est calculée sur la différence entre le **prix de cession des titres** et leur **prix d\'acquisition** (ou valeur de souscription). Elle n\'a aucun rapport avec le bénéfice de l\'entreprise. Un dirigeant qui a créé sa société avec un capital de 10 000 euros et la revend 500 000 euros réalise une plus-value de 490 000 euros, indépendamment des résultats annuels de la société.'
    },
    {
      question: 'Les prélèvements sociaux bénéficient-ils des abattements pour durée de détention ?',
      answer: 'Non, les prélèvements sociaux de **17,2 %** sont toujours calculés sur la **plus-value brute**, sans aucun abattement. Seule la base d\'imposition à l\'impôt sur le revenu bénéficie des abattements pour durée de détention. C\'est un point crucial souvent sous-estimé par les cédants qui pensent que l\'abattement de 85 % réduit l\'ensemble de l\'imposition.'
    }
  ],
  cta: {
    tool: 'Targeting',
    text: 'Simulez votre plus-value nette de cession'
  }
};
