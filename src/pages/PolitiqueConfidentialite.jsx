// @ts-nocheck
import React from 'react';
import { useLanguage } from '@/components/i18n/LanguageContext';

const SECTIONS_FR = [
  {
    title: '1. Responsable du traitement',
    content: [
      'Le responsable du traitement des données personnelles collectées sur le site Riviqo est :',
      '• Raison sociale : [À COMPLÉTER]',
      '• Adresse : [À COMPLÉTER]',
      '• Email du DPO / responsable données : [À COMPLÉTER]',
    ],
  },
  {
    title: '2. Données collectées',
    content: [
      'Nous collectons les données personnelles suivantes :',
      "Lors de l'inscription : nom, prénom, adresse email, mot de passe (hashé), numéro de téléphone (optionnel), nom de l'entreprise (optionnel).",
      "Lors de la publication d'annonces : informations relatives à l'entreprise à céder ou recherchée (secteur d'activité, chiffre d'affaires, effectif, localisation, description).",
      "Lors de l'utilisation des outils : données financières saisies dans les simulateurs (valorisation, financement, cession). Ces données sont traitées localement et ne sont pas stockées sur nos serveurs sauf si l'Utilisateur crée un compte.",
      "Données de navigation : adresse IP, type de navigateur, pages consultées, durée de visite, via des cookies et outils d'analyse.",
    ],
  },
  {
    title: '3. Finalités du traitement',
    content: [
      'Les données collectées sont utilisées pour :',
      "• Permettre la création et la gestion du compte utilisateur",
      "• Publier et gérer les annonces de cession ou d'acquisition",
      "• Fournir le service SmartMatching (algorithme de mise en relation)",
      "• Fournir le service Riviqo Advisory (accompagnement M&A)",
      "• Envoyer des notifications relatives aux matchs et messages",
      "• Améliorer la Plateforme et analyser les usages (statistiques anonymisées)",
      "• Assurer la sécurité de la Plateforme et prévenir les fraudes",
      "• Répondre aux demandes de contact et de support",
    ],
  },
  {
    title: '4. Base légale',
    content: [
      "Le traitement des données repose sur :",
      "• L'exécution du contrat : inscription, publication d'annonces, utilisation des services.",
      "• Le consentement : envoi de communications commerciales, utilisation de cookies non essentiels.",
      "• L'intérêt légitime : amélioration de la Plateforme, statistiques, sécurité.",
      "• L'obligation légale : conservation des données de facturation.",
    ],
  },
  {
    title: '5. Durée de conservation',
    content: [
      "Les données personnelles sont conservées pendant :",
      "• Données de compte : pendant toute la durée du compte, puis 3 ans après la dernière activité.",
      "• Données d'annonces : pendant la durée de publication, puis 1 an après retrait.",
      "• Données de facturation : 10 ans (obligation légale).",
      "• Données de navigation / cookies : 13 mois maximum.",
      "• Données Riviqo Advisory : pendant la durée de la mission, puis 5 ans après clôture du dossier.",
    ],
  },
  {
    title: '6. Destinataires',
    content: [
      "Les données personnelles peuvent être partagées avec :",
      "• Les autres utilisateurs de la Plateforme, dans le cadre des mises en relation (profil public, annonces).",
      "• L'équipe Riviqo Advisory, pour les clients ayant souscrit à ce service.",
      "• Nos prestataires techniques (hébergement, paiement, emailing) dans le strict cadre nécessaire à la fourniture du service.",
      "Les données ne sont jamais vendues à des tiers.",
    ],
  },
  {
    title: '7. Transferts hors UE',
    content: [
      "Vos données sont hébergées exclusivement au sein de l'Union européenne, sur des infrastructures conformes au RGPD.",
      "En cas de transfert vers un pays tiers, nous nous assurons que des garanties appropriées sont mises en place (clauses contractuelles types, décision d'adéquation de la Commission européenne).",
    ],
  },
  {
    title: '8. Droits des utilisateurs',
    content: [
      "Conformément au RGPD, vous disposez des droits suivants :",
      "• Droit d'accès : obtenir la confirmation que des données vous concernant sont traitées et en obtenir une copie.",
      "• Droit de rectification : demander la correction de données inexactes ou incomplètes.",
      "• Droit de suppression : demander l'effacement de vos données dans les conditions prévues par le RGPD.",
      "• Droit à la portabilité : recevoir vos données dans un format structuré et couramment utilisé.",
      "• Droit d'opposition : vous opposer au traitement de vos données pour des raisons légitimes.",
      "• Droit à la limitation : demander la limitation du traitement dans certains cas.",
      "Pour exercer ces droits, contactez-nous à : [À COMPLÉTER]",
      "Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (www.cnil.fr).",
    ],
  },
  {
    title: '9. Cookies',
    id: 'cookies',
    content: [
      "Le site Riviqo utilise des cookies pour fonctionner correctement et améliorer votre expérience.",
      "",
      "Types de cookies utilisés :",
      "",
      "Cookies essentiels (obligatoires) :",
      "• Authentification et session utilisateur",
      "• Préférences de langue",
      "• Sécurité (protection CSRF)",
      "Durée : session ou 12 mois maximum.",
      "",
      "Cookies analytiques (avec consentement) :",
      "• Mesure d'audience et statistiques d'utilisation",
      "• Analyse des parcours utilisateurs pour améliorer la Plateforme",
      "Durée : 13 mois maximum.",
      "",
      "Cookies fonctionnels (avec consentement) :",
      "• Mémorisation des préférences d'affichage",
      "• Personnalisation du contenu",
      "Durée : 12 mois maximum.",
      "",
      "Paramétrage des cookies :",
      "Vous pouvez à tout moment modifier vos préférences en matière de cookies via les paramètres de votre navigateur. La désactivation de certains cookies peut limiter votre accès à certaines fonctionnalités de la Plateforme.",
    ],
  },
  {
    title: '10. Modifications',
    content: [
      "La présente politique de confidentialité peut être modifiée à tout moment. Les modifications entreront en vigueur dès leur publication sur le site. Nous vous informerons des modifications substantielles par notification sur la Plateforme.",
    ],
  },
  {
    title: '11. Contact',
    content: [
      "Pour toute question relative à la protection de vos données personnelles :",
      "• Email : [À COMPLÉTER]",
      "• Adresse : [À COMPLÉTER]",
    ],
  },
];

const SECTIONS_EN = [
  {
    title: '1. Data controller',
    content: [
      'The controller of personal data collected on the Riviqo website is:',
      '• Company name: [TO BE COMPLETED]',
      '• Address: [TO BE COMPLETED]',
      '• DPO / data protection email: [TO BE COMPLETED]',
    ],
  },
  {
    title: '2. Data collected',
    content: [
      'We collect the following personal data:',
      'During registration: last name, first name, email address, password (hashed), phone number (optional), company name (optional).',
      'When publishing listings: information about the business being sold or sought (sector, revenue, headcount, location, description).',
      'When using tools: financial data entered in simulators (valuation, financing, sale). This data is processed locally and is not stored on our servers unless the User creates an account.',
      'Browsing data: IP address, browser type, pages viewed, visit duration, via cookies and analytics tools.',
    ],
  },
  {
    title: '3. Purposes of processing',
    content: [
      'Collected data is used to:',
      '• Enable user account creation and management',
      '• Publish and manage sale or acquisition listings',
      '• Provide the SmartMatching service (matching algorithm)',
      '• Provide the Riviqo Advisory service (M&A support)',
      '• Send notifications related to matches and messages',
      '• Improve the Platform and analyze usage (anonymized statistics)',
      '• Ensure Platform security and prevent fraud',
      '• Respond to contact and support requests',
    ],
  },
  {
    title: '4. Legal basis',
    content: [
      'Data processing is based on:',
      '• Contract execution: registration, listing publication, use of services.',
      '• Consent: sending commercial communications, use of non-essential cookies.',
      '• Legitimate interest: Platform improvement, statistics, security.',
      '• Legal obligation: retention of billing data.',
    ],
  },
  {
    title: '5. Retention period',
    content: [
      'Personal data is retained for:',
      '• Account data: during the account lifetime, then 3 years after last activity.',
      '• Listing data: during publication, then 1 year after removal.',
      '• Billing data: 10 years (legal obligation).',
      '• Browsing data / cookies: 13 months maximum.',
      '• Riviqo Advisory data: during the engagement, then 5 years after file closure.',
    ],
  },
  {
    title: '6. Recipients',
    content: [
      'Personal data may be shared with:',
      '• Other Platform users, in the context of introductions (public profile, listings).',
      '• The Riviqo Advisory team, for clients who have subscribed to this service.',
      '• Our technical providers (hosting, payment, emailing) strictly as needed to provide the service.',
      'Data is never sold to third parties.',
    ],
  },
  {
    title: '7. Transfers outside the EU',
    content: [
      'Your data is hosted exclusively within the European Union, on GDPR-compliant infrastructure.',
      'In case of transfer to a third country, we ensure that appropriate safeguards are in place (standard contractual clauses, European Commission adequacy decision).',
    ],
  },
  {
    title: '8. User rights',
    content: [
      'In accordance with the GDPR, you have the following rights:',
      '• Right of access: obtain confirmation that data concerning you is being processed and get a copy.',
      '• Right of rectification: request correction of inaccurate or incomplete data.',
      '• Right of erasure: request deletion of your data under the conditions provided by the GDPR.',
      '• Right to portability: receive your data in a structured, commonly used format.',
      '• Right to object: object to the processing of your data for legitimate reasons.',
      '• Right to restriction: request restriction of processing in certain cases.',
      'To exercise these rights, contact us at: [TO BE COMPLETED]',
      'You also have the right to lodge a complaint with the CNIL (www.cnil.fr).',
    ],
  },
  {
    title: '9. Cookies',
    id: 'cookies',
    content: [
      'The Riviqo website uses cookies to function properly and improve your experience.',
      '',
      'Types of cookies used:',
      '',
      'Essential cookies (mandatory):',
      '• Authentication and user session',
      '• Language preferences',
      '• Security (CSRF protection)',
      'Duration: session or 12 months maximum.',
      '',
      'Analytics cookies (with consent):',
      '• Audience measurement and usage statistics',
      '• User journey analysis to improve the Platform',
      'Duration: 13 months maximum.',
      '',
      'Functional cookies (with consent):',
      '• Remembering display preferences',
      '• Content personalization',
      'Duration: 12 months maximum.',
      '',
      'Cookie settings:',
      'You can change your cookie preferences at any time via your browser settings. Disabling certain cookies may limit your access to certain Platform features.',
    ],
  },
  {
    title: '10. Changes',
    content: [
      'This privacy policy may be modified at any time. Changes will take effect upon publication on the website. We will inform you of substantial changes by notification on the Platform.',
    ],
  },
  {
    title: '11. Contact',
    content: [
      'For any questions regarding the protection of your personal data:',
      '• Email: [TO BE COMPLETED]',
      '• Address: [TO BE COMPLETED]',
    ],
  },
];

export default function PolitiqueConfidentialite() {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const sections = isFr ? SECTIONS_FR : SECTIONS_EN;

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759] mb-4">
          {isFr ? 'Politique de confidentialité et cookies' : 'Privacy policy and cookies'}
        </h1>
        <p className="text-sm text-[#6B7A94] mb-12">
          {isFr ? 'Dernière mise à jour : février 2025' : 'Last updated: February 2025'}
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <article key={section.title} id={section.id || undefined}>
              <h2 className="font-display text-xl font-bold text-[#3B4759] mb-4">{section.title}</h2>
              <div className="space-y-3">
                {section.content.map((line, i) =>
                  line === '' ? (
                    <div key={i} className="h-2" />
                  ) : (
                    <p key={i} className="text-sm text-[#6B7A94] leading-relaxed">{line}</p>
                  )
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
