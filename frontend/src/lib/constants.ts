export const BRAND = {
  name: 'Pyra Wood',
  tagline: 'Artisan Wood Furniture, Crafted for Life',
  description:
    'Premium handcrafted wood furniture designed with natural beauty and built to last generations.',
  colors: {
    walnut: '#5C4033',
    cream: '#FDF6EC',
    charcoal: '#2D2D2D',
    forest: '#2D5A3D',
    gold: '#C8963E',
    ivory: '#FEFCF7',
    sand: '#F5F0E8',
  },
} as const;

export const PYRA_WOOD_CATEGORIES = [
  {
    name: 'Living Room',
    slug: 'living-room',
    description: 'Handcrafted sofas, coffee tables, and TV stands',
  },
  {
    name: 'Dining',
    slug: 'dining',
    description: 'Solid wood dining tables, chairs, and benches',
  },
  {
    name: 'Bedroom',
    slug: 'bedroom',
    description: 'Premium beds, nightstands, and dressers',
  },
  {
    name: 'Office',
    slug: 'office',
    description: 'Artisan desks and bookshelves for your workspace',
  },
  {
    name: 'Outdoor',
    slug: 'outdoor',
    description: 'Weather-resistant garden furniture',
  },
  {
    name: 'Decor',
    slug: 'decor',
    description: 'Mirrors, wall shelves, and coat racks',
  },
] as const;
