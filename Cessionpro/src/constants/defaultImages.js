// Default images for each business sector
export const DEFAULT_IMAGES = {
  technology: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  retail: 'https://images.unsplash.com/photo-1555697453-6076da863fc0?w=800&h=600&fit=crop',
  hospitality: 'https://images.unsplash.com/photo-1504674900769-262351b63d5f?w=800&h=600&fit=crop',
  manufacturing: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop',
  services: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  healthcare: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=800&h=600&fit=crop',
  construction: 'https://images.unsplash.com/photo-1581092915550-e323be2ae537?w=800&h=600&fit=crop',
  transport: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
  agriculture: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop',
  real_estate: 'https://images.unsplash.com/photo-1570129477492-45c003d96e5f?w=800&h=600&fit=crop',
  finance: 'https://images.unsplash.com/photo-1552821206-b1933bead282?w=800&h=600&fit=crop',
  ecommerce: 'https://images.unsplash.com/photo-1460925895917-aeb19be489c7?w=800&h=600&fit=crop',
  beauty: 'https://images.unsplash.com/photo-1596462502278-af96dc8b8e80?w=800&h=600&fit=crop',
  education: 'https://images.unsplash.com/photo-1427504494785-cdebf40d3fa0?w=800&h=600&fit=crop',
  events: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop',
  logistics: 'https://images.unsplash.com/photo-1571996589235-f0b4ad333fb4?w=800&h=600&fit=crop',
  food_beverage: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop',
  other: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
};

export const getDefaultImageForSector = (sector) => {
  return DEFAULT_IMAGES[sector] || DEFAULT_IMAGES.other;
};
