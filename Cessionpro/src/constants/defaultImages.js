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
  other: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
};

export const getDefaultImageForSector = (sector) => {
  return DEFAULT_IMAGES[sector] || DEFAULT_IMAGES.other;
};
