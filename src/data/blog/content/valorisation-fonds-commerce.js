export default {
  chapters: [
    {
      id: 'elements-du-fonds',
      title: 'Les éléments constitutifs du fonds de commerce',
      content: `Le **fonds de commerce** est un ensemble d'éléments corporels et incorporels qui permettent l'exercice d'une activité commerciale. Contrairement à la cession de titres (parts sociales ou actions), la cession de fonds de commerce porte uniquement sur l'**outil d'exploitation**, pas sur la société elle-même.

### Les éléments incorporels

Ce sont généralement les éléments les plus valorisés :

- **La clientèle et l'achalandage** : c'est le cœur du fonds. L'achalandage désigne la clientèle liée à l'emplacement, tandis que la clientèle personnelle résulte du savoir-faire du commerçant
- **Le droit au bail** : dans les emplacements commerciaux prisés, le droit au bail peut représenter une part considérable de la valeur
- **L'enseigne et le nom commercial** : la notoriété attachée à la marque locale
- **Les licences et autorisations** : licence IV pour les débits de boissons, autorisations administratives spécifiques
- **Les contrats** : contrats fournisseurs, contrats de franchise, portefeuille d'abonnements
- **La propriété intellectuelle** : brevets, marques déposées, logiciels propriétaires

### Les éléments corporels

- **Le matériel et l'outillage** : équipements de production, machines
- **Le mobilier commercial** : agencements, vitrines, comptoirs
- **Le stock de marchandises** : évalué séparément au jour de la cession

### Ce qui n'est PAS dans le fonds

- L'immobilier (les murs)
- Les créances clients
- Les dettes fournisseurs
- La trésorerie
- Les contrats de travail (sauf obligation de reprise)

La distinction entre cession de fonds et cession de titres a des implications juridiques et fiscales majeures. Pour en savoir plus, consultez [[cession-parts-sociales]].`
    },
    {
      id: 'bareme-fiscal-secteur',
      title: 'Les barèmes fiscaux par secteur d\'activité',
      content: `L'administration fiscale publie des **barèmes indicatifs** exprimés en pourcentage du chiffre d'affaires TTC, qui servent de référence pour l'évaluation des fonds de commerce. Ces barèmes sont issus de l'observation des transactions réelles.

### Barèmes par secteur (en % du CA TTC annuel)

- **Boulangerie-pâtisserie** : 60% à 110% du CA — très prisé, avec une prime pour les emplacements en centre-ville
- **Restaurant traditionnel** : 40% à 100% du CA — forte variabilité selon l'emplacement et le concept
- **Bar / Brasserie** : 50% à 120% du CA — la licence IV ajoute une valeur significative
- **Pharmacie** : 80% à 120% du CA — secteur réglementé avec des marges stables
- **Coiffure / Esthétique** : 50% à 100% du CA — dépend fortement de la fidélité de la clientèle
- **Commerce alimentaire de proximité** : 30% à 60% du CA — marges faibles mais clientèle captive
- **Pressing / Laverie** : 40% à 80% du CA — récurrence élevée du revenu
- **Agence immobilière** : 50% à 100% des honoraires — très lié au portefeuille de mandats
- **Fleuriste** : 40% à 80% du CA — saisonnalité à prendre en compte
- **Tabac / Presse** : spécifique, basé sur la remise nette annuelle (multiple de 3 à 6)

### Comment utiliser ces barèmes

Ces barèmes constituent un **point de départ**, jamais une valeur définitive. Ils doivent être ajustés en fonction de :

- La **tendance du CA** : hausse ou baisse sur les 3 dernières années
- La **rentabilité réelle** : un commerce à fort CA mais faible marge vaut moins
- L'**emplacement** : un emplacement n°1 justifie le haut de la fourchette
- L'**état des locaux** : des travaux à prévoir réduisent la valeur
- La **durée restante du bail** : un bail proche du renouvellement est moins sécurisant

Ces barèmes sont particulièrement utiles pour les [[due-diligence-acquisition]] et constituent souvent la base de discussion entre vendeur et acheteur.`
    },
    {
      id: 'methode-pourcentage-ca',
      title: 'La méthode du pourcentage du chiffre d\'affaires',
      content: `La méthode du **pourcentage du CA** est la plus simple et la plus courante pour évaluer un fonds de commerce. Elle repose sur l'application des barèmes sectoriels au chiffre d'affaires moyen de l'entreprise.

### Mise en œuvre pratique

**Étape 1** : Calculer le CA moyen sur les **3 derniers exercices** (ou la moyenne pondérée avec un poids plus fort sur les années récentes)

**Étape 2** : Appliquer le pourcentage sectoriel correspondant pour obtenir une fourchette

**Étape 3** : Ajuster en fonction des facteurs spécifiques de l'affaire

### Exemple concret

Un **restaurant traditionnel** à Lyon réalisant :
- CA N-2 : 380 000 €
- CA N-1 : 420 000 €
- CA N : 450 000 €

CA moyen pondéré = (380 × 20%) + (420 × 30%) + (450 × 50%) = **427 000 €**

Barème restaurant : 40% à 100% du CA

Fourchette brute : **170 800 € à 427 000 €**

### Ajustements selon les caractéristiques

**Facteurs de plus-value** (positionnement haut de fourchette) :
- Emplacement premium en centre-ville
- Bail commercial avec conditions favorables (loyer modéré, longue durée)
- Terrasse exploitable
- Licence IV
- CA en croissance régulière

**Facteurs de moins-value** (positionnement bas de fourchette) :
- Travaux de mise aux normes nécessaires
- Bail à renouveler prochainement
- CA en déclin
- Dépendance forte au dirigeant actuel
- Équipement vétuste nécessitant un renouvellement

Dans notre exemple, si le restaurant est bien placé avec une terrasse et un bail favorable, on pourrait retenir **70-80% du CA**, soit une valorisation de **299 000 à 342 000 €**.`
    },
    {
      id: 'methode-rentabilite',
      title: 'La méthode de la rentabilité',
      content: `La méthode de la **rentabilité** (ou méthode du rendement) est plus fine que le simple pourcentage du CA car elle tient compte de la **profitabilité réelle** du fonds de commerce. Deux affaires avec le même chiffre d'affaires mais des marges différentes n'ont pas la même valeur.

### Principe

**Valeur du fonds = Résultat retraité / Taux de capitalisation**

Le résultat retraité est le **bénéfice net normatif** dégagé par l'exploitation du fonds, après correction des anomalies comptables. Le taux de capitalisation reflète le rendement attendu par l'acquéreur.

### Calcul du résultat retraité

À partir du résultat comptable, on procède aux retraitements suivants :

- **Rémunération normative du dirigeant** : remplacer la rémunération réelle par un salaire de marché pour la fonction exercée
- **Loyer normatif** : si le commerçant est propriétaire des murs, imputer un loyer de marché
- **Charges exceptionnelles** : exclure les charges non récurrentes
- **Avantages en nature** : réintégrer les charges personnelles passées en charges d'exploitation

### Détermination du taux de capitalisation

Pour les commerces, le taux de capitalisation se situe généralement entre **15% et 30%** :

- **15-20%** : commerces à faible risque (pharmacie, tabac, activités réglementées)
- **20-25%** : commerces classiques (boulangerie, coiffure, restauration bien établie)
- **25-30%** : commerces à risque plus élevé (mode, restauration récente, activités saisonnières)

### Exemple

Un salon de coiffure dégageant un résultat retraité de **60 000 €** par an, avec un taux de capitalisation de **22%** :

Valeur = 60 000 / 0,22 = **272 727 €**

Cette méthode est à croiser avec le pourcentage du CA pour obtenir une fourchette fiable. Pour les détails des retraitements, consultez [[retraitements-valorisation]].`
    },
    {
      id: 'facteurs-plus-moins-value',
      title: 'Facteurs de plus-value et de moins-value',
      content: `Au-delà des méthodes de calcul, de nombreux facteurs qualitatifs influencent la valeur d'un fonds de commerce. Leur prise en compte permet d'affiner la valorisation et de la rendre plus réaliste.

### Facteurs de plus-value

**L'emplacement** est le facteur n°1. Un emplacement en zone de fort passage, en centre commercial performant ou dans un quartier en développement commande une prime significative. L'adage « emplacement, emplacement, emplacement » est particulièrement vrai pour les commerces.

**Le bail commercial** peut constituer un actif majeur :
- Loyer inférieur au marché → le droit au bail a une valeur propre
- Bail récemment renouvelé → sécurité pour l'acquéreur
- Clause favorable (droit de sous-location, activités complémentaires autorisées)

**La clientèle fidélisée** :
- Base de données clients structurée
- Programme de fidélité actif
- Taux de récurrence élevé

**Les licences et autorisations** : une licence IV, une autorisation de terrasse permanente, un agrément sanitaire constituent des actifs rares et valorisables.

### Facteurs de moins-value

- **Travaux obligatoires** : mise aux normes accessibilité, hygiène, sécurité incendie — ces coûts doivent être chiffrés et déduits
- **Environnement concurrentiel** : arrivée d'un concurrent direct, développement du e-commerce
- **Contraintes réglementaires** : évolutions législatives impactant l'activité
- **État du matériel** : équipements en fin de vie nécessitant un remplacement immédiat
- **Réputation dégradée** : avis négatifs en ligne, antécédents de fermeture administrative

### L'impact quantifié

Ces facteurs peuvent modifier la valorisation de **-30% à +30%** par rapport au calcul de base. L'analyse de ces éléments fait partie intégrante de la [[due-diligence-acquisition]] que tout acquéreur devrait réaliser avant de s'engager.`
    },
    {
      id: 'erreurs-courantes',
      title: 'Les erreurs courantes en valorisation de fonds de commerce',
      content: `La valorisation d'un fonds de commerce est un exercice où les erreurs sont fréquentes, tant du côté du vendeur que de l'acheteur. Voici les pièges les plus courants et comment les éviter.

### Erreur n°1 : Confondre prix d'achat et valeur actuelle

Un commerçant qui a acheté son fonds 200 000 € il y a 10 ans et investi 100 000 € en travaux ne peut pas prétendre que son fonds vaut 300 000 €. La valeur dépend du **potentiel économique actuel**, pas du coût historique. Si le CA a baissé de 30%, la valeur a probablement baissé également.

### Erreur n°2 : Surévaluer le potentiel

« Avec un bon repreneur, cette affaire pourrait doubler son CA ». Cette phrase est entendue dans 80% des cessions. Mais le **potentiel non réalisé** ne se paie pas. L'acquéreur ne doit pas financer deux fois le même bénéfice : une fois dans le prix d'achat, et une fois par son travail pour le réaliser.

### Erreur n°3 : Ignorer la saisonnalité

Pour les commerces saisonniers (stations balnéaires, stations de ski), le CA annuel doit être rapporté au **nombre effectif de mois d'exploitation**. Un barème conçu pour un commerce ouvert 12 mois ne s'applique pas tel quel à un commerce ouvert 6 mois.

### Erreur n°4 : Oublier le stock dans la négociation

Le stock est évalué **séparément** du fonds de commerce, au prix coûtant après déduction des invendus et des produits périmés. Il s'ajoute au prix du fonds. Un vendeur qui intègre le stock dans le prix du fonds sans le mentionner crée de la confusion.

### Erreur n°5 : Ne pas anticiper la fiscalité

La cession de fonds de commerce génère des **droits d'enregistrement** à la charge de l'acheteur (3% entre 23 000 et 200 000 €, puis 5% au-delà) et une **imposition des plus-values** pour le vendeur. Ces éléments doivent être intégrés dans la réflexion dès le début.

### Notre conseil

Faites évaluer votre fonds de commerce par au moins **deux professionnels indépendants** (expert-comptable, agent immobilier commercial, cabinet de cession) et comparez les résultats. La fourchette obtenue sera votre base de négociation. Pour approfondir les aspects juridiques, consultez [[nda-cession-entreprise]] pour protéger vos informations lors du processus.`
    }
  ],
  faq: [
    {
      question: 'Quelle est la différence entre la cession de fonds de commerce et la cession de titres ?',
      answer: 'La cession de fonds de commerce porte uniquement sur l\'outil d\'exploitation (clientèle, droit au bail, matériel, enseigne). L\'acquéreur n\'achète pas la société mais ses actifs commerciaux. La cession de titres (parts ou actions) transfère la propriété de la société elle-même, avec tous ses actifs mais aussi ses dettes et son passif. La fiscalité diffère également : droits d\'enregistrement de 3-5% pour le fonds vs 0,1% (actions) ou 3% plafonné (parts sociales).'
    },
    {
      question: 'Le droit au bail est-il inclus dans la valorisation du fonds de commerce ?',
      answer: 'Oui, le droit au bail fait partie intégrante du fonds de commerce et sa valeur est incluse dans la valorisation globale. Cependant, dans les emplacements très prisés, le droit au bail peut avoir une valeur propre significative (parfois supérieure au reste du fonds). Il est alors courant de le valoriser séparément en comparant le loyer actuel au loyer de marché et en capitalisant la différence sur la durée restante du bail.'
    },
    {
      question: 'Les barèmes fiscaux sont-ils obligatoires pour fixer le prix ?',
      answer: 'Non, les barèmes fiscaux sont purement indicatifs et n\'ont aucune valeur contraignante. Le prix d\'un fonds de commerce est librement fixé entre les parties. Cependant, un prix très éloigné des barèmes (à la hausse ou à la baisse) peut attirer l\'attention de l\'administration fiscale qui pourrait considérer qu\'il y a une donation déguisée ou un acte anormal de gestion. Il est donc prudent de pouvoir justifier l\'écart par des éléments objectifs.'
    }
  ],
  cta: {
    tool: 'Valuations',
    text: 'Estimez la valeur de votre fonds de commerce'
  }
};
