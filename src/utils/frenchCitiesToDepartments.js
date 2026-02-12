/**
 * French Cities to Departments Mapping
 * Maps major French cities to their department numbers
 */

const FRENCH_CITIES_TO_DEPARTMENTS = {
  // Île-de-France
  'paris': '75',
  'versailles': '78',
  'boulogne': '92',
  'neuilly': '92',
  'vincennes': '94',
  'montsouris': '75',
  'créteil': '94',
  'fontenay': '94',
  'chatou': '78',
  'rueil': '92',
  'nanterre': '92',
  'la défense': '92',
  'levallois': '92',
  'courbevoie': '92',
  'puteaux': '92',
  'suresnes': '92',
  'melun': '77',
  'évry': '91',
  'corbeil': '91',

  // Provence-Alpes-Côte d'Azur
  'marseille': '13',
  'nice': '06',
  'cannes': '06',
  'toulon': '83',
  'aix': '13',
  'avignon': '84',
  'antibes': '06',
  'grasse': '06',
  'mougins': '06',

  // Auvergne-Rhône-Alpes
  'lyon': '69',
  'grenoble': '38',
  'saint-étienne': '42',
  'clermont': '63',
  'valence': '26',
  'annecy': '74',
  'chambéry': '73',
  'villeurbanne': '69',
  'vilefrance': '69',

  // Nouvelle-Aquitaine
  'bordeaux': '33',
  'poitiers': '86',
  'limoges': '87',
  'angoulême': '16',
  'périgueux': '24',
  'biarritz': '64',
  'bayonne': '64',
  'pau': '64',
  'cognac': '16',
  'la rochelle': '17',

  // Occitanie
  'toulouse': '31',
  'montpellier': '34',
  'nîmes': '30',
  'albi': '81',
  'perpignan': '66',
  'béziers': '34',
  'carcassonne': '11',
  'castres': '81',
  'cahors': '46',

  // Hauts-de-France
  'lille': '59',
  'amiens': '80',
  'roubaix': '59',
  'tourcoing': '59',
  'valenciennes': '59',
  'compiègne': '60',
  'lens': '62',
  'douai': '59',

  // Grand Est
  'strasbourg': '67',
  'metz': '57',
  'nancy': '54',
  'reims': '51',
  'troyes': '10',
  'mulhouse': '68',
  'colmar': '68',
  'épinal': '88',

  // Bourgogne-Franche-Comté
  'dijon': '21',
  'besançon': '25',
  'chalon': '71',
  'auxerre': '89',
  'montluçon': '03',
  'nevers': '58',

  // Normandie
  'rouen': '76',
  'caen': '14',
  'le havre': '76',
  'cherbourg': '50',
  'alençon': '61',
  'évreux': '27',

  // Bretagne
  'rennes': '35',
  'brest': '29',
  'quimper': '29',
  'vannes': '56',
  'saint-brieuc': '22',
  'lorient': '56',

  // Pays de la Loire
  'nantes': '44',
  'angers': '49',
  'le mans': '72',
  'laval': '53',
  'cholet': '49',
  'saint-nazaire': '44',
  'saint-herblain': '44',

  // Centre-Val de Loire
  'orléans': '45',
  'tours': '37',
  'chartres': '28',
  'bourges': '18',
  'blois': '41',
  'châteauroux': '36',

  // Corse
  'ajaccio': '2a',
  'bastia': '2b',
  'corte': '2b',
  'bonifacio': '2a',
};

/**
 * Get the department for a French city
 * @param {string} cityName - The city name to look up
 * @returns {string|null} - The department number or null if not found
 */
export function getDepartmentForFrenchCity(cityName) {
  if (!cityName) return null;
  
  const normalized = cityName.toLowerCase().trim();
  
  // Direct match
  if (FRENCH_CITIES_TO_DEPARTMENTS[normalized]) {
    return FRENCH_CITIES_TO_DEPARTMENTS[normalized];
  }
  
  // Partial match (for partial city names)
  for (const [city, department] of Object.entries(FRENCH_CITIES_TO_DEPARTMENTS)) {
    if (city.includes(normalized) || normalized.includes(city)) {
      return department;
    }
  }
  
  return null;
}

export default {
  getDepartmentForFrenchCity,
  FRENCH_CITIES_TO_DEPARTMENTS,
};
