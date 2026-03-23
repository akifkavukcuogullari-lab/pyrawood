export const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const;
export const USER_ROLES = ['customer', 'admin'] as const;
export const PRODUCT_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' },
  { value: 'rating', label: 'Top Rated' },
] as const;
export const PYRA_WOOD_CATEGORIES = [
  { name: 'Living Room', slug: 'living-room', description: 'Handcrafted sofas, coffee tables, and TV stands' },
  { name: 'Dining', slug: 'dining', description: 'Solid wood dining tables, chairs, and benches' },
  { name: 'Bedroom', slug: 'bedroom', description: 'Premium beds, nightstands, and dressers' },
  { name: 'Office', slug: 'office', description: 'Artisan desks and bookshelves for your workspace' },
  { name: 'Outdoor', slug: 'outdoor', description: 'Weather-resistant garden furniture' },
  { name: 'Decor', slug: 'decor', description: 'Mirrors, wall shelves, and coat racks' },
] as const;
export const BRAND = {
  name: 'Pyra Wood',
  tagline: 'Artisan Wood Furniture, Crafted for Life',
  description: 'Premium handcrafted wood furniture designed with natural beauty and built to last generations.',
  colors: { walnut: '#5C4033', cream: '#FDF6EC', charcoal: '#2D2D2D', forest: '#2D5A3D', gold: '#C8963E', ivory: '#FEFCF7', sand: '#F5F0E8' },
} as const;
export const PAGINATION_DEFAULTS = { page: 1, limit: 12 } as const;
