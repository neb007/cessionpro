export default {
  chapters: [
    {
      id: 'rgpd-cadre-general-cession',
      title: 'Le RGPD dans le contexte d\'une cession d\'entreprise',
      content: `Le Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) constitue un enjeu juridique et opérationnel majeur lors d'une cession d'entreprise. La conformité RGPD impacte la valorisation, la due diligence, la structuration de l'opération et le transfert des données post-closing.

**Champ d'application et rappel des principes**

Le RGPD s'applique à tout traitement de données personnelles effectué par un responsable de traitement ou un sous-traitant établi dans l'UE, ou ciblant des personnes situées dans l'UE. Lors d'une cession, les données personnelles concernées sont multiples :

- **Données clients** : nom, email, adresse, historique d'achat, préférences, données de paiement
- **Données salariés** : fichier du personnel, bulletins de paie, évaluations, données médicales
- **Données fournisseurs et partenaires** : contacts commerciaux, conditions contractuelles
- **Données prospects** : fichiers marketing, leads, données de navigation
- **Données utilisateurs** (entreprises tech/SaaS) : données d'utilisation, logs, contenus générés

**Impact de la conformité RGPD sur la valorisation**

La conformité RGPD est devenue un facteur de valorisation à part entière. Selon une étude du cabinet Deloitte :

- Les entreprises conformes au RGPD bénéficient d'une prime de valorisation de 5 à 10 %
- Les entreprises présentant des non-conformités significatives subissent une décote de 10 à 20 %
- Les sanctions RGPD encourues (jusqu'à 20 millions d'euros ou 4 % du CA mondial, article 83 du RGPD) constituent un passif potentiel impactant la [[garantie-actif-passif]]

Pour les [[cession-entreprise-saas]] et les [[cession-ecommerce]], la conformité RGPD est un prérequis quasi-systématique de la due diligence.

**Les données personnelles comme actif de l'entreprise**

Les bases de données contenant des données personnelles sont un actif stratégique, particulièrement pour les entreprises tech et digitales :

- Base clients e-commerce : valeur estimée à 1 à 5 euros par contact qualifié et conforme RGPD
- Base email marketing opt-in : valeur de 0,5 à 3 euros par contact avec consentement valide
- Données d'usage SaaS : valeur dérivée de l'intelligence produit et de la personnalisation

La [[valorisation-entreprise-methodes]] doit intégrer la valeur de ces actifs de données, sous réserve de leur conformité RGPD. Des données collectées en violation du RGPD n'ont juridiquement aucune valeur transférable.`
    },
    {
      id: 'due-diligence-rgpd',
      title: 'La due diligence RGPD : volet indispensable de l\'audit',
      content: `La [[due-diligence-acquisition]] doit systématiquement inclure un volet RGPD, dont l'importance varie selon le secteur d'activité et le volume de données traitées.

**Périmètre de la due diligence RGPD**

L'audit RGPD dans le cadre d'une cession couvre les points suivants :

**Gouvernance et organisation :**
- Existence d'un DPO (Délégué à la Protection des Données) désigné conformément aux articles 37 à 39 du RGPD
- Politique de protection des données formalisée et diffusée
- Programme de sensibilisation et de formation des collaborateurs
- Budget dédié à la conformité RGPD

**Documentation de conformité :**
- Registre des activités de traitement (article 30 du RGPD) : exhaustivité, mise à jour, cohérence
- Analyses d'impact relatives à la protection des données (AIPD, article 35) pour les traitements à risque
- Contrats de sous-traitance conformes à l'article 28 du RGPD
- Documentation des bases légales de chaque traitement (article 6)

**Droits des personnes :**
- Procédure de traitement des demandes d'exercice des droits (accès, rectification, effacement, portabilité, opposition)
- Politique de confidentialité conforme aux articles 13 et 14 du RGPD
- Gestion des consentements (opt-in marketing, cookies)
- Délai de réponse effectif aux demandes (30 jours, article 12)

**Sécurité des données :**
- Mesures techniques et organisationnelles de sécurité (article 32 du RGPD)
- Politique de gestion des incidents et violations de données (articles 33 et 34)
- Historique des violations notifiées à la CNIL
- Audits de sécurité et tests d'intrusion récents

**Transferts internationaux :**
- Identification des transferts de données hors UE/EEE
- Base juridique des transferts : clauses contractuelles types (CCT), décision d'adéquation, BCR
- Impact de la jurisprudence Schrems II (CJUE, 16 juillet 2020) sur les transferts vers les États-Unis
- Cadre de transfert UE-US (Data Privacy Framework adopté en 2023)

**Red flags RGPD**

Les red flags les plus fréquents lors de la due diligence RGPD :

- Absence de registre des traitements (non-conformité de base)
- Consentements marketing non conformes (pas d'opt-in explicite pour le B2C, cf. article L. 34-5 du CPCE)
- Transferts de données vers des pays tiers sans base juridique valide
- Violations de données non notifiées à la CNIL
- Durées de conservation non définies ou non respectées
- Sous-traitants non conformes (hébergeurs, outils SaaS) sans contrat article 28`
    },
    {
      id: 'transfert-donnees-cession',
      title: 'Le transfert des données personnelles lors de la cession',
      content: `Le transfert des données personnelles entre le cédant et l'acquéreur soulève des questions juridiques spécifiques qui doivent être anticipées et traitées dans la documentation contractuelle.

**Phase pré-cession : accès aux données pendant la due diligence**

L'accès aux données personnelles de la cible par l'acquéreur potentiel pendant la phase de due diligence est encadré :

- Principe de minimisation (article 5.1.c du RGPD) : l'acquéreur ne doit accéder qu'aux données strictement nécessaires
- Anonymisation ou pseudonymisation des données sensibles dans la [[data-room-cession]]
- [[nda-cession-entreprise]] incluant des clauses spécifiques de protection des données
- Base légale : intérêt légitime du responsable de traitement (article 6.1.f du RGPD) pour la conduite de négociations commerciales

Les données suivantes ne doivent jamais être communiquées en data room sans anonymisation :

- Données de santé des salariés
- Données bancaires des clients (sauf agrégées)
- Numéros de sécurité sociale
- Données judiciaires

**Phase de closing : transfert des bases de données**

Le transfert des données personnelles au moment du closing dépend du type d'opération :

**Cession de titres** ([[cession-parts-sociales]] ou [[cession-actions-sas]]) :
- Le responsable de traitement ne change pas (la société conserve sa personnalité morale)
- Pas de notification obligatoire aux personnes concernées
- Mise à jour des politiques de confidentialité si le nouveau propriétaire modifie les finalités de traitement

**Cession de fonds de commerce ou d'actifs** ([[cession-fonds-commerce-guide]]) :
- Changement de responsable de traitement
- Information des personnes concernées dans un délai raisonnable (article 14 du RGPD)
- Transfert des données sur la base de l'intérêt légitime ou de l'exécution contractuelle
- Nouvelle politique de confidentialité à mettre en place par l'acquéreur
- Respect du droit d'opposition des personnes concernées

**Cas spécifiques**

Pour les entreprises tech et e-commerce :

- **Données utilisateurs SaaS** : le changement de contrôle doit être couvert par les CGU/CGS, avec notification aux clients (souvent exigée par les contrats B2B)
- **Base email marketing** : les consentements opt-in sont transférés avec la base, mais l'acquéreur doit informer les contacts du changement de responsable de traitement
- **Données de navigation et cookies** : les consentements cookies ne sont généralement pas transférables ; l'acquéreur doit recueillir de nouveaux consentements
- **Applications mobiles** ([[valorisation-application-mobile]]) : mise à jour de la politique de confidentialité dans les stores (App Store, Google Play)`
    },
    {
      id: 'clauses-contractuelles-rgpd',
      title: 'Clauses contractuelles RGPD dans la documentation de cession',
      content: `La documentation de cession doit intégrer des clauses spécifiques au RGPD pour sécuriser les parties et répartir les responsabilités.

**Représentations et garanties RGPD dans le SPA**

Le [[protocole-accord-cession]] ou le SPA doit contenir des déclarations et garanties du vendeur portant sur :

- La conformité globale des traitements de données avec le RGPD et la loi Informatique et Libertés modifiée
- L'existence et la mise à jour du registre des traitements
- La désignation d'un DPO (si obligatoire)
- L'absence de violations de données non notifiées
- L'absence de plaintes auprès de la CNIL ou de sanctions en cours
- La conformité des contrats de sous-traitance (article 28 du RGPD)
- La validité des bases légales de traitement (consentements, intérêt légitime, exécution contractuelle)
- La conformité des transferts internationaux de données
- L'existence et le respect d'une politique de durée de conservation

**Indemnisation spécifique RGPD**

La [[garantie-actif-passif]] doit prévoir une indemnisation spécifique couvrant :

- Les sanctions prononcées par la CNIL pour des manquements antérieurs au closing (amendes pouvant atteindre 20 millions d'euros ou 4 % du CA mondial)
- Les dommages et intérêts résultant de violations de données antérieures
- Les coûts de mise en conformité nécessaires pour remédier à des non-conformités héritées
- Les conséquences financières de l'exercice massif de droits d'accès ou d'effacement par les personnes concernées

Le plafond d'indemnisation RGPD est souvent distinct du plafond général de la GAP, en raison du niveau élevé des sanctions potentielles.

**Clauses de coopération post-closing**

Les parties doivent prévoir des obligations de coopération :

- Coopération en cas de contrôle de la CNIL portant sur la période pré-closing
- Assistance pour le traitement des demandes d'exercice de droits portant sur des données de la période pré-closing
- Notification mutuelle en cas de découverte post-closing d'une violation de données antérieure
- Procédure de suppression des données conservées par le cédant post-closing

**Conditions suspensives RGPD**

Dans certains cas, des conditions suspensives liées au RGPD peuvent être nécessaires :

- Obtention d'un avis favorable du DPO sur la licéité du transfert
- Notification préalable à la CNIL d'un traitement soumis à AIPD
- Mise en conformité d'un traitement critique identifié comme non conforme lors de la due diligence
- Obtention du consentement des clients pour le transfert de données vers un responsable de traitement étranger`
    },
    {
      id: 'bonnes-pratiques-rgpd-cession',
      title: 'Bonnes pratiques pour sécuriser la conformité RGPD lors d\'une cession',
      content: `La [[preparer-cession-entreprise]] doit inclure un programme de mise en conformité RGPD, idéalement lancé 12 à 18 mois avant la mise en vente.

**Plan de mise en conformité pré-cession**

Les actions prioritaires pour sécuriser la conformité RGPD :

- **Constituer ou mettre à jour le registre des traitements** : document central de la conformité, il recense tous les traitements de données personnelles avec leurs caractéristiques (finalités, bases légales, catégories de données, durées de conservation, sous-traitants)
- **Auditer les consentements marketing** : vérifier la conformité des opt-in email et SMS avec les exigences de la CNIL (consentement libre, spécifique, éclairé et univoque pour le B2C)
- **Mettre à jour les contrats de sous-traitance** : s'assurer que tous les sous-traitants (hébergeur, CRM, outil d'emailing, outil analytics) ont signé un contrat conforme à l'article 28 du RGPD
- **Documenter les bases légales** : pour chaque traitement, identifier et documenter la base légale applicable (consentement, exécution contractuelle, intérêt légitime, obligation légale)
- **Définir les durées de conservation** : politique de purge automatique des données au-delà de la durée nécessaire

**Sécurisation technique**

Les mesures techniques à mettre en place ou à documenter :

- Chiffrement des données sensibles au repos et en transit
- Politique d'accès basée sur le principe du moindre privilège
- Pseudonymisation des données dans les environnements de développement et de test
- Plan de continuité et de reprise d'activité (PCA/PRA) intégrant la protection des données
- Procédure de gestion des violations de données (détection, évaluation, notification à la CNIL sous 72 heures)

**Transferts internationaux**

Pour les entreprises ayant des activités internationales ([[acquisition-cross-border-guide]], [[cession-filiale-etrangere]]) :

- Cartographier tous les transferts de données hors UE/EEE
- Mettre en place les garanties appropriées : clauses contractuelles types (CCT adoptées par la Commission européenne le 4 juin 2021), décisions d'adéquation, BCR
- Réaliser un Transfer Impact Assessment (TIA) pour évaluer le niveau de protection du pays destinataire
- Anticiper les implications du Data Privacy Framework UE-US pour les transferts vers les États-Unis

**Anticipation de l'intégration post-acquisition**

L'acquéreur doit planifier l'intégration RGPD dès la phase de [[due-diligence-cross-border]] :

- Harmonisation des politiques de protection des données entre la cible et l'acquéreur
- Migration des données vers les systèmes de l'acquéreur dans le respect du RGPD
- Nomination ou transfert du DPO
- Formation des équipes de la cible aux politiques RGPD de l'acquéreur
- Mise à jour des mentions légales, politiques de confidentialité et formulaires de consentement

Les [[premiers-100-jours-repreneur]] doivent inclure un plan d'intégration RGPD pour sécuriser les données transférées et éviter les risques de non-conformité post-acquisition.`
    }
  ],
  faq: [
    {
      question: 'Faut-il informer les clients du transfert de leurs données lors d\'une cession d\'entreprise ?',
      answer: 'Cela dépend du type d\'opération. Lors d\'une cession de titres (actions ou parts sociales), le responsable de traitement ne change pas (la société conserve sa personnalité morale), et l\'information n\'est pas obligatoire sauf si les finalités de traitement sont modifiées. Lors d\'une cession de fonds de commerce ou d\'actifs, le responsable de traitement change et l\'acquéreur doit informer les personnes concernées conformément à l\'article 14 du RGPD, dans un délai raisonnable (maximum 1 mois). Cette information peut être faite par email ou notification sur le site.'
    },
    {
      question: 'Quels sont les risques RGPD majeurs lors d\'une acquisition ?',
      answer: 'Les principaux risques sont : 1) Des sanctions CNIL pour des manquements antérieurs au closing (amendes jusqu\'à 20 millions d\'euros ou 4 % du CA) ; 2) Des bases de données clients constituées sans consentement valide (rendant les données inexploitables) ; 3) Des violations de données non détectées ou non notifiées ; 4) Des transferts internationaux de données sans base juridique ; 5) Des contrats de sous-traitance non conformes. Ces risques doivent être identifiés pendant la due diligence et couverts par des indemnités spécifiques dans la garantie d\'actif et de passif.'
    },
    {
      question: 'La conformité RGPD influence-t-elle la valorisation d\'une entreprise ?',
      answer: 'Oui, significativement. Les entreprises conformes au RGPD bénéficient d\'une prime de valorisation de 5 à 10 %, car la conformité témoigne de la qualité de la gouvernance et réduit les risques post-acquisition. À l\'inverse, des non-conformités significatives peuvent entraîner une décote de 10 à 20 % et des indemnités spécifiques dans la GAP. Pour les entreprises tech et e-commerce dont les données constituent un actif central, la conformité RGPD est un prérequis pour la valorisation de la base de données clients et utilisateurs.'
    }
  ],
  cta: {
    text: 'Évaluez votre entreprise en intégrant la valeur de vos actifs de données',
    tool: 'Valuations'
  }
};
