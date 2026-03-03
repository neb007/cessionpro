const BASE_URL = 'https://riviqo.com';
const OG_IMAGE = `${BASE_URL}/riviqo-logo.png`;

export const SEO_DEFAULTS = {
  siteName: 'Riviqo',
  baseUrl: BASE_URL,
  ogImage: OG_IMAGE,
  twitterHandle: '@riviqo',
  locale: {
    fr: 'fr_FR',
    en: 'en_US',
  },
};

export const SEO_PAGES = {
  Home: {
    fr: {
      title: 'Riviqo — Cession et reprise d\'entreprise en France et en Europe',
      description: 'La référence pour céder ou reprendre une entreprise. Valorisation gratuite, SmartMatching, Data Room et accompagnement M&A.',
    },
    en: {
      title: 'Riviqo — Business sale and acquisition in France and Europe',
      description: 'The reference for selling or acquiring a business. Free valuation, SmartMatching, Data Room and M&A advisory.',
    },
    jsonLd: ['Organization', 'WebSite'],
  },
  Ceder: {
    fr: {
      title: 'Céder son entreprise — Guide et outils gratuits | Riviqo',
      description: 'Valorisez, préparez et vendez votre entreprise. Outils de valorisation gratuits, Data Room sécurisée et accompagnement M&A expert.',
    },
    en: {
      title: 'Sell your business — Free guide and tools | Riviqo',
      description: 'Value, prepare and sell your business. Free valuation tools, secure Data Room and expert M&A advisory.',
    },
  },
  Reprendre: {
    fr: {
      title: 'Reprendre une entreprise — Trouvez votre prochaine entreprise | Riviqo',
      description: 'Trouvez et financez votre acquisition d\'entreprise. SmartMatching intelligent, simulation de financement et Data Room sécurisée.',
    },
    en: {
      title: 'Buy a business — Find your next acquisition | Riviqo',
      description: 'Find and finance your business acquisition. Smart matching, financing simulation and secure Data Room.',
    },
  },
  Valuations: {
    fr: {
      title: 'Valorisation d\'entreprise gratuite — Simulateur en ligne | Riviqo',
      description: 'Estimez la valeur de votre entreprise gratuitement avec 3 méthodes : multiples, DCF et patrimoniale. Résultat instantané.',
    },
    en: {
      title: 'Free business valuation — Online simulator | Riviqo',
      description: 'Estimate your business value for free with 3 methods: multiples, DCF and asset-based. Instant results.',
    },
    jsonLd: ['SoftwareApplication'],
  },
  Financing: {
    fr: {
      title: 'Simulateur de financement d\'acquisition — Gratuit | Riviqo',
      description: 'Simulez votre plan de financement d\'acquisition : capacité d\'emprunt, DSCR, trésorerie post-reprise. Outil 100% gratuit.',
    },
    en: {
      title: 'Acquisition financing simulator — Free | Riviqo',
      description: 'Simulate your acquisition financing plan: borrowing capacity, DSCR, post-acquisition cash flow. 100% free tool.',
    },
    jsonLd: ['SoftwareApplication'],
  },
  Targeting: {
    fr: {
      title: 'Produit net de cession — Simulateur fiscal gratuit | Riviqo',
      description: 'Calculez votre produit net après impôts sur la cession : PFU vs barème progressif, abattements, plus-values.',
    },
    en: {
      title: 'Net sale proceeds — Free tax simulator | Riviqo',
      description: 'Calculate your net proceeds after sale taxes: flat tax vs progressive scale, allowances, capital gains.',
    },
    jsonLd: ['SoftwareApplication'],
  },
  Pricing: {
    fr: {
      title: 'Tarifs — Annonces et accompagnement M&A | Riviqo',
      description: 'Publiez gratuitement votre annonce. Options à la carte et accompagnement Advisory sur mesure pour votre cession ou reprise.',
    },
    en: {
      title: 'Pricing — Listings and M&A advisory | Riviqo',
      description: 'Publish your listing for free. À la carte options and custom Advisory support for your sale or acquisition.',
    },
  },
  SmartMatchingFeatures: {
    fr: {
      title: 'SmartMatching — Matching cédant-repreneur intelligent | Riviqo',
      description: 'Algorithme de mise en relation entre vendeurs et acheteurs d\'entreprise. Score de compatibilité sur 12 critères.',
    },
    en: {
      title: 'SmartMatching — Intelligent seller-buyer matching | Riviqo',
      description: 'Algorithm connecting business sellers and buyers. Compatibility score across 12 criteria.',
    },
  },
  Blog: {
    fr: {
      title: 'Blog — Actualités et guides cession & reprise | Riviqo',
      description: 'Articles, guides et conseils d\'experts pour réussir votre cession ou reprise d\'entreprise. Contenus gratuits et actualisés.',
    },
    en: {
      title: 'Blog — News and guides for business sale & acquisition | Riviqo',
      description: 'Articles, guides and expert advice to succeed in your business sale or acquisition. Free and updated content.',
    },
    jsonLd: ['Blog'],
  },
  GuideCession: {
    fr: {
      title: 'Guide complet de la cession d\'entreprise | Riviqo',
      description: 'Tout savoir pour vendre votre entreprise : préparation, valorisation, timing, négociation et fiscalité. Guide gratuit.',
    },
    en: {
      title: 'Complete guide to selling a business | Riviqo',
      description: 'Everything you need to know to sell your business: preparation, valuation, timing, negotiation and taxation. Free guide.',
    },
    jsonLd: ['Article'],
  },
  GuideRepreneur: {
    fr: {
      title: 'Guide complet de la reprise d\'entreprise | Riviqo',
      description: 'Du projet au closing : sourcing, due diligence, financement et négociation. Guide gratuit pour repreneurs.',
    },
    en: {
      title: 'Complete guide to buying a business | Riviqo',
      description: 'From project to closing: sourcing, due diligence, financing and negotiation. Free guide for buyers.',
    },
    jsonLd: ['Article'],
  },
  GuideRepreneuriat: {
    fr: {
      title: 'Le repreneuriat : devenir entrepreneur par la reprise d\'entreprise | Riviqo',
      description: 'Guide complet du repreneuriat : définition, avantages vs création, profil du repreneur idéal, étapes clés, financement et erreurs à éviter. Tout savoir pour entreprendre par la reprise.',
    },
    en: {
      title: 'Entrepreneurship through acquisition: the complete guide | Riviqo',
      description: 'Complete ETA guide: definition, advantages vs startup, ideal buyer profile, key steps, financing and mistakes to avoid. Everything you need to know about acquiring a business.',
    },
    jsonLd: ['Article'],
  },
  Expert: {
    fr: {
      title: 'Espace professionnels M&A — Réseau Riviqo',
      description: 'Cabinets M&A, experts-comptables, avocats d\'affaires : gérez vos mandats de cession et reprise sur Riviqo.',
    },
    en: {
      title: 'M&A professionals space — Riviqo Network',
      description: 'M&A firms, accountants, business lawyers: manage your sale and acquisition mandates on Riviqo.',
    },
  },
  FAQ: {
    fr: {
      title: 'Questions fréquentes — Cession et reprise | Riviqo',
      description: 'Réponses à toutes vos questions sur la cession, la reprise d\'entreprise et les outils Riviqo.',
    },
    en: {
      title: 'Frequently asked questions — Sale and acquisition | Riviqo',
      description: 'Answers to all your questions about business sale, acquisition and Riviqo tools.',
    },
    jsonLd: ['FAQPage'],
  },
  Contact: {
    fr: {
      title: 'Nous contacter — Riviqo',
      description: 'Contactez l\'équipe Riviqo pour un projet de cession, de reprise d\'entreprise ou pour rejoindre notre réseau.',
    },
    en: {
      title: 'Contact us — Riviqo',
      description: 'Contact the Riviqo team for a business sale, acquisition project or to join our network.',
    },
  },
  Outils: {
    fr: {
      title: 'Outils gratuits de simulation — Valorisation, financement, cession | Riviqo',
      description: '3 simulateurs gratuits : valorisation d\'entreprise, financement d\'acquisition, produit net de cession.',
    },
    en: {
      title: 'Free simulation tools — Valuation, financing, sale | Riviqo',
      description: '3 free simulators: business valuation, acquisition financing, net sale proceeds.',
    },
  },
  Dataroom: {
    fr: {
      title: 'Data Room sécurisée pour cession d\'entreprise | Riviqo',
      description: 'Partagez vos documents confidentiels en toute sécurité. Data Room certifiée pour vos opérations M&A.',
    },
    en: {
      title: 'Secure Data Room for business sale | Riviqo',
      description: 'Share your confidential documents securely. Certified Data Room for your M&A operations.',
    },
  },
  MentionsLegales: {
    fr: {
      title: 'Mentions légales | Riviqo',
      description: 'Mentions légales de Riviqo : éditeur, hébergeur, propriété intellectuelle et conditions d\'utilisation.',
    },
    en: {
      title: 'Legal notice | Riviqo',
      description: 'Riviqo legal notice: publisher, hosting, intellectual property and terms of use.',
    },
  },
  CGU: {
    fr: {
      title: 'Conditions générales d\'utilisation | Riviqo',
      description: 'Conditions générales d\'utilisation de la plateforme Riviqo. Droits, obligations et responsabilités.',
    },
    en: {
      title: 'Terms and conditions | Riviqo',
      description: 'Riviqo platform terms and conditions. Rights, obligations and responsibilities.',
    },
  },
  PolitiqueConfidentialite: {
    fr: {
      title: 'Politique de confidentialité | Riviqo',
      description: 'Politique de confidentialité et protection des données personnelles de Riviqo. Conforme au RGPD.',
    },
    en: {
      title: 'Privacy policy | Riviqo',
      description: 'Riviqo privacy policy and personal data protection. GDPR compliant.',
    },
  },
  Partners: {
    fr: {
      title: 'Partenaires — Cabinets M&A, avocats, investisseurs | Riviqo',
      description: 'Rejoignez le réseau de partenaires Riviqo : cabinets M&A, avocats d\'affaires, investisseurs, experts-comptables et banques. Accédez aux opportunités de transmission d\'entreprise.',
    },
    en: {
      title: 'Partners — M&A firms, lawyers, investors | Riviqo',
      description: 'Join the Riviqo partner network: M&A firms, business lawyers, investors, accountants and banks. Access business transfer opportunities.',
    },
  },
};

export const NOINDEX_PAGES = [
  'Login', 'Register', 'AccountCreation', 'PasswordReset', 'AuthCallback', 'Checkout',
  'Messages', 'Settings', 'Profile', 'CreateBusiness', 'MyListings', 'MyLeads',
  'Leads', 'Favorites', 'Billing', 'Abonnement', 'SmartMatching', 'SmartMatchingNotifications',
  'Categories', 'Annonces', 'BusinessDetails',
];

export function getJsonLdOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Riviqo',
    url: BASE_URL,
    logo: `${BASE_URL}/riviqo-logo.png`,
    description: 'Solution de cession et reprise d\'entreprise en France et en Europe',
    sameAs: [
      'https://www.linkedin.com/company/riviqo',
      'https://twitter.com/riviqo',
    ],
  };
}

export function getJsonLdWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Riviqo',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/Annonces?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getJsonLdSoftwareApp(name, description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
  };
}

export function getJsonLdArticle(title, description, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    author: {
      '@type': 'Organization',
      name: 'Riviqo',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Riviqo',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/riviqo-logo.png`,
      },
    },
  };
}

export function getJsonLdBlog() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog Riviqo',
    description: 'Articles, guides et conseils d\'experts pour la cession et reprise d\'entreprise',
    url: `${BASE_URL}/Blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Riviqo',
    },
  };
}

export function getJsonLdFAQ(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}
