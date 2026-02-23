# CAHIER DES CHARGES — SIMULATEURS CESSION / ACQUISITION

Ce document rassemble les spécifications pour deux nouveaux simulateurs intégrés à la plateforme Riviqo.

---

## 1) SIMULATEUR COMPLET DE FINANCEMENT DE REPRISE

### Objectif :
Déterminer si un projet de reprise est finançable et proposer un montage optimal.

### Utilisateur cible :
- Repreneur individuel
- Entrepreneur externe
- Manager en reprise (MBI/MBO)
- Investisseur

### Données d’entrée :

**A. Informations sur la cible**
- Prix d’acquisition envisagé (€)
- Chiffre d’affaires
- EBITDA / résultat d’exploitation
- Résultat net
- Dettes existantes
- BFR
- Investissements futurs estimés
- Secteur d’activité
- Nombre de salariés

**B. Profil du repreneur**
- Apport personnel
- Patrimoine mobilisable
- Revenus actuels
- Situation professionnelle
- Expérience secteur (oui/non)
- Associés / investisseurs
- Garantie personnelle possible

**C. Paramètres de financement**
- Durée du prêt
- Taux d’intérêt estimé
- Crédit vendeur (%)
- Earn‑out
- Subventions / aides
- Holding de reprise (oui/non)

### Calculs :

- **Répartition financement :** Apport / Dette bancaire / Crédit vendeur / Mezzanine / Investisseurs / Aides
- **Capacité d’endettement :** Dette ≈ 3 à 5 × EBITDA, DSCR (ratio couverture dette)
- **Mensualités :** Calcul standard d’emprunt (montant, durée, taux)
- **Cash flow post‑reprise :** EBITDA – remboursement dette – impôts – investissements – rémunération dirigeant

### Indicateurs :
- Apport minimum recommandé
- Dette maximale supportable
- DSCR
- ROI estimé
- Salaire possible
- Délai remboursement

### Résultats :
- **Statut :** Finançable / Sous conditions / Risqué
- Montage recommandé détaillé
- Mensualité
- Cash disponible annuel

### Alertes :
- Apport insuffisant
- Rentabilité trop faible
- Risque bancaire
- Dette excessive
- Salaire non viable

### Rapport PDF (optionnel) :
- Montage détaillé
- Hypothèses
- Analyse faisabilité
- Recommandations

---

## 2) SIMULATEUR NET VENDEUR APRÈS IMPÔTS

### Objectif :
Calculer le montant réellement perçu par le cédant après fiscalité et frais.

### Utilisateur cible :
- Dirigeant actionnaire
- Fondateur
- Associé sortant
- PME / TPE

### Données d’entrée :

**A. Informations sur la vente**
- Prix de cession (€)
- Type : Titres ou Fonds
- Frais de cession (€ ou %)
- Dettes remboursées

**B. Données fiscales**
- Prix d’acquisition initial
- Apports réalisés
- Durée de détention
- Date création entreprise

**C. Situation personnelle**
- Âge
- Départ retraite prévu (oui/non)
- Résidence fiscale
- Situation matrimoniale (option)
- Tranche d’imposition

**D. Paramètres juridiques**
- Détention directe ou via holding
- Abattements applicables
- Régime fiscal : PFU (Flat tax) ou Barème progressif

### Calculs :

- **Plus‑value brute :** Prix de vente – prix acquisition – frais déductibles
- **Fiscalité :** PFU ou Barème, Prélèvements sociaux, Abattements, Exonération retraite éventuelle
- **Impôt total :** IR + prélèvements sociaux
- **Net perçu :** Prix de vente – impôts – frais – dettes

### Comparaison scénarios :
- Flat tax
- Barème progressif
- Départ retraite

### Résultats :
- Net vendeur estimé (principal)
- Plus‑value imposable
- Taux d’imposition effectif
- Impôts totaux
- Frais
- Montant final encaissé

### Alertes :
- Optimisation fiscale possible
- Vente via holding à étudier
- Départ retraite à anticiper
- Risque de sur‑imposition

### Rapport PDF recommandé :
- Détail calcul
- Hypothèses
- Scénarios alternatifs
- Conseils d’optimisation
