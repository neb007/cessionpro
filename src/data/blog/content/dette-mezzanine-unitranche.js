export default {
  chapters: [
    {
      id: 'definition-dette-mezzanine',
      title: 'Qu\'est-ce que la dette mezzanine ?',
      content: `La **dette mezzanine** est un instrument de financement hybride, situé entre la dette senior (bancaire) et les fonds propres dans la structure de capital d'une entreprise. Son nom provient de l'architecture : la mezzanine se situe entre le rez-de-chaussée (dette senior) et l'étage supérieur (equity).

**Caractéristiques fondamentales**

La dette mezzanine présente des caractéristiques spécifiques qui la distinguent des autres formes de financement :

- **Subordination** : elle est remboursée après la dette senior mais avant les fonds propres en cas de liquidation
- **Rémunération élevée** : taux d'intérêt compris entre 10 % et 18 % par an (contre 3 à 6 % pour la dette senior), reflétant le risque supérieur
- **Durée longue** : maturité de 7 à 10 ans, généralement remboursée in fine (bullet)
- **Absence de garanties réelles** : contrairement à la dette senior, elle n'est pas adossée à des sûretés sur les actifs
- **Flexibilité des covenants** : moins de ratios financiers contraignants que la dette senior

**Les différentes formes de dette mezzanine**

La dette mezzanine peut prendre plusieurs formes juridiques :

- **Obligations subordonnées** : titres de créance classiques avec un rang de remboursement inférieur
- **Obligations convertibles** : dette convertible en actions sous certaines conditions, offrant un potentiel d'upside au prêteur
- **Prêt participatif** : instrument spécifique du droit français (articles L. 313-13 à L. 313-20 du Code monétaire et financier), assimilé à des quasi-fonds propres
- **Obligations à bons de souscription d'actions (OBSA)** : dette assortie de warrants permettant de souscrire au capital

**Pourquoi recourir à la dette mezzanine ?**

L'intérêt principal de la mezzanine est de permettre le financement d'une acquisition **sans dilution excessive** de l'acquéreur :

- Elle complète la dette senior lorsque les banques ne financent pas au-delà de 3,5 à 4,5x l'EBITDA
- Elle réduit le besoin en fonds propres, augmentant ainsi le **TRI** (taux de rendement interne) de l'opération
- Elle est particulièrement utilisée dans les opérations de LBO (voir [[financement-lbo-montage]])

Pour comprendre le contexte plus large du financement d'acquisition, consultez [[financement-reprise-entreprise]].`
    },
    {
      id: 'dette-unitranche',
      title: 'La dette unitranche : une alternative simplifiée',
      content: `La **dette unitranche** est une innovation financière apparue au début des années 2010 en Europe, qui combine en un seul instrument la dette senior et la dette mezzanine. Elle est principalement fournie par des fonds de dette privée (private debt funds).

**Principe de fonctionnement**

Au lieu de structurer le financement en plusieurs tranches avec des prêteurs différents :

- **Structure traditionnelle** : dette senior (banques) + dette mezzanine (fonds mezzanine) + equity
- **Structure unitranche** : dette unitranche unique (fonds de dette) + equity

La dette unitranche fusionne les deux tranches en un seul prêt avec un taux d'intérêt unique, généralement compris entre **6 % et 10 %** — un taux intermédiaire entre la dette senior et la mezzanine.

**Avantages de l'unitranche**

- **Simplicité** : un seul prêteur, un seul contrat de crédit, une seule négociation
- **Rapidité d'exécution** : le processus de mise en place est plus rapide qu'une syndication bancaire classique (4 à 6 semaines vs 8 à 12 semaines)
- **Flexibilité** : covenants moins contraignants, pas de test de covenants trimestriel (covenant-lite ou covenant-loose)
- **Certitude de financement** : le fonds de dette s'engage seul, éliminant le risque de syndication
- **Levier supérieur** : possibilité d'aller jusqu'à 5 à 6x l'EBITDA en levier total, contre 4 à 4,5x en dette senior pure
- **Absence d'amortissement** : remboursement in fine, préservant la trésorerie de l'entreprise

**Inconvénients de l'unitranche**

- **Coût supérieur** : le taux blended est plus élevé que celui d'une dette senior seule
- **Montants limités** : les fonds de dette européens financent généralement des opérations entre 10 et 300 M€ de dette
- **Concentration du risque** : un seul créancier, ce qui peut poser problème en cas de restructuration
- **Moindre relation bancaire** : pas de relation avec les banques commerciales, utile pour le crédit revolving et les services bancaires quotidiens

**Le marché de l'unitranche en France**

Le marché français de la dette unitranche a connu une croissance spectaculaire :

- En 2015, la dette unitranche représentait environ 15 % des financements d'acquisition mid-cap
- En 2024, cette proportion dépasse 40 % sur le segment des entreprises valorisées entre 50 et 500 M€
- Les principaux acteurs en France incluent des fonds comme Tikehau Capital, Eurazeo PME, ICG, Ares Management, et HPS Investment Partners
- Le marché européen de la dette privée a atteint plus de 400 milliards d'euros d'encours en 2024

L'unitranche est devenue un outil incontournable du financement d'acquisition en France, particulièrement prisé par les fonds de private equity pour sa rapidité et sa flexibilité.`
    },
    {
      id: 'structuration-financement-lbo',
      title: 'Structuration du financement dans un LBO : le rôle clé de la mezzanine',
      content: `Dans une opération de **LBO** (Leveraged Buy-Out), la structuration du financement est un exercice d'ingénierie financière qui vise à optimiser le **rendement des fonds propres** tout en respectant la capacité de remboursement de la cible.

**La structure type d'un LBO**

Un LBO mid-cap français se structure typiquement ainsi :

- **Fonds propres (equity)** : 35 à 50 % du prix d'acquisition
- **Dette senior** : 30 à 45 % du prix, soit 3 à 4x l'EBITDA
- **Dette mezzanine ou unitranche** : 10 à 20 % du prix, soit 1 à 2x l'EBITDA supplémentaire
- **Crédit vendeur** éventuel : 5 à 10 % du prix (voir [[credit-vendeur-cession]])

**Exemple chiffré**

Pour une entreprise valorisée à 50 M€ sur la base d'un multiple de 7x l'EBITDA (EBITDA de 7,14 M€) :

- Equity : 20 M€ (40 %)
- Dette senior (3,5x EBITDA) : 25 M€ (50 %)
- Dette mezzanine (0,7x EBITDA) : 5 M€ (10 %)
- Levier total : 4,2x EBITDA

Le service de la dette annuel (intérêts + amortissement de la dette senior) ne doit pas excéder 60 à 70 % du free cash-flow de l'entreprise pour maintenir une marge de sécurité suffisante.

**L'articulation entre dette senior et mezzanine**

L'accord inter-créanciers (intercreditor agreement) régit les relations entre les prêteurs :

- **Ordre de priorité** : la dette senior est remboursée en premier (principal et intérêts)
- **Standstill period** : période durant laquelle le prêteur mezzanine ne peut pas accélérer sa dette en cas de défaut (généralement 90 à 180 jours)
- **Cure rights** : droit du fonds mezzanine de remédier à un défaut sur la dette senior en injectant des fonds
- **Partage des sûretés** : la dette mezzanine bénéficie d'un nantissement de second rang sur les titres de la holding

**L'impact sur le TRI du fonds**

L'utilisation de la dette mezzanine a un effet de levier direct sur le TRI :

- Sans mezzanine (equity 50 %, dette senior 50 %) : TRI estimé à 18-20 %
- Avec mezzanine (equity 40 %, dette senior 45 %, mezzanine 15 %) : TRI estimé à 22-25 %

Cet effet de levier additionnel explique pourquoi les fonds de private equity sont prêts à payer un coût de la dette mezzanine significativement supérieur à celui de la dette senior.

Pour plus de détails sur les montages LBO, consultez [[financement-lbo-montage]].`
    },
    {
      id: 'acteurs-marche-dette-privee',
      title: 'Les acteurs du marché de la dette privée en France',
      content: `Le marché de la dette privée (private debt) en France s'est considérablement développé depuis la crise financière de 2008, avec l'émergence de fonds spécialisés qui complètent ou remplacent le financement bancaire traditionnel.

**Les différentes catégories de prêteurs**

- **Les fonds de dette mezzanine** : spécialisés dans la tranche subordonnée, ils interviennent en complément des banques (exemples : ICG, Tikehau Capital, Omnes Capital)
- **Les fonds de dette unitranche** : ils fournissent l'intégralité du financement d'acquisition en un seul instrument (exemples : Ares Management, HPS Investment Partners, Pemberton, Hayfin)
- **Les fonds de dette senior directe** (direct lending) : ils remplacent les banques sur la tranche senior, souvent avec plus de flexibilité
- **Les assureurs et mutuelles** : de plus en plus actifs sur le segment de la dette privée pour diversifier leurs portefeuilles (AXA IM, Allianz GI)
- **Les family offices** : certains interviennent sur des opérations de taille plus modeste

**Critères de sélection d'un prêteur mezzanine ou unitranche**

Le choix du prêteur est stratégique et doit prendre en compte plusieurs critères :

- **Track record** : expérience du fonds sur le secteur d'activité de la cible
- **Capacité de déploiement** : ticket minimum et maximum, capacité à financer seul ou nécessité de co-investissement
- **Flexibilité des termes** : covenants, amortissement, prépaiement, taux fixe vs variable
- **Rapidité d'exécution** : capacité à délivrer un term sheet et à closer dans les délais du processus M&A
- **Comportement en cas de difficulté** : approche constructive vs agressive en cas de breach de covenants
- **Valeur ajoutée** : réseau, expertise sectorielle, accompagnement stratégique

**L'évolution réglementaire**

Le cadre réglementaire français a évolué pour faciliter le développement de la dette privée :

- **Directive AIFM** (2011) : encadrement des fonds d'investissement alternatifs, incluant les fonds de dette
- **Réforme des fonds de prêt à l'économie** (2015) : les fonds de dette français peuvent désormais octroyer directement des prêts (décret du 17 octobre 2014)
- **Loi PACTE** (2019) : facilitation de l'accès des PME aux marchés de capitaux et aux financements alternatifs
- **Règlement ELTIF 2.0** (2024) : nouveau cadre européen favorisant les investissements de long terme, incluant la dette privée

**Tendances du marché**

Plusieurs tendances marquent l'évolution du marché :

- **Croissance continue** : le marché européen de la dette privée a doublé en 5 ans
- **Compression des spreads** : la concurrence accrue entre prêteurs a réduit les marges, au bénéfice des emprunteurs
- **ESG et dette durable** : émergence de margin ratchets liés à des critères ESG (réduction du taux d'intérêt si des objectifs RSE sont atteints)
- **Digitalisation** : plateformes digitales de mise en relation entre emprunteurs et prêteurs
- **Consolidation** : rapprochement entre gestionnaires de dette et de private equity`
    },
    {
      id: 'quand-utiliser-mezzanine-unitranche',
      title: 'Quand utiliser la mezzanine ou l\'unitranche : guide pratique',
      content: `Le choix entre dette mezzanine traditionnelle, unitranche, ou financement bancaire pur dépend de nombreux facteurs liés à la taille de l'opération, au profil de l'entreprise et aux objectifs de l'acquéreur.

**Matrice de décision**

Financement bancaire pur (dette senior seule) :

- Opérations de petite taille (< 10 M€ de dette)
- Entreprises avec un profil de risque faible et un cash-flow prévisible
- Levier modéré (< 3,5x EBITDA)
- Relation bancaire existante forte

Dette senior + mezzanine :

- Opérations mid-cap (10 à 100 M€ de dette totale)
- Besoin de levier supérieur (4 à 5,5x EBITDA)
- Entreprise avec un EBITDA stable et une bonne conversion en cash
- Acquéreur souhaitant minimiser sa mise en equity

Unitranche :

- Opérations mid-cap à large-cap (15 à 300 M€ de dette)
- Besoin de rapidité d'exécution (processus compétitif, pression calendaire)
- Préférence pour la simplicité (un seul interlocuteur)
- Tolérance au coût supérieur en contrepartie de la flexibilité

**Cas d'usage spécifiques**

La dette mezzanine est particulièrement adaptée dans les situations suivantes :

- **MBO/MBI avec apport limité** : le management reprend l'entreprise avec un apport personnel réduit, la mezzanine complète l'equity (voir [[management-buy-out-mbo]])
- **Build-up strategy** : financement d'acquisitions complémentaires post-LBO, la mezzanine apporte la flexibilité nécessaire pour saisir les opportunités
- **Entreprises en croissance** : sociétés avec un profil de croissance fort mais un EBITDA actuel ne justifiant pas un levier senior élevé
- **Recapitalisations** : distribution de dividendes aux actionnaires financée par de la dette subordonnée (dividend recap)

**Points de vigilance pour l'emprunteur**

- **Coût total du financement** : analyser le coût blended (WACD — Weighted Average Cost of Debt) plutôt que le coût de chaque tranche isolément
- **Dilution potentielle** : certains instruments mezzanine comportent un equity kicker (warrants, conversion), ce qui dilue les actionnaires
- **Capacité de remboursement** : le service de la dette totale (senior + mezzanine) ne doit pas compromettre les investissements nécessaires à la croissance
- **Clauses de prépaiement** : vérifier les pénalités de remboursement anticipé, qui peuvent être élevées (call protection de 2 à 5 ans)
- **Documentation juridique** : l'accord inter-créanciers est un document complexe qui nécessite l'accompagnement d'un avocat spécialisé en financement

Pour une vue d'ensemble des options de financement disponibles, consultez [[financement-reprise-entreprise]].`
    }
  ],
  faq: [
    {
      question: 'Quelle est la différence entre dette mezzanine et dette unitranche ?',
      answer: 'La dette mezzanine est un financement subordonné qui vient en complément de la dette senior bancaire, avec un taux élevé (10-18 %) reflétant son rang de remboursement inférieur. La dette unitranche fusionne dette senior et mezzanine en un seul instrument avec un taux intermédiaire (6-10 %), fourni par un fonds de dette unique. L\'unitranche offre plus de simplicité et de rapidité d\'exécution, tandis que la mezzanine traditionnelle peut être moins coûteuse en coût blended lorsqu\'elle est combinée avec une dette senior à taux attractif.'
    },
    {
      question: 'Quel niveau de levier peut-on atteindre avec de la dette mezzanine ?',
      answer: 'En combinant dette senior et mezzanine, il est possible d\'atteindre un levier total de 4,5 à 5,5x l\'EBITDA, contre 3,5 à 4x en dette senior seule. Avec une unitranche, le levier peut aller jusqu\'à 5 à 6x l\'EBITDA. Le niveau de levier acceptable dépend de la stabilité du cash-flow de l\'entreprise, de son secteur d\'activité et des conditions de marché.'
    },
    {
      question: 'La dette mezzanine entraîne-t-elle une dilution pour l\'acquéreur ?',
      answer: 'Pas nécessairement. La dette mezzanine sous forme d\'obligations subordonnées simples n\'entraîne aucune dilution. En revanche, certains instruments mezzanine comportent un equity kicker (bons de souscription d\'actions, option de conversion) qui peut diluer les actionnaires à terme, généralement de 3 à 10 % du capital. Ce point doit être soigneusement négocié lors de la structuration du financement.'
    }
  ],
  cta: {
    text: 'Simulez le financement optimal de votre acquisition : dette senior, mezzanine ou unitranche',
    tool: 'Financing'
  }
};
