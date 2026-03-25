export default {
  chapters: [
    {
      id: 'definitions-vc-pe',
      title: 'Venture Capital et Private Equity : définitions et périmètres',
      content: `Le **Venture Capital** (VC, ou capital-risque) et le **Private Equity** (PE, ou capital-investissement) sont deux formes d'investissement en fonds propres dans des entreprises non cotées. Bien qu'ils partagent des mécanismes communs, ils s'adressent à des entreprises à des stades de maturité très différents et impliquent des logiques d'investissement distinctes.

**Le Venture Capital (capital-risque)**

Le VC finance des entreprises en phase de création ou de développement initial :

- **Stade d'intervention** : seed, série A, série B, parfois série C
- **Profil des cibles** : start-ups et scale-ups à fort potentiel de croissance, souvent technologiques
- **Ticket moyen** : de 500 K€ (seed) à 30 M€ (série B/C) en France
- **Rendement recherché** : multiple de 10x à 100x sur les succès, pour compenser un taux d'échec élevé (50 à 70 % des participations)
- **Horizon d'investissement** : 5 à 10 ans
- **Participation au capital** : minoritaire (10 à 40 % par tour de table)

**Le Private Equity (capital-investissement)**

Le PE finance des entreprises matures, rentables, avec des cash-flows établis :

- **Stade d'intervention** : capital-développement, capital-transmission (LBO), retournement
- **Profil des cibles** : PME et ETI rentables, avec un EBITDA positif et récurrent
- **Ticket moyen** : de 5 M€ (small cap) à plusieurs milliards (large cap)
- **Rendement recherché** : TRI de 15 à 25 %, avec un multiple de 2 à 3x
- **Horizon d'investissement** : 3 à 7 ans
- **Participation au capital** : majoritaire (50 à 100 %) en LBO, minoritaire en capital-développement

Selon France Invest, le marché français du capital-investissement a représenté 24,5 milliards d'euros investis en 2023, dont environ 3,5 milliards en capital-risque.

**Le continuum du capital-investissement**

En réalité, VC et PE se situent sur un continuum :

- **Seed / Amorçage** → **Série A/B** (VC) → **Growth equity** (late-stage VC / early PE) → **Capital-développement** (PE) → **LBO / Transmission** (PE)

Le growth equity, segment intermédiaire, finance des entreprises en forte croissance mais déjà rentables ou proches de la rentabilité, avec des tickets de 20 à 100 M€.`
    },
    {
      id: 'differences-fondamentales',
      title: 'Les différences fondamentales entre VC et PE',
      content: `Au-delà du stade de maturité des entreprises ciblées, VC et PE diffèrent fondamentalement dans leur approche d'investissement, leur mode de création de valeur et leur gestion du risque.

**Approche du risque**

- **VC** : accepte un risque très élevé. Sur un portefeuille de 20 investissements, un fonds VC s'attend à ce que 1 à 3 participations génèrent l'essentiel du rendement (loi de puissance). 50 à 70 % des investissements seront des échecs partiels ou totaux.
- **PE** : cherche à minimiser le risque. Chaque investissement doit être rentable. Le taux de perte est faible (5 à 15 % du portefeuille). La due diligence est plus approfondie (voir [[due-diligence-fonds-investissement]]).

**Mode de création de valeur**

- **VC** : la valeur se crée par la **croissance du chiffre d'affaires** et l'expansion du marché. Le fonds VC accompagne la start-up dans son développement commercial, son recrutement et sa stratégie produit.
- **PE** : la valeur se crée par trois leviers — **croissance organique et externe**, **amélioration opérationnelle** (optimisation des marges, réduction des coûts), et **effet de levier financier** (remboursement progressif de la dette LBO).

**Utilisation de la dette**

- **VC** : pas ou très peu de dette. Le financement est quasi exclusivement en fonds propres, parfois complété par des obligations convertibles ou du venture debt.
- **PE (LBO)** : recours massif à la dette. Typiquement 50 à 65 % du prix d'acquisition est financé par de la dette (senior + mezzanine). Voir [[dette-mezzanine-unitranche]] et [[financement-lbo-montage]].

**Gouvernance et contrôle**

- **VC** : investisseur minoritaire, le fonds VC exerce son influence via le board (siège au conseil d'administration), des droits de veto sur les décisions stratégiques, et un pacte d'actionnaires protecteur.
- **PE** : en LBO, le fonds est majoritaire et contrôle la gouvernance. Il nomme le management (ou le maintient avec un package d'intéressement), définit la stratégie et supervise l'exécution du business plan.

**Métriques clés**

- **VC** : MRR/ARR (revenus récurrents), taux de croissance mensuel, burn rate, runway, CAC/LTV, rétention nette
- **PE** : EBITDA, free cash-flow, levier net, multiple d'entrée/sortie, TRI, MOIC (multiple on invested capital)

**Valorisation**

- **VC** : valorisation basée sur les multiples de revenus (chiffre d'affaires ou ARR), souvent 5 à 20x les revenus pour les meilleures start-ups tech
- **PE** : valorisation basée sur les multiples d'EBITDA, typiquement 5 à 12x l'EBITDA selon le secteur et la taille (voir [[methodes-valorisation-entreprise]])`
    },
    {
      id: 'implications-cedant-repreneur',
      title: 'Implications pour le cédant et le repreneur',
      content: `Le choix entre un investisseur VC et PE a des implications majeures pour le dirigeant, qu'il soit cédant, fondateur en recherche de financement, ou repreneur.

**Pour le fondateur / dirigeant en place**

Lever des fonds auprès d'un VC :

- **Dilution progressive** : chaque tour de table dilue les fondateurs (typiquement 15 à 25 % par tour). Après 3 tours, un fondateur peut ne détenir que 20 à 30 % du capital.
- **Pression à la croissance** : le modèle VC exige une croissance rapide pour justifier les valorisations. Le dirigeant subit une pression intense pour atteindre les milestones.
- **Alignement des intérêts** : le VC cherche une sortie (IPO ou revente) qui maximise le multiple. Le fondateur doit accepter cet horizon.
- **Gouvernance partagée** : droits de veto du VC sur les décisions clés (recrutement, budget, levée suivante, cession).

Accueillir un fonds de PE en capital-développement :

- **Dilution limitée** : le fonds prend généralement 20 à 49 % du capital en minoritaire
- **Accompagnement stratégique** : le fonds apporte son réseau, son expertise sectorielle et ses ressources opérationnelles
- **Horizon de sortie défini** : le pacte d'actionnaires prévoit un mécanisme de liquidité à terme (voir [[pacte-actionnaires-investisseurs]])
- **Professionnalisation** : mise en place de reporting, de gouvernance structurée, de processus RH

**Pour le cédant d'une PME**

Le cédant d'une PME mature sera principalement confronté à des fonds de PE en mode LBO :

- **Prix d'acquisition** : les fonds PE paient généralement des multiples inférieurs aux acquéreurs industriels (pas de prime de synergie), mais offrent une certitude d'exécution supérieure
- **Structure de prix** : partie du prix en complément de prix ([[earn-out-complement-prix]]), réinvestissement demandé au cédant (5 à 20 % du capital post-opération)
- **Accompagnement post-cession** : le fonds demande souvent au cédant de rester 1 à 3 ans pour assurer la transition
- **Garantie d'actif et de passif** : plus exigeante qu'avec un acquéreur industriel (voir [[garantie-actif-passif-cession]])

**Pour le repreneur individuel**

Un repreneur individuel (management buy-in) peut s'adosser à un fonds de PE :

- Le fonds apporte 60 à 80 % de l'equity, le repreneur 20 à 40 %
- Le repreneur bénéficie de l'expertise du fonds en structuration financière et en gouvernance
- En contrepartie, le repreneur accepte une gouvernance encadrée et un horizon de sortie défini
- Le management package (actions gratuites, BSPCE, stock-options) aligne les intérêts

Pour approfondir les structures de reprise, consultez [[management-buy-out-mbo]].`
    },
    {
      id: 'pacte-actionnaires-vc-pe',
      title: 'Le pacte d\'actionnaires : différences entre VC et PE',
      content: `Le pacte d'actionnaires est un document juridique essentiel dans les opérations VC comme PE. Cependant, les clauses et leur portée diffèrent significativement selon le contexte.

**Clauses communes**

Certaines clauses se retrouvent dans les deux types de pactes :

- **Clause de tag-along** (droit de sortie conjointe) : permet à l'investisseur de vendre ses titres aux mêmes conditions que l'actionnaire majoritaire
- **Clause de drag-along** (obligation de sortie conjointe) : permet à l'actionnaire majoritaire de forcer la vente de l'ensemble des titres
- **Droit de préemption** : priorité d'achat en cas de cession de titres par un actionnaire
- **Clause d'inaliénabilité (lock-up)** : interdiction de céder ses titres pendant une période déterminée

**Clauses spécifiques au VC**

- **Clause de ratchet** (anti-dilution) : protège l'investisseur VC en cas de tour de table ultérieur à une valorisation inférieure (down round). Le ratchet peut être full ratchet (protection totale) ou weighted average (protection proportionnelle).
- **Préférence de liquidation (liquidation preference)** : en cas de cession ou liquidation, l'investisseur VC récupère en priorité son investissement (1x non participating) ou son investissement plus une quote-part du solde (participating preferred)
- **Pay-to-play** : oblige l'investisseur à participer aux tours suivants sous peine de perdre ses droits préférentiels
- **Vesting des fondateurs** : le fondateur acquiert progressivement ses titres sur 3 à 4 ans, avec une clause de cliff (généralement 1 an)
- **Good leaver / Bad leaver** : conditions de rachat des titres du fondateur en cas de départ

**Clauses spécifiques au PE (LBO)**

- **Management package** : intéressement du management au capital via des instruments dilutifs (sweet equity, BSPCE, actions de préférence), avec un effet de levier sur le rendement en cas de surperformance
- **Clause de non-concurrence** : engagement renforcé du dirigeant et du cédant
- **Reporting obligations** : obligations de reporting financier mensuel ou trimestriel au fonds
- **Réserve de gouvernance** : décisions soumises à l'approbation préalable du fonds (investissements au-delà d'un seuil, recrutements clés, endettement)
- **Mécanisme de sortie** : clause de sortie à terme (put/call), droit de forcer un processus de cession après une période déterminée (typiquement 5-7 ans)

Pour une analyse détaillée des pactes d'actionnaires avec investisseurs, consultez [[pacte-actionnaires-investisseurs]].`
    },
    {
      id: 'choisir-entre-vc-pe',
      title: 'Comment choisir entre VC et PE pour son entreprise',
      content: `Le choix entre VC et PE n'en est pas toujours un : il dépend fondamentalement du **stade de développement** de l'entreprise, de son **profil de croissance** et des **objectifs du dirigeant**.

**Critères de décision**

Optez pour un financement VC si :

- Votre entreprise est en phase de démarrage ou de croissance rapide
- Vous visez un marché potentiel très large (TAM > 1 Md€)
- Votre modèle économique n'est pas encore rentable mais présente un potentiel d'hypercroissance
- Vous êtes prêt à accepter une dilution significative en contrepartie d'un accompagnement stratégique
- Vous visez une sortie par IPO ou revente à un acteur stratégique à horizon 5-10 ans

Optez pour un financement PE si :

- Votre entreprise est rentable avec un EBITDA récurrent
- Vous cherchez à financer une transmission (LBO), une croissance externe ou un développement
- Vous souhaitez limiter la dilution grâce à l'effet de levier
- Vous avez un projet de cession à moyen terme et cherchez un partenaire pour préparer la sortie
- Vous valorisez la stabilité et la prévisibilité dans la relation avec votre investisseur

**Les hybrides et cas particuliers**

Le marché a vu émerger des modèles hybrides :

- **Growth equity** : fonds investissant dans des entreprises en forte croissance mais proches de la rentabilité (ex : General Atlantic, Eurazeo Growth). Tickets de 20 à 100 M€, minoritaire ou majoritaire.
- **Venture debt** : dette pour start-ups, complémentaire du VC, permettant de financer la croissance sans dilution additionnelle (ex : Bpifrance, Silicon Valley Bank, Aventur)
- **Revenue-based financing** : financement basé sur le chiffre d'affaires, sans dilution ni garantie personnelle, adapté aux SaaS et e-commerce
- **Search funds** : véhicule permettant à un entrepreneur de lever des fonds pour rechercher et acquérir une PME (voir [[search-fund-acquisition]])

**L'écosystème français**

La France dispose d'un écosystème VC et PE dynamique :

- **VC** : Partech, Eurazeo, Idinvest (Eurazeo), Serena Capital, Elaia Partners, Breega, Bpifrance
- **PE mid-cap** : Ardian, PAI Partners, Eurazeo, Tikehau Capital, Sagard, Naxicap, IK Partners
- **PE small-cap** : Capza, Entrepreneur Invest, Ciclad, Siparex, Initiative et Finance, MBO Partenaires

Le choix du bon investisseur ne se résume pas à la catégorie VC ou PE : il faut aussi évaluer l'adéquation sectorielle, la culture du fonds, la qualité de l'équipe d'investissement et la valeur ajoutée opérationnelle apportée.

Pour explorer les options de financement de votre projet, consultez [[financement-reprise-entreprise]].`
    }
  ],
  faq: [
    {
      question: 'Un fonds de PE peut-il investir dans une start-up, et un VC dans une PME mature ?',
      answer: 'Oui, les frontières sont poreuses. Certains fonds de PE ont des poches dédiées au growth equity ou au capital-innovation. Inversement, certains fonds VC late-stage investissent dans des entreprises déjà rentables en forte croissance. Le segment du growth equity, situé entre VC et PE, finance des entreprises en croissance rapide mais déjà proches de la rentabilité, avec des tickets de 20 à 100 M€.'
    },
    {
      question: 'Quelle dilution attendre avec un VC versus un fonds de PE ?',
      answer: 'Avec un VC, la dilution est progressive mais significative : 15 à 25 % par tour de table. Après 3 tours, un fondateur peut ne conserver que 20 à 30 % du capital. Avec un fonds de PE en capital-développement, la dilution est généralement limitée à 20-49 % en une seule opération. En LBO, le fonds PE prend le contrôle majoritaire, mais le management bénéficie d\'un package d\'intéressement au capital.'
    },
    {
      question: 'Les fonds de PE offrent-ils un meilleur prix que les VC lors d\'une cession ?',
      answer: 'Les fonds de PE en LBO paient généralement des multiples d\'EBITDA (5 à 12x selon le secteur), tandis que les VC late-stage valorisent sur des multiples de revenus (5 à 20x). Le prix absolu dépend du profil de l\'entreprise. Les industriels offrent souvent les prix les plus élevés grâce aux synergies. Les fonds PE compensent par une plus grande certitude d\'exécution et une rapidité de closing.'
    }
  ],
  cta: {
    text: 'Identifiez le type d\'investisseur idéal pour votre entreprise : estimez votre valorisation',
    tool: 'Valuations'
  }
};
