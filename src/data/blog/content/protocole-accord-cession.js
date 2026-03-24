export default {
  chapters: [
    {
      id: 'definition-spa',
      title: 'Définition du SPA (Share Purchase Agreement)',
      content: `Le protocole d'accord de cession, communément appelé SPA (Share Purchase Agreement) dans le jargon M&A, est le contrat définitif qui formalise l'ensemble des conditions de la vente d'une entreprise. C'est le document juridique le plus important de toute la transaction.

**Qu'est-ce que le SPA ?**

Le SPA est le contrat de vente par lequel le vendeur (cédant) transfère la propriété des titres de sa société à l'acquéreur (cessionnaire), en contrepartie du paiement d'un prix. Il se distingue de la lettre d'intention (LOI) qui n'est qu'un accord de principe.

En droit français, le SPA est soumis au droit commun de la vente (articles 1582 et suivants du Code civil) et aux règles spécifiques applicables aux cessions de droits sociaux (articles L. 228-23 et suivants du Code de commerce pour les actions, articles L. 223-14 et suivants pour les parts de SARL).

**SPA vs acte de cession simple**

Pour les petites transactions (fonds de commerce, entreprises individuelles), un acte de cession simplifié peut suffire. Mais pour les cessions de titres de sociétés, le SPA est la norme car il offre :

- Une protection complète des deux parties
- Un cadre juridique détaillé pour chaque aspect de la transaction
- Des mécanismes de résolution des litiges post-closing
- Une articulation avec la garantie d'actif-passif

**Les parties au SPA**

- **Le vendeur** : le ou les actionnaires cédants. Si plusieurs vendeurs, ils peuvent agir solidairement ou individuellement.
- **L'acquéreur** : souvent une holding d'acquisition créée spécifiquement (NewCo) dans le cadre d'un LBO.
- **La société cible** : elle n'est pas partie au contrat mais ses caractéristiques sont largement décrites.
- **Les garants** : le cas échéant, les personnes qui se portent garantes des obligations du vendeur (caution, garantie à première demande).

**Le calendrier de rédaction**

La rédaction du SPA commence généralement en parallèle de la due diligence, une fois la LOI signée :

- Semaines 1-2 : premier draft rédigé par l'avocat de l'acquéreur (pratique anglo-saxonne) ou du vendeur
- Semaines 3-6 : allers-retours entre les avocats, négociation des clauses
- Semaines 6-8 : finalisation et signature (sous conditions suspensives le cas échéant)
- Semaines 8-12 : levée des conditions suspensives et closing

Pour comprendre comment la LOI prépare le SPA, consultez [[lettre-intention-acquisition]].`
    },
    {
      id: 'structure-type',
      title: 'Structure type d\'un protocole d\'accord de cession',
      content: `Un SPA pour une cession de PME fait typiquement entre 30 et 80 pages (hors annexes). Voici la structure standard et le contenu de chaque section.

**Article 1 — Définitions**

Le SPA commence par un glossaire des termes utilisés. C'est une section cruciale car la définition de chaque terme impacte l'interprétation du contrat.

Définitions clés à soigner :
- **Date de Référence** : date à laquelle la situation financière est arrêtée pour le calcul du prix
- **Dette Financière Nette** : ensemble des dettes financières diminué de la trésorerie. La définition précise de ce qui est inclus ou exclu fait l'objet de négociations serrées.
- **EBE Normatif / EBITDA** : définition des retraitements convenus
- **BFR Normatif** : niveau de BFR de référence pour l'ajustement de prix
- **Changement Significatif Défavorable (MAC)** : événement justifiant le retrait de l'acquéreur
- **Connaissance du Vendeur** : distinction entre connaissance effective et connaissance présumée (ce que le vendeur aurait dû savoir avec une diligence raisonnable)

**Article 2 — Objet de la cession**

- Description des titres cédés (nombre, nature, pourcentage du capital)
- Déclaration de pleine propriété et de libre disposition des titres
- Absence de nantissement, gage ou droit de préemption (sauf ceux visés)
- Engagement de transférer les titres libres de tout droit

**Article 3 — Prix de cession**

Détaillé dans le chapitre suivant.

**Article 4 — Conditions suspensives**

Détaillé dans le chapitre dédié.

**Article 5 — Période intermédiaire (entre signing et closing)**

Obligations du vendeur pendant la période entre la signature et le closing :
- Gestion de l'entreprise dans le cours normal des affaires (ordinary course of business)
- Liste des décisions nécessitant l'accord préalable de l'acquéreur (investissements > X €, embauches, résiliation de contrats majeurs)
- Obligation d'information de l'acquéreur sur tout événement significatif
- Interdiction de distribution de dividendes ou de remboursement de comptes courants

**Article 6 — Déclarations et garanties (Representations & Warranties)**

Le vendeur fait un ensemble de déclarations sur la situation de l'entreprise. Ces déclarations constituent la base de la garantie d'actif-passif. Elles couvrent :

- La situation juridique de la société (statuts, organes sociaux, titres)
- La situation financière (exactitude des comptes, absence de passif non déclaré)
- La situation fiscale (régularité des déclarations, absence de redressement)
- La situation sociale (respect du droit du travail, contentieux)
- Les contrats (existence, validité, absence de résiliation)
- La propriété intellectuelle (titularité, absence de contrefaçon)
- La conformité réglementaire (autorisations, normes environnementales)
- L'absence de litiges non déclarés

**Article 7 — Garantie d'actif et de passif**

Développé dans un chapitre dédié et souvent annexé au SPA.

**Article 8 — Engagements post-closing**

- Clause de non-concurrence du vendeur
- Clause d'accompagnement post-cession
- Clause de non-sollicitation du personnel
- Clause de non-dénigrement

**Article 9 — Modalités du closing**

- Date et lieu du closing
- Documents à remettre
- Mécanisme de paiement
- Formalités à accomplir

**Article 10 — Dispositions diverses**

- Notifications entre les parties
- Frais et droits d'enregistrement
- Cession du contrat
- Intégralité de l'accord (entire agreement)
- Droit applicable et juridiction`
    },
    {
      id: 'conditions-suspensives',
      title: 'Les conditions suspensives : mécanisme et négociation',
      content: `Les conditions suspensives sont les événements qui doivent se réaliser pour que la cession devienne définitive. Tant qu'elles ne sont pas levées, le contrat est valide mais ses effets sont suspendus.

**Le cadre juridique**

En droit français, les conditions suspensives sont régies par les articles 1304 et suivants du Code civil. La condition suspensive doit être :
- Licite et possible
- Non potestative (ne doit pas dépendre de la seule volonté d'une partie)
- Définie avec précision dans le contrat

**Les conditions suspensives courantes**

### 1. Financement bancaire
C'est la condition la plus fréquente, notamment lorsque l'acquéreur est un repreneur individuel ou une holding d'acquisition (LBO).

Rédaction précise :
- Montant du financement recherché (ex. : « obtention d'un crédit d'acquisition d'un montant minimum de 1 500 000 euros »)
- Conditions acceptables (taux, durée, garanties)
- Délai pour l'obtention (ex. : « au plus tard le [date] »)
- Obligation de moyens de l'acquéreur (démarcher au minimum 3 établissements bancaires)
- Preuves à fournir (lettre d'engagement bancaire)

### 2. Due diligence satisfaisante
Condition délicate car subjective. Pour la rendre objectivable :
- Lister les sujets couverts par la due diligence
- Définir les critères de satisfaction (absence de passif caché > X €, confirmation de l'EBITDA dans une fourchette de +/- Y %)
- Prévoir un droit de renégociation plutôt qu'un droit de retrait pur et simple
- Fixer un délai impératif

### 3. Agrément des associés
Si les statuts de la société cible prévoient une clause d'agrément :
- L'AG doit être convoquée et statuer sur l'agrément du cessionnaire
- Délai légal : 3 mois à compter de la notification pour les SARL, délai statutaire pour les SAS
- En cas de refus d'agrément : obligation de rachat par les associés ou la société (SARL)

### 4. Information des salariés (loi Hamon)
La loi du 31 juillet 2014 impose d'informer les salariés de toute cession de participation majoritaire dans les entreprises de moins de 250 salariés :
- Délai : au moins 2 mois avant la cession
- Sanction : nullité de la cession (attention : la sanction a été atténuée par la loi Macron de 2015 qui prévoit une amende civile)
- Modalités : information individuelle de chaque salarié

### 5. Absence de changement significatif (MAC)
- Définition des événements constitutifs d'un MAC
- Seuils chiffrés (perte de CA > 20 %, perte d'un client représentant > 15 % du CA)
- Exclusions habituelles (évolution générale du marché, changement législatif)
- Procédure de notification et de vérification

### 6. Autorisations réglementaires
- Contrôle des concentrations (si seuils atteints)
- Autorisations sectorielles (activités réglementées)
- Contrôle des investissements étrangers (si acquéreur non-européen dans un secteur stratégique)

**Négociation des conditions suspensives**

Points de vue opposés :
- **L'acquéreur** souhaite le maximum de conditions suspensives pour pouvoir se retirer si la situation évolue défavorablement
- **Le vendeur** souhaite limiter les conditions suspensives pour sécuriser la transaction

**Compromis habituels** :
- Limiter le nombre de conditions aux seules conditions nécessaires et légitimes
- Fixer des délais stricts pour la réalisation de chaque condition
- Prévoir la caducité automatique du contrat si une condition n'est pas réalisée dans le délai
- Distinguer les conditions au bénéfice du vendeur et celles au bénéfice de l'acquéreur
- Prévoir la possibilité de renoncer à une condition (renonciation unilatérale par la partie bénéficiaire)`
    },
    {
      id: 'clause-prix',
      title: 'La clause de prix : mécanismes et formules',
      content: `La clause de prix est naturellement la plus négociée du SPA. Elle détermine non seulement le montant à payer mais aussi les modalités de calcul, d'ajustement et de paiement.

**Les deux grands mécanismes de fixation du prix**

### 1. Le mécanisme de locked box
Le prix est fixé définitivement à une date de référence passée (la locked box date), généralement la date du dernier bilan audité.

**Principe** : le prix est calculé sur la base des comptes à la locked box date et ne sera pas ajusté au closing. L'acquéreur acquiert les bénéfices générés entre la locked box date et le closing (« value accrual »).

**Protection contre les fuites de valeur (leakage)** :
Le vendeur s'engage à ne pas extraire de valeur de l'entreprise entre la locked box date et le closing :
- Pas de distribution de dividendes
- Pas de remboursement de comptes courants
- Pas de rémunération exceptionnelle au dirigeant
- Pas de frais de transaction supportés par la société
- Pas de cession d'actifs à prix inférieur au marché

En cas de leakage, le prix est réduit euro pour euro du montant de la fuite.

**Avantages** :
- Simplicité et certitude sur le prix
- Pas de litige sur les comptes de closing
- Le vendeur bénéficie de la valeur créée jusqu'au closing (en négociant un prix plus élevé)

**Inconvénients** :
- L'acquéreur supporte le risque de dégradation entre la locked box date et le closing
- Nécessite des comptes de référence fiables et audités

### 2. Le mécanisme de completion accounts
Le prix provisoire est payé au closing, puis ajusté sur la base de comptes arrêtés au jour du closing.

**Formule type** :
Prix définitif = Prix de base +/- Ajustement de dette financière nette +/- Ajustement de BFR

**Processus** :
1. Paiement du prix provisoire au closing (basé sur des estimations)
2. Établissement des comptes de closing dans les 60 à 90 jours
3. Revue et validation des comptes par l'autre partie
4. En cas de désaccord, intervention d'un expert indépendant
5. Calcul du prix définitif et paiement de l'ajustement (dans un sens ou dans l'autre)

**Avantages** :
- Le prix reflète la situation réelle au jour du transfert
- Protection de l'acquéreur contre la dégradation pré-closing

**Inconvénients** :
- Complexité et risque de litige sur les comptes de closing
- Incertitude sur le prix final pendant plusieurs mois

**L'earn-out : la composante variable du prix**

L'earn-out est un mécanisme par lequel une partie du prix est conditionnée à la performance future de l'entreprise.

**Caractéristiques types** :
- Part de l'earn-out : 10 à 30 % du prix total (au-delà, le risque pour le vendeur est trop élevé)
- Durée : 1 à 3 ans post-closing
- KPIs : chiffre d'affaires, EBE, EBITDA, résultat net, nombre de nouveaux clients
- Calcul : linéaire (proportionnel à l'atteinte) ou binaire (tout ou rien)

**Protections du vendeur** :
- Clause de gestion en bon père de famille (empêcher l'acquéreur de dégrader volontairement les résultats)
- Droit d'accès à l'information financière
- Comptabilité de l'earn-out par un expert indépendant
- Interdiction des décisions affectant artificiellement les KPIs (report de CA, accélération de charges)

**Le crédit-vendeur**

Le cédant accepte de différer le paiement d'une partie du prix :
- Part typique : 10 à 30 % du prix
- Taux d'intérêt : taux légal ou taux négocié (2 à 5 % en 2026)
- Durée : 1 à 3 ans avec remboursement progressif ou in fine
- Garanties : nantissement des titres, caution personnelle de l'acquéreur, garantie à première demande

Pour approfondir la GAP associée au prix, consultez [[garantie-actif-passif]].`
    },
    {
      id: 'garanties-vendeur',
      title: 'Les garanties du vendeur : déclarations et representations',
      content: `Les déclarations et garanties (representations & warranties) constituent le fondement de la responsabilité contractuelle du vendeur. Elles décrivent la situation de l'entreprise telle que le vendeur la garantit à l'acquéreur.

**Le principe des R&W**

Le vendeur déclare et garantit que certains faits sont vrais et complets à la date de signature et/ou à la date du closing. Si une déclaration s'avère inexacte ou incomplète, le vendeur sera tenu d'indemniser l'acquéreur dans le cadre de la garantie d'actif-passif.

**Les catégories de déclarations**

### Déclarations sur les titres et le vendeur
- Le vendeur est propriétaire des titres et a la capacité de les céder
- Les titres sont libres de tout nantissement, gage ou droit de préférence
- Le vendeur a obtenu toutes les autorisations nécessaires pour procéder à la cession
- La cession ne contrevient à aucun engagement contractuel du vendeur

### Déclarations sur la société
- La société est régulièrement constituée et immatriculée
- Le capital social est intégralement libéré
- Il n'existe aucun engagement sur les titres (option, promesse, droit de préemption)
- La gouvernance est régulière (PV d'AG, décisions du président)

### Déclarations financières
- Les comptes annuels sont sincères, réguliers et donnent une image fidèle
- Il n'existe pas de passif non comptabilisé ou sous-provisionné
- Le BFR est à un niveau normal et les créances sont recouvrables
- Les comptes intermédiaires reflètent fidèlement la situation
- Il n'y a pas eu de changement significatif depuis la date des derniers comptes

### Déclarations fiscales
- La société est en règle avec ses obligations fiscales
- Toutes les déclarations ont été déposées dans les délais et sont exactes
- Il n'existe pas de contentieux fiscal en cours ou potentiel
- Les crédits d'impôt sont réguliers et documentés
- La société n'a fait l'objet d'aucune vérification de comptabilité non communiquée

### Déclarations sociales
- La société respecte le droit du travail et la convention collective
- Les contrats de travail sont réguliers et à jour
- Il n'existe pas de contentieux prud'homal en cours ou menaçant
- Les obligations en matière de formation, santé et sécurité sont respectées
- Les mandataires sociaux disposent de mandats réguliers

### Déclarations sur les contrats
- Les contrats majeurs sont en vigueur et ne font l'objet d'aucun litige
- Aucun contrat ne contient de clause de changement de contrôle susceptible d'être déclenchée
- Le bail commercial est valide et ses conditions sont conformes au marché
- Les relations avec les fournisseurs clés sont pérennes

### Déclarations sur la conformité
- La société respecte toutes les réglementations applicables
- Les autorisations d'exploitation sont valides et à jour
- La société est en conformité avec les normes environnementales
- Il n'existe pas de procédure administrative en cours

**La disclosure letter (lettre d'information)**

Le vendeur peut limiter sa responsabilité en révélant les exceptions aux déclarations dans une disclosure letter (ou lettre d'information). Ce document, annexé au SPA, liste les faits qui dérogent aux déclarations :

- Litiges en cours connus
- Non-conformités identifiées
- Contrats avec clause de changement de contrôle
- Provisions connues comme insuffisantes

**Négociation des R&W**

Points de tension habituels :
- **Connaissance du vendeur** : le vendeur veut limiter ses déclarations à ce qu'il connaît effectivement ; l'acquéreur veut une garantie objective
- **Périmètre** : plus les déclarations sont larges, plus le risque pour le vendeur est élevé
- **Actualisation** : le vendeur doit-il mettre à jour ses déclarations entre le signing et le closing ?
- **Survie des déclarations** : durée pendant laquelle les déclarations peuvent donner lieu à une réclamation (alignée sur la durée de la GAP)`
    },
    {
      id: 'annexes-closing',
      title: 'Annexes du SPA et organisation du closing',
      content: `Les annexes du SPA sont aussi importantes que le corps du contrat. Elles contiennent les informations détaillées et les documents auxquels le contrat fait référence.

**Les annexes essentielles**

### Annexe 1 — Garantie d'actif et de passif (GAP)
La GAP est souvent rédigée comme un contrat séparé annexé au SPA. Elle détaille le mécanisme d'indemnisation en cas de violation des déclarations du vendeur.

Pour un guide complet de la GAP, consultez [[garantie-actif-passif]].

### Annexe 2 — Comptes de référence
- Bilans et comptes de résultat des exercices de référence
- Tableau des retraitements convenus
- Calcul de l'EBE normatif
- Situation de la dette financière nette
- Niveau du BFR normatif

### Annexe 3 — Disclosure letter
Liste des exceptions aux déclarations et garanties du vendeur, avec les pièces justificatives.

### Annexe 4 — Formule de prix et mécanisme d'ajustement
- Définitions précises des agrégats (dette nette, trésorerie, BFR)
- Exemples chiffrés du calcul du prix
- Procédure d'établissement des comptes de closing
- Mécanisme de résolution des désaccords

### Annexe 5 — Clause de non-concurrence
- Périmètre géographique (par département, région ou pays)
- Périmètre d'activité (codes NAF exclus)
- Durée (2 à 5 ans)
- Contrepartie financière (montant ou pourcentage du prix)
- Sanctions en cas de violation

### Annexe 6 — Convention d'accompagnement
- Durée et modalités de l'accompagnement post-cession
- Missions confiées au cédant (présentation aux clients, transfert de savoir-faire)
- Rémunération (forfait mensuel ou intégré dans le prix)
- Statut du cédant pendant l'accompagnement (consultant, salarié)
- Conditions de fin anticipée

### Annexe 7 — Liste des conditions suspensives et documents du closing
- Check-list détaillée de chaque condition suspensive
- Documents à produire pour chaque condition
- Délais applicables

### Annexe 8 — Modèle d'ordre de mouvement
Pour les cessions d'actions, le modèle d'ordre de mouvement à inscrire au registre des mouvements de titres.

**L'organisation du closing**

Le closing est un événement précisément orchestré. Un bon conseil prépare une closing checklist détaillée :

### Avant le closing (J-7 à J-1)
- Vérification de la levée de toutes les conditions suspensives
- Réception de la preuve de financement définitive de l'acquéreur
- Préparation des projets de PV d'AG (démission et nomination des mandataires sociaux)
- Vérification de l'inscription en compte des titres et du registre des mouvements
- Préparation de l'ordre de virement et des coordonnées bancaires
- Impression et reliure des documents à signer
- Confirmation de la date, de l'heure et du lieu du closing

### Le jour du closing
1. Revue de la closing checklist par les avocats
2. Lecture et paraphage du SPA par les parties
3. Signature du SPA et de la GAP
4. Remise de l'ordre de virement irrévocable
5. Signature des ordres de mouvement de titres
6. Remise des démissions des mandataires sociaux sortants
7. Tenue de l'AG de nomination des nouveaux dirigeants
8. Échange des documents et signatures croisées
9. Célébration (informelle mais appréciée)

### Après le closing (J+1 à J+30)
- Enregistrement de l'acte de cession (SIE) — délai : 1 mois
- Paiement des droits d'enregistrement (0,1 % pour les actions, 3 % pour les parts sociales avec abattement)
- Publication au BODACC
- Modification du Kbis
- Information des tiers (banques, assurances, clients, fournisseurs)
- Déclaration fiscale de la plus-value

Pour un guide complet du closing, consultez [[closing-cession-entreprise]].`
    }
  ],
  faq: [
    {
      question: 'Qui rédige le SPA : l\'avocat du vendeur ou de l\'acquéreur ?',
      answer: 'Traditionnellement en France, c\'est l\'avocat de l\'acquéreur qui rédige la première version du SPA (first draft), conformément à la pratique anglo-saxonne. Cela lui donne un avantage tactique car il structure le contrat selon ses intérêts. Cependant, cette pratique n\'est pas une règle absolue. Dans certains cas, notamment les processus de vente organisés par le vendeur, c\'est l\'avocat du vendeur qui fournit le premier draft. L\'important est que chaque partie soit représentée par un avocat spécialisé en M&A qui veillera à ses intérêts.'
    },
    {
      question: 'Combien coûte la rédaction d\'un SPA pour une PME ?',
      answer: 'Les honoraires d\'avocat pour la rédaction et la négociation du SPA varient selon la complexité de l\'opération. Pour une cession de PME valorisée entre 1 et 10 millions d\'euros, les frais d\'avocat côté vendeur se situent typiquement entre 15 000 et 40 000 € HT, et entre 20 000 et 50 000 € HT côté acquéreur (qui supporte généralement aussi les frais de due diligence). Ces montants incluent la négociation de la LOI, la rédaction/revue du SPA, la GAP et l\'accompagnement au closing.'
    },
    {
      question: 'Quelle est la différence entre signing et closing ?',
      answer: 'Le signing est la date de signature du SPA. Le closing est la date effective du transfert de propriété et du paiement du prix. Dans les transactions simples, signing et closing ont lieu le même jour (on parle de simultaneous signing and closing). Mais dans la majorité des cessions de PME, il y a un délai de 4 à 8 semaines entre les deux, le temps de lever les conditions suspensives (financement bancaire, information des salariés, autorisations réglementaires). Pendant cette période intermédiaire, le vendeur s\'engage à gérer l\'entreprise dans le cours normal des affaires.'
    }
  ],
  cta: {
    tool: 'Contact',
    text: 'Sécurisez votre protocole avec un avocat spécialisé'
  }
}
