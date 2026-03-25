export default {
  chapters: [
    {
      id: 'pi-actif-strategique-cession',
      title: 'La propriété intellectuelle, actif stratégique des entreprises tech',
      content: `La propriété intellectuelle (PI) constitue souvent l'actif le plus précieux d'une entreprise technologique. Lors d'une cession, la qualité et la protection du portefeuille de PI influencent directement la valorisation et les conditions de la transaction. Selon une étude de l'INPI, les actifs immatériels représentent en moyenne 80 % de la valeur des entreprises technologiques, contre 50 % pour les entreprises traditionnelles.

**Les différentes composantes de la PI dans une entreprise tech**

Le portefeuille de PI d'une entreprise technologique comprend plusieurs catégories d'actifs :

- **Brevets** : inventions techniques brevetables (algorithmes, procédés, systèmes). En France, les brevets sont régis par les articles L. 611-1 et suivants du Code de la propriété intellectuelle (CPI).
- **Logiciels et code source** : protégés par le droit d'auteur (articles L. 112-2 13° et L. 122-6 du CPI). Les logiciels ne sont pas brevetables en tant que tels en Europe (Convention de Munich, article 52), mais des brevets peuvent couvrir les inventions mises en œuvre par ordinateur.
- **Bases de données** : protégées par le droit sui generis du producteur de base de données (articles L. 341-1 et suivants du CPI) et par le droit d'auteur pour leur structure originale.
- **Marques** : signes distinctifs protégés par l'enregistrement (INPI, EUIPO, OMPI).
- **Dessins et modèles** : apparence des produits et interfaces utilisateur.
- **Savoir-faire et secrets d'affaires** : protégés par la loi du 30 juillet 2018 transposant la directive (UE) 2016/943.
- **Noms de domaine** : actifs stratégiques pour la visibilité en ligne.

**Impact de la PI sur la valorisation**

Le portefeuille de PI influence directement la [[valorisation-entreprise-methodes]] de l'entreprise tech :

- Un portefeuille de brevets solide peut représenter 10 à 30 % de la valeur totale
- La propriété confirmée du code source est un prérequis indispensable pour la valorisation d'une [[cession-entreprise-saas]]
- Les marques enregistrées contribuent à la valeur du fonds de commerce ([[valorisation-fonds-commerce]])
- Le savoir-faire documenté et protégé constitue une barrière à l'entrée valorisable

Selon une étude de Ocean Tomo, les entreprises disposant d'un portefeuille de PI solide bénéficient d'une prime de valorisation de 20 à 40 % par rapport aux entreprises comparables sans PI significative.`
    },
    {
      id: 'audit-pi-due-diligence',
      title: 'L\'audit de propriété intellectuelle dans la due diligence',
      content: `La [[due-diligence-acquisition]] d'une entreprise tech doit inclure un volet PI approfondi, souvent confié à des avocats spécialisés en propriété intellectuelle.

**Périmètre de l'audit PI**

L'audit couvre l'ensemble des actifs de PI et vérifie :

**Titularité et chaîne de droits :**
- Vérification que l'entreprise est bien titulaire de tous ses actifs de PI
- Chaîne de cession des droits depuis les créateurs originaux (employés, prestataires, fondateurs)
- Pour les logiciels : vérification des clauses de cession de droits dans les contrats de travail (attention : l'article L. 113-9 du CPI prévoit la dévolution automatique des droits à l'employeur uniquement pour les logiciels créés par des salariés dans l'exercice de leurs fonctions)
- Pour les inventions : vérification du régime applicable (invention de mission, invention hors mission attribuable, article L. 611-7 du CPI)

**Validité et portée de la protection :**
- Brevets : vérification du paiement des annuités, de l'étendue des revendications, des pays de protection
- Marques : vérification de l'enregistrement, du renouvellement, du risque de dégénérescence ou de déchéance pour non-usage
- Logiciels : vérification de l'originalité, de la documentation du processus de création (dépôt auprès de l'APP - Agence pour la Protection des Programmes, ou horodatage blockchain)

**Litiges et risques :**
- Contentieux en cours ou menaçants (contrefaçon, nullité)
- Oppositions à l'enregistrement de brevets ou marques
- Risques d'atteinte à des droits de tiers (freedom-to-operate analysis)
- Clauses de non-concurrence et de non-sollicitation des anciens salariés

**Licences et contrats :**
- Licences de PI concédées (licencieur) : revenus de redevances, exclusivité, territorialité
- Licences de PI reçues (licencié) : dépendance à des technologies tierces, conditions de résiliation
- Contrats de R&D avec des partenaires : titularité des résultats
- Accords de co-développement : répartition des droits de PI

**Open source et composants tiers :**
- Inventaire des composants open source utilisés dans le logiciel
- Vérification de la conformité avec les licences open source (GPL, MIT, Apache, BSD)
- Risque de contamination copyleft (licences GPL imposant la redistribution du code source)
- Dépendances critiques à des API ou services tiers (risque de lock-in)`
    },
    {
      id: 'transfert-pi-cession',
      title: 'Le transfert de la PI lors de la cession',
      content: `Le transfert des droits de PI est un aspect technique et juridique crucial du [[closing-cession-entreprise]] d'une entreprise tech.

**Cession de titres vs cession d'actifs**

Le mode de transfert de la PI dépend de la structure de l'opération :

- **Cession de titres** ([[cession-parts-sociales]] ou [[cession-actions-sas]]) : la PI reste la propriété de la société dont les titres sont cédés. Pas de transfert de PI à proprement parler, mais changement de contrôle de la société titulaire. Attention aux clauses de changement de contrôle dans les licences de PI.
- **Cession d'actifs** (ou [[cession-fonds-commerce-guide]]) : chaque actif de PI doit être individuellement transféré, avec des formalités spécifiques :
  - Brevets : inscription au Registre national des brevets (article L. 613-9 du CPI), opposable aux tiers
  - Marques : inscription au Registre national des marques (article L. 714-7 du CPI)
  - Logiciels : cession des droits patrimoniaux par contrat écrit (article L. 131-3 du CPI, exigeant la mention des droits cédés, l'étendue, la destination, le territoire et la durée)
  - Noms de domaine : transfert auprès du registrar

**Formalités de publicité**

Les transferts de PI doivent faire l'objet de formalités de publicité pour être opposables aux tiers :

- Inscription au registre de l'INPI : brevets (délai de 1 à 2 mois), marques (1 à 3 mois)
- Publication au Bulletin officiel de la propriété industrielle (BOPI)
- Pour les brevets européens : inscription auprès de l'OEB
- Pour les marques de l'UE : inscription auprès de l'EUIPO
- Pour les brevets et marques internationaux : inscription auprès de l'OMPI

**Clauses contractuelles spécifiques**

Le [[protocole-accord-cession]] d'une entreprise tech doit contenir des clauses PI spécifiques :

- Représentations et garanties sur la titularité des droits de PI
- Liste exhaustive des actifs de PI transférés (annexe au contrat)
- Garantie d'absence de contrefaçon et de violation de droits de tiers
- Engagement de non-concurrence du cédant portant spécifiquement sur l'exploitation de la PI cédée
- Clause de coopération pour les formalités de transfert post-closing
- Licence de PI transitoire si certains actifs sont partagés avec d'autres entités du cédant

**Traitement fiscal du transfert de PI**

Le transfert de PI a des implications fiscales spécifiques :

- **Brevets** : les cessions de brevets bénéficient d'un taux réduit d'IS de 10 % (régime de la « boîte à brevets » ou IP Box, article 238 du CGI), sous conditions de substance
- **Logiciels** : les cessions de logiciels originaux bénéficient du même régime IP Box
- **Marques** : imposées au taux normal de l'IS
- **TVA** : les cessions de PI sont soumises à TVA au taux normal (20 %), sauf si intégrées dans une cession de fonds de commerce (exonération, article 257 bis du CGI)

La [[fiscalite-internationale-cession]] de la PI est un enjeu majeur pour les entreprises tech ayant des filiales dans plusieurs pays. Les prix de transfert liés à la PI font l'objet d'une attention particulière de l'administration fiscale (article 57 du CGI et principes OCDE, notamment les recommandations sur les actifs incorporels difficiles à valoriser - HTVI).`
    },
    {
      id: 'risques-pi-transaction',
      title: 'Risques liés à la PI et impact sur la transaction',
      content: `Les risques liés à la PI peuvent avoir un impact significatif sur la valorisation, la structure du prix et les conditions de la [[garantie-actif-passif]].

**Risques majeurs identifiés en due diligence**

Les risques PI les plus fréquemment identifiés lors des due diligences d'entreprises tech :

**Défaut de titularité (risque critique) :**
- Développements réalisés par des freelances sans contrat de cession de droits (35 % des cas selon une étude du CNCPI)
- Code source développé avant la création de la société (par les fondateurs à titre personnel)
- Inventions brevetées au nom des inventeurs et non de la société
- Contributions de stagiaires ou d'alternants sans clause de cession

**Risques de contrefaçon (risque élevé) :**
- Utilisation de composants logiciels protégés sans licence
- Violation de brevets de tiers (risque de patent troll, notamment aux États-Unis)
- Reproduction non autorisée de designs ou d'interfaces

**Risques open source (risque modéré à élevé) :**
- Utilisation de composants sous licence copyleft (GPL v2, GPL v3, AGPL) imposant la redistribution du code source sous la même licence
- Non-respect des obligations de notice et d'attribution des licences permissives (MIT, Apache, BSD)
- Dépendances à des composants dont la licence pourrait évoluer

**Risques de dépréciation (risque modéré) :**
- Brevets proches de l'expiration (durée maximale de 20 ans)
- Marques non exploitées susceptibles de déchéance (5 ans de non-usage, article L. 714-5 du CPI)
- Technologies devenant obsolètes

**Impact sur la transaction**

Ces risques impactent la transaction de plusieurs manières :

- **Ajustement du prix** : décote de 10 à 30 % en cas de défaut de titularité significatif
- **Earn-out** : conditionné à la résolution de certains risques PI
- **Indemnité spécifique** : couverture dans la GAP des risques de contrefaçon identifiés
- **Condition suspensive** : obtention d'une licence ou régularisation d'un défaut de titularité avant le closing
- **Assurance PI** : souscription d'une police d'assurance couvrant les risques de contrefaçon (marché émergent, prime de 1 à 3 % du montant assuré)

La [[data-room-cession]] doit contenir l'intégralité de la documentation PI : registres, certificats d'enregistrement, contrats de licence, contrats de cession de droits, rapport d'audit open source (outil de type Black Duck ou Fossa), et tout contentieux en cours ou passé.`
    },
    {
      id: 'bonnes-pratiques-pi',
      title: 'Bonnes pratiques pour sécuriser la PI avant une cession',
      content: `La [[preparer-cession-entreprise]] tech passe par un programme de sécurisation de la PI à mener idéalement 12 à 24 mois avant la mise en vente.

**Audit préalable et plan de remédiation**

Les actions prioritaires pour sécuriser le portefeuille de PI :

- **Inventaire exhaustif** : cartographier l'ensemble des actifs de PI (brevets, marques, logiciels, savoir-faire, noms de domaine)
- **Vérification de la titularité** : s'assurer que tous les droits ont été correctement transférés à la société par les créateurs
- **Régularisation des défauts** : faire signer des cessions de droits rétroactives aux freelances, anciens salariés et fondateurs
- **Renouvellement** : vérifier et renouveler les marques et brevets arrivant à échéance
- **Dépôt** : déposer les marques, dessins et modèles non encore protégés
- **Documentation** : constituer des preuves de création et d'antériorité (dépôt APP, horodatage, cahiers de laboratoire)

**Sécurisation du code source**

Pour les [[cession-entreprise-saas]] et les entreprises logicielles :

- Audit de qualité du code et documentation technique
- Scan de licences open source (outils automatisés : Black Duck, Snyk, FOSSA)
- Mise en conformité des licences open source
- Séparation du code propriétaire et des composants open source
- Mise en place d'un escrow de code source (dépôt chez un tiers de confiance comme l'APP)

**Protection du savoir-faire**

Le savoir-faire non breveté doit être protégé par des mesures de confidentialité :

- Accords de confidentialité (NDA) avec les employés, prestataires et partenaires
- Politique de classification de l'information (confidentiel, secret, restreint)
- Mesures de sécurité informatique (contrôle d'accès, chiffrement, traçabilité)
- Documentation du savoir-faire (processus, recettes, algorithmes) dans des supports sécurisés
- Clause de non-concurrence dans les contrats de travail des salariés clés

**Stratégie de brevetage**

Un programme de brevetage stratégique peut significativement augmenter la valorisation :

- Identifier les innovations brevetables parmi les développements récents
- Déposer des brevets dans les juridictions clés (France, Europe via l'OEB, États-Unis via l'USPTO)
- Coût moyen d'un brevet européen : 30 000 à 50 000 euros (dépôt + examen + annuités sur 10 ans)
- ROI du brevetage : prime de valorisation de 3 à 5 % de la valeur de l'entreprise par brevet significatif

**Conformité RGPD et données**

Pour les entreprises tech traitant des données personnelles, la conformité [[rgpd-donnees-personnelles-cession]] est un actif à part entière :

- Registre des traitements à jour (article 30 du RGPD)
- Analyses d'impact réalisées (AIPD, article 35 du RGPD)
- Contrats de sous-traitance conformes (article 28 du RGPD)
- DPO désigné si nécessaire
- Politique de confidentialité et gestion des consentements conformes

Un [[avocat-cession-entreprise]] spécialisé en propriété intellectuelle et un [[expert-comptable-cession]] familier du secteur tech sont des partenaires indispensables pour cette phase de préparation.`
    }
  ],
  faq: [
    {
      question: 'Comment s\'assurer que l\'entreprise est bien propriétaire de tout son code source avant une cession ?',
      answer: 'Il faut vérifier trois points : 1) Pour les salariés, l\'article L. 113-9 du CPI prévoit la dévolution automatique des droits sur les logiciels à l\'employeur, mais uniquement pour les logiciels créés dans l\'exercice des fonctions. Pour les autres créations, une clause de cession dans le contrat de travail est nécessaire. 2) Pour les freelances et prestataires, un contrat de cession de droits respectant le formalisme de l\'article L. 131-3 du CPI est indispensable. 3) Pour les fondateurs, le code développé avant la création de la société doit faire l\'objet d\'un apport en nature ou d\'une cession formelle. En cas de défaut, il est possible de régulariser par des cessions rétroactives avant la cession de l\'entreprise.'
    },
    {
      question: 'L\'utilisation d\'open source dans le logiciel peut-elle bloquer une cession ?',
      answer: 'L\'utilisation d\'open source en soi ne bloque pas une cession, mais l\'utilisation de composants sous licence copyleft forte (GPL, AGPL) peut être un red flag pour l\'acquéreur si le code propriétaire est « contaminé » (obligation de redistribution sous la même licence). Un audit open source (outil de type Black Duck ou FOSSA) est indispensable avant la cession pour identifier les composants utilisés, vérifier la conformité avec les licences et le cas échéant remplacer les composants problématiques. Les licences permissives (MIT, Apache, BSD) ne posent généralement pas de problème.'
    },
    {
      question: 'Quel est le régime fiscal de la cession de brevets en France ?',
      answer: 'Les cessions de brevets et d\'actifs de PI assimilés (logiciels protégés par un brevet, procédés de fabrication brevetés) bénéficient du régime de la « boîte à brevets » (IP Box) prévu à l\'article 238 du CGI, avec un taux d\'IS réduit de 10 % au lieu du taux normal de 25 %. Ce régime est conditionné à une exigence de substance : l\'entreprise doit avoir réalisé elle-même les dépenses de R&D ayant conduit à l\'invention brevetée (nexus approach). Pour les marques et les noms de domaine, le taux normal d\'IS s\'applique.'
    }
  ],
  cta: {
    text: 'Estimez la valeur de votre portefeuille de propriété intellectuelle',
    tool: 'Valuations'
  }
};
