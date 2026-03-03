// Default images for each business sector (hosted locally)
export const DEFAULT_IMAGES = {
  technology: '/images/sectors/technology.jpg',
  retail: '/images/sectors/retail.jpg',
  hospitality: '/images/sectors/hospitality.jpg',
  manufacturing: '/images/sectors/manufacturing.jpg',
  services: '/images/sectors/services.jpg',
  healthcare: '/images/sectors/healthcare.jpg',
  construction: '/images/sectors/construction.jpg',
  transport: '/images/sectors/transport.jpg',
  agriculture: '/images/sectors/agriculture.jpg',
  real_estate: '/images/sectors/real_estate.jpg',
  finance: '/images/sectors/finance.jpg',
  ecommerce: '/images/sectors/ecommerce.jpg',
  beauty: '/images/sectors/beauty.jpg',
  education: '/images/sectors/education.jpg',
  events: '/images/sectors/events.jpg',
  logistics: '/images/sectors/logistics.jpg',
  food_beverage: '/images/sectors/food_beverage.jpg',
  automotive: '/images/sectors/automotive.jpg',
  energy: '/images/sectors/energy.jpg',
  media: '/images/sectors/media.jpg',
  telecom: '/images/sectors/telecom.jpg',
  legal: '/images/sectors/legal.jpg',
  consulting: '/images/sectors/consulting.jpg',
  sports_fitness: '/images/sectors/sports_fitness.jpg',
  tourism: '/images/sectors/tourism.jpg',
  luxury: '/images/sectors/luxury.jpg',
  pharma: '/images/sectors/pharma.jpg',
  crafts: '/images/sectors/crafts.jpg',
  other: '/images/sectors/other.jpg'
};

// Mapping des noms de secteurs français (importés depuis les partenaires) vers les clés anglaises
const SECTOR_FR_TO_KEY = {
  // Hospitalité / Restauration
  'restaurant': 'hospitality',
  'restauration rapide': 'hospitality',
  'crêperie - pizzeria': 'hospitality',
  'bar - brasserie - tabac': 'hospitality',
  'hôtel - hôtel restaurant': 'hospitality',
  'hôtellerie': 'hospitality',
  "chambres d'hôtes - gîtes": 'hospitality',
  'camping': 'hospitality',
  'salon de thé': 'hospitality',
  'traiteur': 'food_beverage',
  'club - discothèque': 'events',

  // Commerce / Retail
  'bijouterie - horlogerie': 'retail',
  'bijouterie / horlogerie / optique': 'retail',
  'habillement - textile': 'retail',
  'chaussure - cuir': 'retail',
  'mobilier - décoration': 'retail',
  'meubles / décorations': 'retail',
  'librairie - papeterie': 'retail',
  'cadeaux - fleurs': 'retail',
  'alimentation': 'retail',
  'boucherie - charcuterie': 'retail',
  'boulangerie - pâtisserie': 'retail',
  'electroménager': 'retail',
  'equipement de la maison': 'retail',
  'tabac - presse - loto': 'retail',
  'divers commerces': 'retail',
  'animalerie - chasse - pêche': 'retail',
  'parfumeries / cosmétiques': 'beauty',

  // Construction / BTP
  'btp': 'construction',
  'maçonnerie': 'construction',
  'carrelage - maçonnerie': 'construction',
  'charpente - menuiserie': 'construction',
  'peinture - vitrerie - plâtrerie': 'construction',
  'plomberie - chauffage': 'construction',
  'plomberie, chauffage et climatisation': 'construction',
  'serrurerie métallerie': 'construction',
  'electricité - electronique': 'construction',
  'electricité et domotique': 'construction',
  'entreprise générale du bâtiment': 'construction',
  'autre activité de construction': 'construction',
  'autre activité de second oeuvre': 'construction',
  'construction de bâtiments publics ou industriels': 'construction',
  'construction de maisons individuelles': 'construction',
  'aménagements urbains et paysagers': 'construction',
  'terrassement et préparation de sites': 'construction',
  "génie civil et ouvrage d'art": 'construction',
  'cloisons, plâtrerie et isolation': 'construction',
  'menuiserie bois': 'construction',
  'menuiserie intérieure et extérieure': 'construction',
  'peinture, revêtements et finitions': 'construction',
  'autres travaux publics': 'construction',
  'autres production et bâtiment': 'construction',

  // Industrie / Manufacturing
  'mécanique - métallurgie': 'manufacturing',
  'mécanique de précision': 'manufacturing',
  'fabrication': 'manufacturing',
  "fabrication d'articles en bois": 'manufacturing',
  'fabrication de bateaux': 'manufacturing',
  'fabrication de structures métalliques': 'manufacturing',
  'fabrication de vêtements': 'manufacturing',
  'chaudronnerie / produits métalliques': 'manufacturing',
  'plastiques et caoutchouc': 'manufacturing',
  'divers industrie': 'manufacturing',
  'autres activités de travail du bois': 'manufacturing',
  'autres produits finis': 'manufacturing',
  "biens d'équipement": 'manufacturing',
  'biens de consommation': 'manufacturing',
  'fab / distrib. de fournitures et équipements industriels': 'manufacturing',
  'fab / distrib. de matériel agricole': 'agriculture',
  'fab / distrib. équipement de la maison': 'retail',
  'fab / distribution de piscines': 'construction',

  // Transport
  'transport - logistique': 'transport',
  'transport routier': 'transport',
  'autocars': 'transport',
  'taxi': 'transport',
  'messageries': 'transport',

  // Logistique
  'entrepôt - logistique': 'logistics',
  'logistique': 'logistics',

  // Technologie / IT
  'informatique - multimédia': 'technology',
  'développement applications': 'technology',
  'logiciels b2b': 'technology',
  'esn généraliste': 'technology',
  'web agency': 'technology',
  'constructeurs matériel informatique': 'technology',
  'matériel informatique': 'technology',
  'portails internet': 'technology',
  'réseaux et infrastructures': 'technology',
  'e-commerce': 'ecommerce',

  // Immobilier
  'agence immobilière': 'real_estate',
  'agents immobiliers': 'real_estate',

  // Agriculture
  'agriculture - viticulture': 'agriculture',
  'culture de fruits et légumes': 'agriculture',

  // Agroalimentaire
  'agroalimentaire': 'food_beverage',
  'production de viande et charcuterie': 'food_beverage',
  'négoce de mat. premières alimentaires': 'food_beverage',
  'autres activités agroalimentaires': 'food_beverage',

  // Automobile
  'garage - station service': 'automotive',
  'vente de véhicules automobiles': 'automotive',
  'vente de motos': 'automotive',
  'construction de motos': 'automotive',

  // Beauté
  'beauté - esthétique - coiffure': 'beauty',

  // Santé
  'santé - optique': 'healthcare',
  'pharmacie - parapharmacie': 'pharma',
  "pharmacies et ventes d'articles médicaux": 'pharma',
  'maisons de retraite': 'healthcare',

  // Energie
  'hydrocarbures': 'energy',
  'combustibles': 'energy',

  // Média
  'edition': 'media',
  'agences com /  pub / marketing': 'media',

  // Services
  'divers services': 'services',
  'nettoyage - laverie - pressing': 'services',
  'dépannage - réparation': 'services',
  'services globaux': 'services',
  'conseil': 'consulting',
  'recrutement / travail temporaire': 'services',

  // Tourisme
  'loisirs - tourisme': 'tourism',
  'tour opérators': 'tourism',

  // Sport
  'club de sport - salle de gym': 'sports_fitness',

  // Ingénierie
  'ingénierie / études techniques': 'consulting',

  // Juridique
  'brevet': 'legal',

  // Négoce
  'négoce de mat. premières non alimentaires': 'other',
  'fournitures / consommables': 'other',
  'matériel': 'other',
  'autres': 'other',

  // Formation / Éducation
  'formation professionnelle': 'education',
  'formation': 'education',
  'organisme de formation': 'education',

  // Nettoyage / Services
  'nettoyage et entretien': 'services',
  'aide à domicile': 'services',
  'sécurité / gardiennage': 'services',
  'services aux entreprises': 'services',
  'services à la personne': 'services',

  // Comptabilité / Conseil
  'cabinet comptable': 'consulting',
  'conseil / audit': 'consulting',
  'expertise comptable': 'consulting',

  // Assurance / Finance
  'assurance': 'finance',
  'courtage': 'finance',
  'courtage en assurance': 'finance',

  // Biotechnologie / Pharma
  'biotechnologie': 'pharma',

  // Énergie
  'energies renouvelables': 'energy',
  'énergies renouvelables': 'energy',

  // Sport
  'club sportif': 'sports_fitness',

  // Transformation / Manufacturing
  'transformation': 'manufacturing',
  'usinage': 'manufacturing',

  // Télécom
  'opérateur télécom': 'telecom',

  // ESN / IT
  'esn généraliste': 'technology',
  'logiciels b2b': 'technology',
};

export const getDefaultImageForSector = (sector) => {
  if (!sector) return DEFAULT_IMAGES.other;
  // Correspondance directe (clé anglaise canonique)
  if (DEFAULT_IMAGES[sector]) return DEFAULT_IMAGES[sector];
  // Correspondance via mapping français
  const normalized = sector.toLowerCase().trim();
  if (DEFAULT_IMAGES[normalized]) return DEFAULT_IMAGES[normalized];
  const key = SECTOR_FR_TO_KEY[normalized];
  if (key && DEFAULT_IMAGES[key]) return DEFAULT_IMAGES[key];
  return DEFAULT_IMAGES.other;
};
