// List of European countries for autocomplete
export const EUROPEAN_COUNTRIES = [
  { value: 'france', label: 'France' },
  { value: 'germany', label: 'Allemagne' },
  { value: 'italy', label: 'Italie' },
  { value: 'spain', label: 'Espagne' },
  { value: 'portugal', label: 'Portugal' },
  { value: 'netherlands', label: 'Pays-Bas' },
  { value: 'belgium', label: 'Belgique' },
  { value: 'luxembourg', label: 'Luxembourg' },
  { value: 'switzerland', label: 'Suisse' },
  { value: 'austria', label: 'Autriche' },
  { value: 'czech', label: 'Tchéquie' },
  { value: 'poland', label: 'Pologne' },
  { value: 'hungary', label: 'Hongrie' },
  { value: 'romania', label: 'Roumanie' },
  { value: 'bulgaria', label: 'Bulgarie' },
  { value: 'greece', label: 'Grèce' },
  { value: 'croatia', label: 'Croatie' },
  { value: 'serbia', label: 'Serbie' },
  { value: 'slovenia', label: 'Slovénie' },
  { value: 'slovakia', label: 'Slovaquie' },
  { value: 'denmark', label: 'Danemark' },
  { value: 'sweden', label: 'Suède' },
  { value: 'norway', label: 'Norvège' },
  { value: 'finland', label: 'Finlande' },
  { value: 'ireland', label: 'Irlande' },
  { value: 'uk', label: 'Royaume-Uni' },
  { value: 'iceland', label: 'Islande' },
  { value: 'malta', label: 'Malte' },
  { value: 'cyprus', label: 'Chypre' },
  { value: 'estonia', label: 'Estonie' },
  { value: 'latvia', label: 'Lettonie' },
  { value: 'lithuania', label: 'Lituanie' },
];

export const getCountryLabel = (value) => {
  const country = EUROPEAN_COUNTRIES.find(c => c.value === value);
  return country ? country.label : value;
};

export const searchCountries = (query) => {
  if (!query) return EUROPEAN_COUNTRIES;
  
  const lowerQuery = query.toLowerCase();
  return EUROPEAN_COUNTRIES.filter(
    country => 
      country.label.toLowerCase().includes(lowerQuery) ||
      country.value.toLowerCase().includes(lowerQuery)
  );
};
