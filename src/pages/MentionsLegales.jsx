// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import SEO from '@/components/SEO';

const SECTIONS_FR = [
  {
    title: '1. Éditeur du site',
    content: [
      'Le site Riviqo est édité par :',
      '• Raison sociale : OPTINOC',
      '• Forme juridique : SASU',
      '• Siège social : 1 Allée des Peupliers, 94310 Orly',
      '• SIRET : 850 573 932 00025',
      '• Numéro de TVA intracommunautaire : FR38850573932',
      '• Directeur de la publication : Nabil Jerbi',
      '• Email de contact : contact@riviqo.com',
    ],
  },
  {
    title: '2. Hébergeur',
    content: [
      "Le site est hébergé par :",
      '• Nom : Vercel Inc.',
      '• Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis',
      '• Site web : vercel.com',
    ],
  },
  {
    title: '3. Propriété intellectuelle',
    content: [
      "L'ensemble des contenus présents sur le site Riviqo — textes, images, graphismes, logos, icônes, logiciels, bases de données — sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle.",
      "Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de l'éditeur.",
      "Toute exploitation non autorisée du site ou de son contenu est constitutive de contrefaçon et sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.",
    ],
  },
  {
    title: '4. Limitation de responsabilité',
    content: [
      "L'éditeur s'efforce de fournir des informations aussi précises que possible sur le site. Toutefois, il ne pourra être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour, que celles-ci soient de son fait ou du fait de tiers partenaires.",
      "L'éditeur ne saurait être tenu pour responsable des dommages directs ou indirects résultant de l'accès au site ou de l'utilisation du site et/ou des informations qui y sont diffusées.",
      "Les outils de valorisation, de simulation de financement et de simulation de cession proposés sur la plateforme sont fournis à titre indicatif et ne constituent en aucun cas un conseil financier, fiscal ou juridique.",
    ],
  },
  {
    title: '5. Données personnelles',
    content: [
      "L'ensemble des données personnelles collectées sur Riviqo sont hébergées en Europe et traitées en conformité avec le Règlement Général sur la Protection des Données (RGPD).",
      "Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles.",
      "Pour en savoir plus sur la gestion de vos données et vos droits, consultez notre Politique de confidentialité.",
    ],
    link: { text: 'Politique de confidentialité', page: 'PolitiqueConfidentialite' },
  },
  {
    title: '6. Cookies',
    content: [
      "Le site Riviqo utilise des cookies pour améliorer l'expérience utilisateur, mesurer l'audience et proposer des contenus adaptés.",
      "Pour en savoir plus sur les cookies et les paramétrer, consultez notre Politique de confidentialité.",
    ],
    link: { text: 'Politique de confidentialité — section Cookies', page: 'PolitiqueConfidentialite' },
  },
  {
    title: '7. Droit applicable et juridiction',
    content: [
      "Les présentes mentions légales sont régies par le droit français. En cas de litige, et après tentative de résolution amiable, compétence est attribuée aux tribunaux compétents du siège social de l'éditeur.",
    ],
  },
];

const SECTIONS_EN = [
  {
    title: '1. Site publisher',
    content: [
      'The Riviqo website is published by:',
      '• Company name: OPTINOC',
      '• Legal form: SASU (Simplified Joint-Stock Company)',
      '• Registered office: 1 Allée des Peupliers, 94310 Orly, France',
      '• SIRET: 850 573 932 00025',
      '• EU VAT number: FR38850573932',
      '• Publication director: Nabil Jerbi',
      '• Contact email: contact@riviqo.com',
    ],
  },
  {
    title: '2. Hosting provider',
    content: [
      'The website is hosted by:',
      '• Name: Vercel Inc.',
      '• Address: 340 S Lemon Ave #4133, Walnut, CA 91789, USA',
      '• Website: vercel.com',
    ],
  },
  {
    title: '3. Intellectual property',
    content: [
      'All content on the Riviqo website — texts, images, graphics, logos, icons, software, databases — is protected by French and international intellectual property laws.',
      'Any reproduction, representation, modification, publication or adaptation of all or part of the site elements, by any means or process, is prohibited without prior written authorization from the publisher.',
      'Any unauthorized use of the site or its content constitutes infringement and is punishable under articles L.335-2 and following of the French Intellectual Property Code.',
    ],
  },
  {
    title: '4. Limitation of liability',
    content: [
      'The publisher strives to provide information as accurate as possible on the site. However, it cannot be held responsible for omissions, inaccuracies or deficiencies in updating, whether caused by the publisher or by third-party partners.',
      'The publisher shall not be held liable for any direct or indirect damages resulting from access to or use of the site and/or the information disseminated therein.',
      'The valuation tools, financing simulator and sale simulator provided on the platform are for informational purposes only and do not constitute financial, tax or legal advice.',
    ],
  },
  {
    title: '5. Personal data',
    content: [
      'All personal data collected on Riviqo is hosted in Europe and processed in compliance with the General Data Protection Regulation (GDPR).',
      'In accordance with the GDPR and the French Data Protection Act, you have the right to access, rectify, delete and port your personal data.',
      'To learn more about how your data is managed and your rights, please refer to our Privacy Policy.',
    ],
    link: { text: 'Privacy Policy', page: 'PolitiqueConfidentialite' },
  },
  {
    title: '6. Cookies',
    content: [
      'The Riviqo website uses cookies to improve user experience, measure audience and offer adapted content.',
      'To learn more about cookies and configure them, please refer to our Privacy Policy.',
    ],
    link: { text: 'Privacy Policy — Cookies section', page: 'PolitiqueConfidentialite' },
  },
  {
    title: '7. Applicable law and jurisdiction',
    content: [
      "These legal notices are governed by French law. In the event of a dispute, and after an attempt at amicable resolution, jurisdiction is granted to the competent courts of the publisher's registered office.",
    ],
  },
];

export default function MentionsLegales() {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const sections = isFr ? SECTIONS_FR : SECTIONS_EN;

  return (
    <div className="bg-[#FAF9F7]">
      <SEO pageName="MentionsLegales" />
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759] mb-4">
          {isFr ? 'Mentions légales' : 'Legal notice'}
        </h1>
        <p className="text-sm text-[#6B7A94] mb-12">
          {isFr ? 'Dernière mise à jour : mars 2026' : 'Last updated: March 2026'}
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
