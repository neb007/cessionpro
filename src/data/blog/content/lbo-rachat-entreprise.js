export default {
  chapters: [
    {
      id: 'principe-du-lbo',
      title: 'Principe du LBO : l\'effet de levier appliqué au rachat',
      content: `Le **Leveraged Buy-Out (LBO)** est un montage financier qui permet de racheter une entreprise en utilisant principalement de la **dette**, remboursée par les flux de trésorerie de la cible elle-même. Le repreneur n'apporte qu'une fraction du prix sous forme de fonds propres.

**Le principe fondamental :**

- Le repreneur crée une **société holding** (NewCo)
- La holding contracte un emprunt bancaire pour financer l'acquisition
- La holding rachète les titres de la société cible
- Les **dividendes remontés** par la cible servent à rembourser la dette de la holding
- Au terme du remboursement, le repreneur détient 100 % d'une entreprise financée majoritairement par la dette

**Conditions de réussite d'un LBO :**

- La cible doit générer des **cash-flows réguliers et prévisibles**
- L'EBE doit être suffisant pour couvrir le service de la dette
- L'activité doit être **peu cyclique** et peu capitalistique
- Le management doit être solide et autonome

Le LBO n'est pas réservé aux grands groupes : il est parfaitement applicable aux **PME** valorisées à partir de 300 000 euros. C'est le montage privilégié des repreneurs individuels souhaitant maximiser leur levier.

Pour comprendre les étapes préalables à toute reprise, consultez [[les-etapes-cession-entreprise]].`
    },
    {
      id: 'creation-holding',
      title: 'La création de la holding d\'acquisition',
      content: `La holding (ou NewCo) est le **véhicule juridique** au coeur du montage LBO. Elle sert d'intermédiaire entre le repreneur et la cible.

**Choix de la forme juridique :**

- **SAS** : forme la plus courante, grande souplesse statutaire
- **SARL** : possible mais moins flexible pour accueillir des investisseurs
- **SA** : réservée aux opérations d'envergure avec de nombreux actionnaires

**Capital social de la holding :**

- Constitué par l'**apport personnel** du repreneur
- Renforcé par les éventuels co-investisseurs ou prêts d'honneur
- Représente les **fonds propres** du montage (20 à 30 % du prix)

**Objet social :**

L'objet social doit être suffisamment large pour inclure la **détention de participations**, la gestion de filiales et les activités de holding animatrice. Ce dernier point est crucial pour bénéficier d'avantages fiscaux, notamment le régime mère-fille.

**Points d'attention :**

- Les statuts doivent prévoir les modalités de gouvernance entre actionnaires
- Un **pacte d'actionnaires** est indispensable si plusieurs investisseurs entrent au capital
- La holding doit être constituée **avant la signature de l'acte de cession**

Pour approfondir l'optimisation fiscale via la holding, consultez [[holding-cession-entreprise]].`
    },
    {
      id: 'structuration-dette',
      title: 'La structuration de la dette LBO',
      content: `La dette d'un LBO se structure en **plusieurs tranches** aux caractéristiques distinctes, chacune ayant un profil risque/rendement différent.

**Tranche A — Dette senior amortissable :**

- **Part** : 50 à 70 % de la dette totale
- **Durée** : 5 à 7 ans
- **Amortissement** : linéaire ou progressif
- **Taux** : Euribor + 2 % à 3,5 %
- **Garantie** : nantissement des titres de la cible

**Tranche B — Dette senior bullet (in fine) :**

- **Part** : 15 à 25 % de la dette totale
- **Durée** : 6 à 8 ans
- **Amortissement** : remboursement intégral à l'échéance
- **Taux** : Euribor + 3 % à 4,5 %

**Tranche C — Dette mezzanine :**

- **Part** : 10 à 20 % de la dette totale
- **Durée** : 7 à 9 ans
- **Subordination** : remboursement après les tranches A et B
- **Taux** : 8 % à 15 %, souvent avec un equity kicker

**Pour les PME**, le montage est généralement simplifié avec une seule tranche de dette senior, complétée éventuellement par un crédit vendeur faisant office de quasi-mezzanine.

Le ratio **dette totale / EBE** acceptable se situe entre **3x et 4,5x** selon la qualité de la cible.`
    },
    {
      id: 'remontee-dividendes',
      title: 'La remontée de dividendes : moteur du LBO',
      content: `Le remboursement de la dette LBO repose sur la **capacité de la cible à distribuer des dividendes** vers la holding. Ce mécanisme est le coeur du modèle économique.

**Le régime mère-fille :**

Lorsque la holding détient au moins **5 % du capital** de la filiale depuis plus de 2 ans, les dividendes remontés sont exonérés d'impôt sur les sociétés à hauteur de **95 %**. Seule une quote-part de frais et charges de 5 % reste imposable.

**Calcul de la capacité de distribution :**

- Résultat net de la cible
- Moins la dotation à la réserve légale (5 % jusqu'à 10 % du capital)
- Moins les investissements nécessaires au maintien de l'activité
- Moins le besoin en fonds de roulement additionnel
- **= Dividende distribuable**

**Points de vigilance :**

- Ne **jamais sur-distribuer** au détriment de l'investissement dans la cible
- Maintenir une **trésorerie de sécurité** dans la filiale opérationnelle
- Respecter les clauses bancaires limitant la distribution (covenants)
- Anticiper les variations de résultat avec un **scénario pessimiste**

**Erreur classique** : certains repreneurs calibrent leur LBO sur le résultat exceptionnel d'une année record. Il faut raisonner sur un **résultat normalisé**, idéalement la moyenne des 3 derniers exercices corrigée des éléments non récurrents.`
    },
    {
      id: 'covenants-bancaires',
      title: 'Les covenants bancaires : respecter ses engagements',
      content: `Les **covenants** sont des clauses contractuelles imposées par la banque dans le contrat de prêt LBO. Leur non-respect peut entraîner l'exigibilité anticipée de la dette.

**Covenants financiers courants :**

- **Levier (dette nette / EBE)** : ne pas dépasser un seuil dégressif (ex. : 4x en année 1, 3x en année 3)
- **DSCR (debt service coverage ratio)** : maintenir un ratio supérieur à 1,1x ou 1,2x
- **Gearing (dette nette / fonds propres)** : rester sous un plafond défini
- **Capex ratio** : limiter les investissements annuels à un pourcentage du CA

**Covenants comportementaux :**

- Interdiction de distribuer des dividendes au-delà de la holding (vers l'actionnaire)
- Obligation de fournir les comptes trimestriels ou semestriels
- Interdiction de contracter des dettes supplémentaires sans accord préalable
- Clause de changement de contrôle (change of control)

**En cas de breach (violation) :**

- **Waiver** : la banque accorde une dérogation temporaire (moyennant des frais)
- **Amendment** : renégociation des termes du covenant
- **Accélération** : la banque exige le remboursement immédiat (cas extrême)

**Conseil** : négociez des covenants avec une **marge de manoeuvre** de 15 à 20 % par rapport à votre prévisionnel. Un covenant trop serré transforme une difficulté passagère en crise de liquidité.`
    },
    {
      id: 'avantages-et-risques',
      title: 'Avantages et risques du LBO',
      content: `Le LBO présente des atouts considérables mais comporte aussi des risques qu'il faut mesurer avec lucidité.

**Avantages :**

- **Effet de levier financier** : le repreneur acquiert une entreprise dont la valeur excède largement sa mise de fonds
- **Effet de levier fiscal** : les intérêts d'emprunt de la holding sont déductibles grâce à l'intégration fiscale
- **Effet de levier juridique** : contrôle total avec un apport minoritaire en valeur absolue
- **Alignement des intérêts** : la pression du remboursement incite à une gestion rigoureuse
- **Création de valeur** : si l'entreprise est revendue à un multiple supérieur, le TRI est démultiplié

**Risques :**

- **Risque de surendettement** : un retournement conjoncturel peut rendre la dette insoutenable
- **Sous-investissement** : la priorité donnée au remboursement peut asphyxier l'outil productif
- **Pression sur le management** : le poids de la dette peut générer du stress et des décisions court-termistes
- **Covenants** : le non-respect des ratios peut déclencher une crise avec les créanciers
- **Dépendance aux dividendes** : toute baisse de résultat impacte directement le schéma de remboursement

**Le LBO est adapté si :**

- L'entreprise a un **EBE stable** ou en croissance modérée
- Le secteur n'est pas trop cyclique
- Le repreneur a une **expérience managériale** avérée
- Le prix d'acquisition correspond à un multiple raisonnable (4 à 6x l'EBE)

Pour évaluer correctement le multiple de valorisation, consultez [[methodes-valorisation-entreprise]].`
    },
    {
      id: 'exemple-chiffre',
      title: 'Exemple chiffré d\'un LBO sur une PME',
      content: `Prenons un cas concret pour illustrer le mécanisme d'un LBO sur une PME française.

**Hypothèses :**

- **Prix d'acquisition** : 1 000 000 euros
- **EBE de la cible** : 250 000 euros (multiple de 4x)
- **Résultat net** : 150 000 euros

**Structure du financement :**

- **Apport personnel du repreneur** : 250 000 euros (25 %)
- **Prêt d'honneur** : 50 000 euros (5 %)
- **Dette senior bancaire** : 600 000 euros sur 7 ans à 4 % (60 %)
- **Crédit vendeur** : 100 000 euros sur 2 ans à 2 % (10 %)

**Service de la dette annuel :**

- Dette senior : environ **103 000 euros** par an (capital + intérêts)
- Crédit vendeur : **51 000 euros** par an pendant 2 ans
- Total années 1-2 : **154 000 euros** / an
- Total années 3-7 : **103 000 euros** / an

**Capacité de distribution de la cible :**

- Résultat net : 150 000 euros
- Moins réserve légale et investissements : -30 000 euros
- **Dividende distribuable** : 120 000 euros

**Analyse :**

- En années 1-2, le DSCR est de 120 000 / 154 000 = **0,78x** — insuffisant. Le repreneur doit négocier un différé de remboursement de 12 mois sur la dette senior ou utiliser la trésorerie excédentaire de la cible.
- En années 3-7, le DSCR est de 120 000 / 103 000 = **1,17x** — acceptable mais serré.

**Conclusion** : ce montage est faisable mais nécessite d'**optimiser le BFR** et de négocier un différé d'amortissement. Avec une croissance de 5 % par an, le repreneur se retrouve propriétaire d'une entreprise valorisée 1 200 000 euros pour une mise de fonds de 250 000 euros — soit un **TRI de 25 %** sur 7 ans.`
    }
  ],
  faq: [
    {
      question: 'Un LBO est-il possible pour racheter une petite entreprise ?',
      answer: 'Oui, le LBO est parfaitement applicable aux **petites entreprises** dès lors que la cible dégage un EBE régulier d\'au moins 80 000 à 100 000 euros. Le montage est simplifié par rapport aux grands LBO : une seule tranche de dette senior, pas de mezzanine institutionnelle, et un crédit vendeur en complément. La clé est la capacité de la cible à distribuer suffisamment de dividendes pour rembourser la dette.'
    },
    {
      question: 'Quelle est la différence entre un LBO et un emprunt classique ?',
      answer: 'Dans un LBO, c\'est **l\'entreprise rachetée qui rembourse sa propre acquisition** via les dividendes remontés à la holding. Dans un emprunt classique, c\'est l\'emprunteur lui-même qui rembourse avec ses revenus personnels. Le LBO crée un effet de levier supérieur car la capacité de remboursement est celle de l\'entreprise, pas celle du repreneur. En contrepartie, le risque est concentré sur la performance future de la cible.'
    },
    {
      question: 'Combien de temps dure un LBO typique ?',
      answer: 'Un LBO classique sur une PME s\'étale sur **5 à 7 ans**, correspondant à la durée de la dette senior. À l\'issue de cette période, la dette est intégralement remboursée et le repreneur détient une entreprise libre de dettes. Certains LBO incluent une tranche de dette in fine remboursable à 8 ans. Au-delà de 7 ans, les banques considèrent le risque comme trop élevé pour une opération de transmission.'
    }
  ],
  cta: {
    tool: 'Financing',
    text: 'Simulez votre montage LBO'
  }
};
