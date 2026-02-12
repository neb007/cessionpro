/**
 * French Cities to Regions Mapping
 * Maps major French cities to their administrative regions for auto-completion
 */

const FRENCH_CITIES_TO_REGIONS = {
  // Île-de-France
  'paris': 'Île-de-France',
  'versailles': 'Île-de-France',
  'boulogne': 'Île-de-France',
  'neuilly': 'Île-de-France',
  'vincennes': 'Île-de-France',
  'montsouris': 'Île-de-France',
  'créteil': 'Île-de-France',
  'fontenay': 'Île-de-France',
  'chatou': 'Île-de-France',
  'rueil': 'Île-de-France',
  'nanterre': 'Île-de-France',
  'la défense': 'Île-de-France',
  'levallois': 'Île-de-France',
  'courbevoie': 'Île-de-France',
  'puteaux': 'Île-de-France',
  'suresnes': 'Île-de-France',
  
  // Provence-Alpes-Côte d'Azur
  'marseille': 'Provence-Alpes-Côte d\'Azur',
  'nice': 'Provence-Alpes-Côte d\'Azur',
  'cannes': 'Provence-Alpes-Côte d\'Azur',
  'toulon': 'Provence-Alpes-Côte d\'Azur',
  'aix': 'Provence-Alpes-Côte d\'Azur',
  'avignon': 'Provence-Alpes-Côte d\'Azur',
  'antibes': 'Provence-Alpes-Côte d\'Azur',
  'grasse': 'Provence-Alpes-Côte d\'Azur',
  'mougins': 'Provence-Alpes-Côte d\'Azur',
  
  // Auvergne-Rhône-Alpes
  'lyon': 'Auvergne-Rhône-Alpes',
  'grenoble': 'Auvergne-Rhône-Alpes',
  'saint-étienne': 'Auvergne-Rhône-Alpes',
  'clermont': 'Auvergne-Rhône-Alpes',
  'valence': 'Auvergne-Rhône-Alpes',
  'annecy': 'Auvergne-Rhône-Alpes',
  'chambéry': 'Auvergne-Rhône-Alpes',
  'villeurbanne': 'Auvergne-Rhône-Alpes',
  'vilefrance': 'Auvergne-Rhône-Alpes',
  
  // Nouvelle-Aquitaine
  'bordeaux': 'Nouvelle-Aquitaine',
  'poitiers': 'Nouvelle-Aquitaine',
  'limoges': 'Nouvelle-Aquitaine',
  'angoulême': 'Nouvelle-Aquitaine',
  'périgueux': 'Nouvelle-Aquitaine',
  'biarritz': 'Nouvelle-Aquitaine',
  'bayonne': 'Nouvelle-Aquitaine',
  'pau': 'Nouvelle-Aquitaine',
  'cognac': 'Nouvelle-Aquitaine',
  'la rochelle': 'Nouvelle-Aquitaine',
  
  // Occitanie
  'toulouse': 'Occitanie',
  'montpellier': 'Occitanie',
  'nîmes': 'Occitanie',
  'albi': 'Occitanie',
  'perpignan': 'Occitanie',
  'béziers': 'Occitanie',
  'carcassonne': 'Occitanie',
  'castres': 'Occitanie',
  'cahors': 'Occitanie',
  
  // Hauts-de-France
  'lille': 'Hauts-de-France',
  'amiens': 'Hauts-de-France',
  'roubaix': 'Hauts-de-France',
  'tourcoing': 'Hauts-de-France',
  'valenciennes': 'Hauts-de-France',
  'compiègne': 'Hauts-de-France',
  'lens': 'Hauts-de-France',
  'douai': 'Hauts-de-France',
  
  // Grand Est
  'strasbourg': 'Grand Est',
  'metz': 'Grand Est',
  'nancy': 'Grand Est',
  'reims': 'Grand Est',
  'troyes': 'Grand Est',
  'mulhouse': 'Grand Est',
  'colmar': 'Grand Est',
  'épinal': 'Grand Est',
  
  // Bourgogne-Franche-Comté
  'dijon': 'Bourgogne-Franche-Comté',
  'besançon': 'Bourgogne-Franche-Comté',
  'chalon': 'Bourgogne-Franche-Comté',
  'auxerre': 'Bourgogne-Franche-Comté',
  'montluçon': 'Bourgogne-Franche-Comté',
  'nevers': 'Bourgogne-Franche-Comté',
  
  // Normandie
  'rouen': 'Normandie',
  'caen': 'Normandie',
  'le havre': 'Normandie',
  'cherbourg': 'Normandie',
  'alençon': 'Normandie',
  'évreux': 'Normandie',
  
  // Bretagne
  'rennes': 'Bretagne',
  'brest': 'Bretagne',
  'quimper': 'Bretagne',
  'vannes': 'Bretagne',
  'saint-brieuc': 'Bretagne',
  'lorient': 'Bretagne',
  
  // Pays de la Loire
  'nantes': 'Pays de la Loire',
  'angers': 'Pays de la Loire',
  'le mans': 'Pays de la Loire',
  'laval': 'Pays de la Loire',
  'cholet': 'Pays de la Loire',
  'saint-nazaire': 'Pays de la Loire',
  'saint-herblain': 'Pays de la Loire',
  
  // Centre-Val de Loire
  'orléans': 'Centre-Val de Loire',
  'tours': 'Centre-Val de Loire',
  'chartres': 'Centre-Val de Loire',
  'bourges': 'Centre-Val de Loire',
  'blois': 'Centre-Val de Loire',
  'châteauroux': 'Centre-Val de Loire',
  
  // Corse
  'ajaccio': 'Corse',
  'bastia': 'Corse',
  'corte': 'Corse',
  'bonifacio': 'Corse',
  
  // Île-de-France (additional)
  'melun': 'Île-de-France',
  'évry': 'Île-de-France',
  'corbeil': 'Île-de-France',
  'thornay': 'Île-de-France',
  'moissy': 'Île-de-France',
};

/**
 * Get the region for a French city
 * @param {string} cityName - The city name to look up
 * @returns {string|null} - The region name or null if not found
 */
export function getRegionForFrenchCity(cityName) {
  if (!cityName) return null;
  
  const normalized = cityName.toLowerCase().trim();
  
  // Direct match
  if (FRENCH_CITIES_TO_REGIONS[normalized]) {
    return FRENCH_CITIES_TO_REGIONS[normalized];
  }
  
  // Partial match (for partial city names)
  for (const [city, region] of Object.entries(FRENCH_CITIES_TO_REGIONS)) {
    if (city.includes(normalized) || normalized.includes(city)) {
      return region;
    }
  }
  
  return null;
}

export default {
  getRegionForFrenchCity,
  FRENCH_CITIES_TO_REGIONS,
};
