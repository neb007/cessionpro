// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import SEO from '@/components/SEO';

const SECTIONS_FR = [
  {
    title: '1. Objet',
    content: [
      "Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions d'utilisation du site et de la plateforme Riviqo (ci-après « la Plateforme »), ainsi que les droits et obligations des utilisateurs.",
      "L'inscription sur la Plateforme implique l'acceptation pleine et entière des présentes CGU.",
    ],
  },
  {
    title: '2. Définitions',
    content: [
      '• Plateforme : le site internet Riviqo et l\'ensemble de ses fonctionnalités.',
      '• Utilisateur : toute personne physique ou morale inscrite sur la Plateforme.',
      '• Annonce : toute publication de cession ou de recherche d\'acquisition d\'entreprise sur la Plateforme.',
      '• Services : l\'ensemble des services proposés par Riviqo, incluant les outils en libre-service et le service d\'accompagnement Riviqo Advisory.',
      '• Riviqo Advisory : service d\'accompagnement M&A proposant un expert dédié pour piloter une opération de cession ou d\'acquisition.',
      '• SmartMatching : algorithme de mise en relation intelligent entre cédants et repreneurs.',
      '• Data Room : espace sécurisé de stockage et de partage de documents confidentiels.',
    ],
  },
  {
    title: '3. Inscription et compte',
    content: [
      "L'accès à certaines fonctionnalités de la Plateforme nécessite la création d'un compte utilisateur.",
      "L'Utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son inscription, et à les maintenir à jour.",
      "L'Utilisateur est seul responsable de la confidentialité de ses identifiants de connexion. Toute utilisation de son compte est réputée faite par lui.",
      "Riviqo se réserve le droit de suspendre ou de supprimer un compte en cas de violation des présentes CGU ou de comportement portant atteinte aux intérêts de la Plateforme ou de ses utilisateurs.",
    ],
  },
  {
    title: '4. Publication d\'annonces',
    content: [
      "L'Utilisateur peut publier des annonces de cession ou de recherche d'acquisition d'entreprise sur la Plateforme.",
      "L'Utilisateur garantit que les informations publiées dans ses annonces sont exactes, licites et ne portent atteinte à aucun droit de tiers.",
      "Riviqo se réserve le droit de refuser, modifier ou supprimer toute annonce qui ne respecterait pas les présentes CGU, la législation en vigueur ou les standards de qualité de la Plateforme.",
      "La publication d'annonces est soumise aux conditions tarifaires en vigueur, consultables sur la page Tarifs.",
    ],
    link: { text: 'Voir les tarifs', page: 'Pricing' },
  },
  {
    title: '5. Services et tarification',
    content: [
      "Riviqo propose des outils gratuits en libre-service (valorisation, simulation de financement, simulation de cession) et des options payantes à la carte (SmartMatching, mise en avant, Data Room, NDA, packs photos, packs de mise en relation).",
      "Le service Riviqo Advisory est un service d'accompagnement M&A personnalisé, dont la tarification est communiquée sur demande.",
      "Les tarifs sont indiqués en euros TTC. Toute commande est ferme et définitive après validation du paiement.",
      "Riviqo se réserve le droit de modifier ses tarifs à tout moment. Les modifications de prix ne s'appliquent pas aux commandes déjà validées.",
    ],
    link: { text: 'Consulter les tarifs', page: 'Pricing' },
  },
  {
    title: '6. Propriété intellectuelle',
    content: [
      "L'ensemble des éléments de la Plateforme (textes, images, logiciels, bases de données, algorithmes, marques, logos) est protégé par le droit de la propriété intellectuelle.",
      "L'Utilisateur s'interdit de reproduire, copier, modifier, transmettre, distribuer ou exploiter tout ou partie du contenu de la Plateforme sans autorisation écrite préalable.",
      "Les contenus publiés par l'Utilisateur (annonces, documents Data Room) restent sa propriété. L'Utilisateur accorde à Riviqo une licence non exclusive d'utilisation de ces contenus dans le cadre du fonctionnement de la Plateforme.",
    ],
  },
  {
    title: '7. Responsabilité',
    content: [
      "Riviqo met en relation des cédants et des repreneurs. Riviqo n'est pas partie aux transactions entre utilisateurs et ne saurait être tenu responsable des suites données aux mises en relation.",
      "Les outils de valorisation, de simulation de financement et de simulation de cession sont fournis à titre indicatif et ne constituent pas un conseil financier, fiscal ou juridique.",
      "Le service Riviqo Advisory accompagne les utilisateurs dans leur opération mais ne se substitue pas aux conseils juridiques, fiscaux ou comptables professionnels.",
      "Riviqo ne garantit pas la disponibilité ininterrompue de la Plateforme et ne saurait être tenu responsable des interruptions temporaires pour maintenance ou mise à jour.",
    ],
  },
  {
    title: '8. Données personnelles',
    content: [
      "La collecte et le traitement des données personnelles des Utilisateurs sont effectués conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.",
      "L'ensemble des données sont hébergées au sein de l'Union européenne, conformément aux exigences du RGPD.",
      "Pour plus d'informations sur la gestion de vos données personnelles, consultez notre Politique de confidentialité.",
    ],
    link: { text: 'Politique de confidentialité', page: 'PolitiqueConfidentialite' },
  },
  {
    title: '9. Modification des CGU',
    content: [
      "Riviqo se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entreront en vigueur dès leur publication sur la Plateforme.",
      "L'Utilisateur sera informé des modifications par notification sur la Plateforme. La poursuite de l'utilisation de la Plateforme après notification vaut acceptation des CGU modifiées.",
    ],
  },
  {
    title: '10. Droit applicable et juridiction',
    content: [
      "Les présentes CGU sont régies par le droit français.",
      "En cas de litige relatif à l'interprétation ou à l'exécution des présentes CGU, les parties s'efforceront de trouver une solution amiable. À défaut, le litige sera soumis aux tribunaux compétents du siège social de l'éditeur.",
    ],
  },
  {
    title: '11. Contact',
    content: [
      'Pour toute question relative aux présentes CGU, vous pouvez nous contacter :',
      '• Email : [À COMPLÉTER]',
      '• Adresse : [À COMPLÉTER]',
    ],
  },
];

const SECTIONS_EN = [
  {
    title: '1. Purpose',
    content: [
      'These Terms of Use (hereinafter "Terms") define the terms and conditions for using the Riviqo website and platform (hereinafter "the Platform"), as well as the rights and obligations of users.',
      'Registration on the Platform implies full and complete acceptance of these Terms.',
    ],
  },
  {
    title: '2. Definitions',
    content: [
      '• Platform: the Riviqo website and all its features.',
      '• User: any individual or legal entity registered on the Platform.',
      '• Listing: any business sale or acquisition search published on the Platform.',
      '• Services: all services offered by Riviqo, including self-service tools and the Riviqo Advisory support service.',
      '• Riviqo Advisory: M&A advisory service offering a dedicated expert to manage a sale or acquisition transaction.',
      '• SmartMatching: intelligent matching algorithm between sellers and buyers.',
      '• Data Room: secure space for storing and sharing confidential documents.',
    ],
  },
  {
    title: '3. Registration and account',
    content: [
      'Access to certain Platform features requires creating a user account.',
      'The User undertakes to provide accurate, complete and up-to-date information during registration and to keep it updated.',
      'The User is solely responsible for the confidentiality of their login credentials. Any use of their account is deemed to be made by them.',
      "Riviqo reserves the right to suspend or delete an account in case of violation of these Terms or behavior detrimental to the Platform's or its users' interests.",
    ],
  },
  {
    title: '4. Listing publication',
    content: [
      'The User may publish business sale or acquisition search listings on the Platform.',
      'The User guarantees that the information published in their listings is accurate, lawful and does not infringe any third-party rights.',
      "Riviqo reserves the right to refuse, modify or delete any listing that does not comply with these Terms, applicable legislation or the Platform's quality standards.",
      'Listing publication is subject to the current pricing conditions, available on the Pricing page.',
    ],
    link: { text: 'View pricing', page: 'Pricing' },
  },
  {
    title: '5. Services and pricing',
    content: [
      'Riviqo offers free self-service tools (valuation, financing simulator, sale simulator) and paid à la carte options (SmartMatching, sponsored listing, Data Room, NDA, photo packs, contact packs).',
      'The Riviqo Advisory service is a personalized M&A advisory service, with pricing available on request.',
      'Prices are indicated in euros including taxes. Any order is firm and final after payment validation.',
      'Riviqo reserves the right to modify its prices at any time. Price changes do not apply to already validated orders.',
    ],
    link: { text: 'View pricing', page: 'Pricing' },
  },
  {
    title: '6. Intellectual property',
    content: [
      'All Platform elements (texts, images, software, databases, algorithms, trademarks, logos) are protected by intellectual property law.',
      'The User is prohibited from reproducing, copying, modifying, transmitting, distributing or exploiting all or part of the Platform content without prior written authorization.',
      'Content published by the User (listings, Data Room documents) remains their property. The User grants Riviqo a non-exclusive license to use this content for the operation of the Platform.',
    ],
  },
  {
    title: '7. Liability',
    content: [
      'Riviqo connects sellers and buyers. Riviqo is not party to transactions between users and cannot be held liable for the outcomes of introductions.',
      'The valuation, financing simulation and sale simulation tools are provided for informational purposes only and do not constitute financial, tax or legal advice.',
      'The Riviqo Advisory service supports users in their transaction but does not replace professional legal, tax or accounting advice.',
      'Riviqo does not guarantee uninterrupted availability of the Platform and cannot be held liable for temporary interruptions for maintenance or updates.',
    ],
  },
  {
    title: '8. Personal data',
    content: [
      'The collection and processing of Users\' personal data is carried out in accordance with the General Data Protection Regulation (GDPR) and the French Data Protection Act.',
      'All data is hosted within the European Union, in compliance with GDPR requirements.',
      'For more information about how your personal data is managed, please refer to our Privacy Policy.',
    ],
    link: { text: 'Privacy Policy', page: 'PolitiqueConfidentialite' },
  },
  {
    title: '9. Changes to Terms',
    content: [
      'Riviqo reserves the right to modify these Terms at any time. Modifications will take effect upon publication on the Platform.',
      'The User will be informed of modifications by notification on the Platform. Continued use of the Platform after notification constitutes acceptance of the modified Terms.',
    ],
  },
  {
    title: '10. Applicable law and jurisdiction',
    content: [
      'These Terms are governed by French law.',
      "In the event of a dispute relating to the interpretation or execution of these Terms, the parties will endeavor to find an amicable solution. Failing that, the dispute will be submitted to the competent courts of the publisher's registered office.",
    ],
  },
  {
    title: '11. Contact',
    content: [
      'For any questions regarding these Terms, you can contact us:',
      '• Email: [TO BE COMPLETED]',
      '• Address: [TO BE COMPLETED]',
    ],
  },
];

export default function CGU() {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const sections = isFr ? SECTIONS_FR : SECTIONS_EN;

  return (
    <div className="bg-[#FAF9F7]">
      <SEO pageName="CGU" />
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759] mb-4">
          {isFr ? "Conditions Générales d'Utilisation" : 'Terms of Use'}
        </h1>
        <p className="text-sm text-[#6B7A94] mb-12">
          {isFr ? 'Dernière mise à jour : février 2025' : 'Last updated: February 2025'}
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <article key={section.title}>
              <h2 className="font-display text-xl font-bold text-[#3B4759] mb-4">{section.title}</h2>
              <div className="space-y-3">
                {section.content.map((line, i) => (
                  <p key={i} className="text-sm text-[#6B7A94] leading-relaxed">{line}</p>
                ))}
                {section.link && (
                  <Link to={createPageUrl(section.link.page)} className="inline-flex items-center text-sm text-[#FF6B4A] font-medium hover:underline mt-2">
                    {section.link.text} →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
