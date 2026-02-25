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

export const getDefaultImageForSector = (sector) => {
  return DEFAULT_IMAGES[sector] || DEFAULT_IMAGES.other;
};
