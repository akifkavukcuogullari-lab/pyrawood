import { pool } from '../config/database';

interface ProductSeed {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categorySlug: string;
  sku: string;
  weight: number;
  stock: number;
  variants: {
    name: string;
    sku: string;
    price: number;
    stock: number;
    attributes: Record<string, string>;
  }[];
  images: {
    url: string;
    altText: string;
    sortOrder: number;
    isPrimary: boolean;
  }[];
}

function placeholderUrl(text: string): string {
  const encoded = text.replace(/\s+/g, '+');
  return `https://placehold.co/800x600/5C4033/FDF6EC?text=${encoded}`;
}

const PRODUCTS: ProductSeed[] = [
  // === LIVING ROOM (4) ===
  {
    name: 'Artisan Oak Coffee Table',
    slug: 'artisan-oak-coffee-table',
    description: 'A stunning centerpiece crafted from solid white oak with hand-rubbed oil finish. Features clean mid-century lines and dovetail joinery. Dimensions: 48"L x 24"W x 18"H.',
    price: 899,
    compareAtPrice: 1099,
    categorySlug: 'living-room',
    sku: 'PW-LR-001',
    weight: 22.5,
    stock: 15,
    variants: [
      { name: 'Oak Natural', sku: 'PW-LR-001-ON', price: 899, stock: 8, attributes: { wood: 'Oak', finish: 'Natural' } },
      { name: 'Oak Honey', sku: 'PW-LR-001-OH', price: 929, stock: 7, attributes: { wood: 'Oak', finish: 'Honey' } },
    ],
    images: [
      { url: placeholderUrl('Oak+Coffee+Table'), altText: 'Artisan Oak Coffee Table front view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Oak+Coffee+Detail'), altText: 'Artisan Oak Coffee Table joinery detail', sortOrder: 1, isPrimary: false },
      { url: placeholderUrl('Oak+Coffee+Side'), altText: 'Artisan Oak Coffee Table side angle', sortOrder: 2, isPrimary: false },
    ],
  },
  {
    name: 'Walnut TV Console',
    slug: 'walnut-tv-console',
    description: 'Sleek media console in American black walnut with soft-close drawers and cable management. Accommodates TVs up to 65 inches. Dimensions: 60"L x 18"W x 22"H.',
    price: 1499,
    compareAtPrice: null,
    categorySlug: 'living-room',
    sku: 'PW-LR-002',
    weight: 35.0,
    stock: 10,
    variants: [
      { name: 'Walnut Dark', sku: 'PW-LR-002-WD', price: 1499, stock: 5, attributes: { wood: 'Walnut', finish: 'Dark' } },
      { name: 'Walnut Natural', sku: 'PW-LR-002-WN', price: 1499, stock: 5, attributes: { wood: 'Walnut', finish: 'Natural' } },
    ],
    images: [
      { url: placeholderUrl('Walnut+TV+Console'), altText: 'Walnut TV Console front view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('TV+Console+Open'), altText: 'Walnut TV Console with drawers open', sortOrder: 1, isPrimary: false },
    ],
  },
  {
    name: 'Leather & Wood Armchair',
    slug: 'leather-wood-armchair',
    description: 'Classic lounge armchair combining solid ash frame with premium full-grain leather upholstery. Ergonomic seat angle provides all-day comfort. Seat height: 17 inches.',
    price: 1299,
    compareAtPrice: 1599,
    categorySlug: 'living-room',
    sku: 'PW-LR-003',
    weight: 18.0,
    stock: 12,
    variants: [
      { name: 'Ash & Tan Leather', sku: 'PW-LR-003-AT', price: 1299, stock: 6, attributes: { wood: 'Ash', finish: 'Tan Leather' } },
      { name: 'Ash & Black Leather', sku: 'PW-LR-003-AB', price: 1349, stock: 6, attributes: { wood: 'Ash', finish: 'Black Leather' } },
    ],
    images: [
      { url: placeholderUrl('Leather+Armchair'), altText: 'Leather & Wood Armchair front view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Armchair+Detail'), altText: 'Leather & Wood Armchair leather detail', sortOrder: 1, isPrimary: false },
    ],
  },
  {
    name: 'Reclaimed Wood Bookshelf',
    slug: 'reclaimed-wood-bookshelf',
    description: 'Industrial-style open bookshelf crafted from reclaimed barn wood and black steel framing. Each piece has unique patina and character. Dimensions: 36"W x 12"D x 72"H.',
    price: 799,
    compareAtPrice: null,
    categorySlug: 'living-room',
    sku: 'PW-LR-004',
    weight: 28.0,
    stock: 8,
    variants: [
      { name: 'Reclaimed Natural', sku: 'PW-LR-004-RN', price: 799, stock: 4, attributes: { wood: 'Reclaimed Pine', finish: 'Natural' } },
      { name: 'Reclaimed Weathered', sku: 'PW-LR-004-RW', price: 849, stock: 4, attributes: { wood: 'Reclaimed Pine', finish: 'Weathered Grey' } },
    ],
    images: [
      { url: placeholderUrl('Reclaimed+Bookshelf'), altText: 'Reclaimed Wood Bookshelf front view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Bookshelf+Styled'), altText: 'Reclaimed Wood Bookshelf styled with books', sortOrder: 1, isPrimary: false },
    ],
  },

  // === DINING (4) ===
  {
    name: 'Farmhouse Dining Table',
    slug: 'farmhouse-dining-table',
    description: 'Generously sized farmhouse table seats 8 comfortably. Built from kiln-dried white oak with breadboard ends to prevent warping. Dimensions: 84"L x 40"W x 30"H.',
    price: 2499,
    compareAtPrice: 2999,
    categorySlug: 'dining',
    sku: 'PW-DN-001',
    weight: 55.0,
    stock: 6,
    variants: [
      { name: 'Oak Natural', sku: 'PW-DN-001-ON', price: 2499, stock: 3, attributes: { wood: 'Oak', finish: 'Natural' } },
      { name: 'Oak Espresso', sku: 'PW-DN-001-OE', price: 2599, stock: 3, attributes: { wood: 'Oak', finish: 'Espresso' } },
    ],
    images: [
      { url: placeholderUrl('Farmhouse+Dining+Table'), altText: 'Farmhouse Dining Table top view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Dining+Table+Detail'), altText: 'Farmhouse Dining Table leg detail', sortOrder: 1, isPrimary: false },
      { url: placeholderUrl('Dining+Table+Set'), altText: 'Farmhouse Dining Table with place settings', sortOrder: 2, isPrimary: false },
    ],
  },
  {
    name: 'Windsor Dining Chair Set',
    slug: 'windsor-dining-chair-set',
    description: 'Set of two classically designed Windsor chairs with steam-bent spindles and sculpted seats. Each chair is hand-sanded to a satin smooth finish. Seat height: 18 inches.',
    price: 699,
    compareAtPrice: null,
    categorySlug: 'dining',
    sku: 'PW-DN-002',
    weight: 12.0,
    stock: 20,
    variants: [
      { name: 'Maple Natural', sku: 'PW-DN-002-MN', price: 699, stock: 10, attributes: { wood: 'Maple', finish: 'Natural' } },
      { name: 'Maple Black', sku: 'PW-DN-002-MB', price: 699, stock: 10, attributes: { wood: 'Maple', finish: 'Black' } },
    ],
    images: [
      { url: placeholderUrl('Windsor+Chair+Set'), altText: 'Windsor Dining Chair Set pair', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Windsor+Chair+Detail'), altText: 'Windsor Chair spindle detail', sortOrder: 1, isPrimary: false },
    ],
  },
  {
    name: 'Live Edge Serving Board',
    slug: 'live-edge-serving-board',
    description: 'Stunning live-edge walnut serving board perfect for charcuterie and entertaining. Finished with food-safe mineral oil. Approximately 24"L x 10"W x 1"H.',
    price: 199,
    compareAtPrice: null,
    categorySlug: 'dining',
    sku: 'PW-DN-003',
    weight: 2.5,
    stock: 50,
    variants: [
      { name: 'Walnut', sku: 'PW-DN-003-W', price: 199, stock: 25, attributes: { wood: 'Walnut', finish: 'Mineral Oil' } },
      { name: 'Cherry', sku: 'PW-DN-003-C', price: 219, stock: 25, attributes: { wood: 'Cherry', finish: 'Mineral Oil' } },
    ],
    images: [
      { url: placeholderUrl('Live+Edge+Board'), altText: 'Live Edge Serving Board top view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Serving+Board+Food'), altText: 'Live Edge Serving Board with food', sortOrder: 1, isPrimary: false },
    ],
  },
  {
    name: 'Rustic Dining Bench',
    slug: 'rustic-dining-bench',
    description: 'Solid construction dining bench that pairs perfectly with our farmhouse table. Thick plank seat with chamfered edges and sturdy trestle base. Dimensions: 60"L x 14"W x 18"H.',
    price: 599,
    compareAtPrice: 749,
    categorySlug: 'dining',
    sku: 'PW-DN-004',
    weight: 20.0,
    stock: 12,
    variants: [
      { name: 'Oak Natural', sku: 'PW-DN-004-ON', price: 599, stock: 6, attributes: { wood: 'Oak', finish: 'Natural' } },
      { name: 'Oak Espresso', sku: 'PW-DN-004-OE', price: 649, stock: 6, attributes: { wood: 'Oak', finish: 'Espresso' } },
    ],
    images: [
      { url: placeholderUrl('Rustic+Dining+Bench'), altText: 'Rustic Dining Bench front view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Dining+Bench+Side'), altText: 'Rustic Dining Bench side view', sortOrder: 1, isPrimary: false },
    ],
  },

  // === BEDROOM (4) ===
  {
    name: 'Platform Bed Frame',
    slug: 'platform-bed-frame',
    description: 'Minimalist platform bed with integrated headboard and hidden under-bed storage. Crafted from solid walnut with slatted base — no box spring needed. Queen size: 64"W x 86"L x 36"H.',
    price: 1899,
    compareAtPrice: null,
    categorySlug: 'bedroom',
    sku: 'PW-BD-001',
    weight: 48.0,
    stock: 8,
    variants: [
      { name: 'Walnut Queen', sku: 'PW-BD-001-WQ', price: 1899, stock: 4, attributes: { wood: 'Walnut', size: 'Queen' } },
      { name: 'Walnut King', sku: 'PW-BD-001-WK', price: 2099, stock: 4, attributes: { wood: 'Walnut', size: 'King' } },
    ],
    images: [
      { url: placeholderUrl('Platform+Bed'), altText: 'Platform Bed Frame front view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Platform+Bed+Side'), altText: 'Platform Bed Frame side angle', sortOrder: 1, isPrimary: false },
      { url: placeholderUrl('Platform+Bed+Detail'), altText: 'Platform Bed Frame headboard detail', sortOrder: 2, isPrimary: false },
    ],
  },
  {
    name: 'Floating Nightstand',
    slug: 'floating-nightstand',
    description: 'Wall-mounted floating nightstand with a single drawer and open shelf. Space-saving design with hidden mounting bracket system. Dimensions: 16"W x 12"D x 10"H.',
    price: 349,
    compareAtPrice: 429,
    categorySlug: 'bedroom',
    sku: 'PW-BD-002',
    weight: 5.5,
    stock: 25,
    variants: [
      { name: 'Walnut', sku: 'PW-BD-002-W', price: 349, stock: 10, attributes: { wood: 'Walnut', finish: 'Natural' } },
      { name: 'Oak', sku: 'PW-BD-002-O', price: 329, stock: 10, attributes: { wood: 'Oak', finish: 'Natural' } },
      { name: 'Cherry', sku: 'PW-BD-002-C', price: 369, stock: 5, attributes: { wood: 'Cherry', finish: 'Honey' } },
    ],
    images: [
      { url: placeholderUrl('Floating+Nightstand'), altText: 'Floating Nightstand mounted on wall', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Nightstand+Open'), altText: 'Floating Nightstand with drawer open', sortOrder: 1, isPrimary: false },
    ],
  },
  {
    name: 'Solid Wood Dresser',
    slug: 'solid-wood-dresser',
    description: 'Six-drawer dresser built entirely from solid maple with dovetailed drawers and soft-close slides. A timeless piece that will serve your family for generations. Dimensions: 60"W x 20"D x 34"H.',
    price: 2199,
    compareAtPrice: null,
    categorySlug: 'bedroom',
    sku: 'PW-BD-003',
    weight: 65.0,
    stock: 5,
    variants: [
      { name: 'Maple Natural', sku: 'PW-BD-003-MN', price: 2199, stock: 3, attributes: { wood: 'Maple', finish: 'Natural' } },
      { name: 'Maple Walnut Stain', sku: 'PW-BD-003-MW', price: 2299, stock: 2, attributes: { wood: 'Maple', finish: 'Walnut Stain' } },
    ],
    images: [
      { url: placeholderUrl('Wood+Dresser'), altText: 'Solid Wood Dresser front view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Dresser+Detail'), altText: 'Solid Wood Dresser drawer detail', sortOrder: 1, isPrimary: false },
    ],
  },
  {
    name: 'Canopy Bed Frame',
    slug: 'canopy-bed-frame',
    description: 'Elegant four-poster canopy bed with tapered posts and subtle grain patterns. Made from sustainably harvested ash. Accepts standard queen or king mattress. Queen: 66"W x 88"L x 80"H.',
    price: 3499,
    compareAtPrice: 4299,
    categorySlug: 'bedroom',
    sku: 'PW-BD-004',
    weight: 60.0,
    stock: 5,
    variants: [
      { name: 'Ash Natural Queen', sku: 'PW-BD-004-AQ', price: 3499, stock: 3, attributes: { wood: 'Ash', size: 'Queen' } },
      { name: 'Ash Natural King', sku: 'PW-BD-004-AK', price: 3799, stock: 2, attributes: { wood: 'Ash', size: 'King' } },
    ],
    images: [
      { url: placeholderUrl('Canopy+Bed'), altText: 'Canopy Bed Frame front view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Canopy+Bed+Detail'), altText: 'Canopy Bed Frame post detail', sortOrder: 1, isPrimary: false },
    ],
  },

  // === OFFICE (4) ===
  {
    name: 'Adjustable Standing Desk',
    slug: 'adjustable-standing-desk',
    description: 'Solid hardwood desktop on a smooth manual crank lift mechanism. Adjusts from 28" to 46" height for sitting or standing work. Desktop dimensions: 60"W x 30"D.',
    price: 1299,
    compareAtPrice: null,
    categorySlug: 'office',
    sku: 'PW-OF-001',
    weight: 38.0,
    stock: 10,
    variants: [
      { name: 'Walnut Top', sku: 'PW-OF-001-WT', price: 1299, stock: 5, attributes: { wood: 'Walnut', finish: 'Natural' } },
      { name: 'Oak Top', sku: 'PW-OF-001-OT', price: 1199, stock: 5, attributes: { wood: 'Oak', finish: 'Natural' } },
    ],
    images: [
      { url: placeholderUrl('Standing+Desk'), altText: 'Adjustable Standing Desk raised position', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Standing+Desk+Low'), altText: 'Adjustable Standing Desk sitting position', sortOrder: 1, isPrimary: false },
    ],
  },
  {
    name: 'Executive Bookshelf',
    slug: 'executive-bookshelf',
    description: 'Tall five-shelf bookcase with traditional crown molding and adjustable shelf heights. Hand-finished in rich cherry with brass shelf pins. Dimensions: 36"W x 14"D x 84"H.',
    price: 1599,
    compareAtPrice: 1899,
    categorySlug: 'office',
    sku: 'PW-OF-002',
    weight: 42.0,
    stock: 7,
    variants: [
      { name: 'Cherry Classic', sku: 'PW-OF-002-CC', price: 1599, stock: 4, attributes: { wood: 'Cherry', finish: 'Classic' } },
      { name: 'Walnut Dark', sku: 'PW-OF-002-WD', price: 1649, stock: 3, attributes: { wood: 'Walnut', finish: 'Dark' } },
    ],
    images: [
      { url: placeholderUrl('Executive+Bookshelf'), altText: 'Executive Bookshelf front view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Bookshelf+Detail'), altText: 'Executive Bookshelf molding detail', sortOrder: 1, isPrimary: false },
    ],
  },
  {
    name: 'Corner Computer Desk',
    slug: 'corner-computer-desk',
    description: 'L-shaped desk designed for corner placement to maximize workspace. Features built-in cable routing channels and a pull-out keyboard tray. Dimensions: 60"W x 60"D x 30"H.',
    price: 999,
    compareAtPrice: null,
    categorySlug: 'office',
    sku: 'PW-OF-003',
    weight: 32.0,
    stock: 9,
    variants: [
      { name: 'Oak Natural', sku: 'PW-OF-003-ON', price: 999, stock: 5, attributes: { wood: 'Oak', finish: 'Natural' } },
      { name: 'Oak Smoked', sku: 'PW-OF-003-OS', price: 1049, stock: 4, attributes: { wood: 'Oak', finish: 'Smoked' } },
    ],
    images: [
      { url: placeholderUrl('Corner+Desk'), altText: 'Corner Computer Desk front view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Corner+Desk+Setup'), altText: 'Corner Computer Desk with monitor setup', sortOrder: 1, isPrimary: false },
    ],
  },
  {
    name: 'Wooden Filing Cabinet',
    slug: 'wooden-filing-cabinet',
    description: 'Two-drawer lateral filing cabinet with full-extension drawer slides and anti-tip mechanism. Accepts letter and legal size folders. Dimensions: 30"W x 18"D x 28"H.',
    price: 749,
    compareAtPrice: null,
    categorySlug: 'office',
    sku: 'PW-OF-004',
    weight: 25.0,
    stock: 14,
    variants: [
      { name: 'Walnut', sku: 'PW-OF-004-W', price: 749, stock: 7, attributes: { wood: 'Walnut', finish: 'Natural' } },
      { name: 'Oak', sku: 'PW-OF-004-O', price: 699, stock: 7, attributes: { wood: 'Oak', finish: 'Natural' } },
    ],
    images: [
      { url: placeholderUrl('Filing+Cabinet'), altText: 'Wooden Filing Cabinet front view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Filing+Cabinet+Open'), altText: 'Wooden Filing Cabinet with drawer open', sortOrder: 1, isPrimary: false },
    ],
  },

  // === OUTDOOR (4) ===
  {
    name: 'Cedar Garden Bench',
    slug: 'cedar-garden-bench',
    description: 'Weather-resistant western red cedar bench with contoured seat and slatted back. Naturally rot-resistant without chemical treatments. Dimensions: 60"L x 22"D x 35"H.',
    price: 699,
    compareAtPrice: null,
    categorySlug: 'outdoor',
    sku: 'PW-OD-001',
    weight: 20.0,
    stock: 15,
    variants: [
      { name: 'Cedar Natural', sku: 'PW-OD-001-CN', price: 699, stock: 8, attributes: { wood: 'Cedar', finish: 'Natural' } },
      { name: 'Cedar Stained', sku: 'PW-OD-001-CS', price: 749, stock: 7, attributes: { wood: 'Cedar', finish: 'Outdoor Stain' } },
    ],
    images: [
      { url: placeholderUrl('Cedar+Garden+Bench'), altText: 'Cedar Garden Bench in garden setting', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Garden+Bench+Detail'), altText: 'Cedar Garden Bench grain detail', sortOrder: 1, isPrimary: false },
    ],
  },
  {
    name: 'Teak Patio Dining Set',
    slug: 'teak-patio-dining-set',
    description: 'Complete outdoor dining set including a round table and four folding chairs. Grade-A plantation teak with marine-grade stainless steel hardware. Table diameter: 48 inches.',
    price: 4999,
    compareAtPrice: null,
    categorySlug: 'outdoor',
    sku: 'PW-OD-002',
    weight: 45.0,
    stock: 5,
    variants: [
      { name: 'Teak Natural', sku: 'PW-OD-002-TN', price: 4999, stock: 3, attributes: { wood: 'Teak', finish: 'Natural' } },
      { name: 'Teak Weathered', sku: 'PW-OD-002-TW', price: 4999, stock: 2, attributes: { wood: 'Teak', finish: 'Weathered Silver' } },
    ],
    images: [
      { url: placeholderUrl('Teak+Patio+Set'), altText: 'Teak Patio Dining Set on patio', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Patio+Set+Close'), altText: 'Teak Patio Dining Set close-up', sortOrder: 1, isPrimary: false },
      { url: placeholderUrl('Patio+Chair+Detail'), altText: 'Teak folding chair detail', sortOrder: 2, isPrimary: false },
    ],
  },
  {
    name: 'Classic Adirondack Chair',
    slug: 'classic-adirondack-chair',
    description: 'Iconic Adirondack design with wide armrests and reclined seat. Built from thick-cut cypress with stainless steel fasteners. Seat width: 22 inches, height: 36 inches.',
    price: 449,
    compareAtPrice: 549,
    categorySlug: 'outdoor',
    sku: 'PW-OD-003',
    weight: 15.0,
    stock: 20,
    variants: [
      { name: 'Cypress Natural', sku: 'PW-OD-003-CN', price: 449, stock: 10, attributes: { wood: 'Cypress', finish: 'Natural' } },
      { name: 'Cypress White', sku: 'PW-OD-003-CW', price: 479, stock: 10, attributes: { wood: 'Cypress', finish: 'White Paint' } },
    ],
    images: [
      { url: placeholderUrl('Adirondack+Chair'), altText: 'Classic Adirondack Chair front view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Adirondack+Side'), altText: 'Classic Adirondack Chair side view', sortOrder: 1, isPrimary: false },
    ],
  },
  {
    name: 'Raised Garden Planter Box',
    slug: 'raised-garden-planter-box',
    description: 'Elevated planter box for herbs, flowers, or vegetables. Cedar construction with drainage holes and a shelf below for tools. Dimensions: 48"L x 24"W x 32"H.',
    price: 349,
    compareAtPrice: null,
    categorySlug: 'outdoor',
    sku: 'PW-OD-004',
    weight: 14.0,
    stock: 18,
    variants: [
      { name: 'Cedar Natural', sku: 'PW-OD-004-CN', price: 349, stock: 9, attributes: { wood: 'Cedar', finish: 'Natural' } },
      { name: 'Cedar Dark Stain', sku: 'PW-OD-004-CD', price: 379, stock: 9, attributes: { wood: 'Cedar', finish: 'Dark Stain' } },
    ],
    images: [
      { url: placeholderUrl('Garden+Planter'), altText: 'Raised Garden Planter Box with herbs', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Planter+Detail'), altText: 'Raised Garden Planter Box construction detail', sortOrder: 1, isPrimary: false },
    ],
  },

  // === DECOR (4) ===
  {
    name: 'Floating Wall Shelf Set',
    slug: 'floating-wall-shelf-set',
    description: 'Set of three staggered floating shelves with hidden mounting brackets. Crafted from solid hardwood with beveled edges. Sizes: 24", 20", and 16" lengths, each 6" deep.',
    price: 249,
    compareAtPrice: null,
    categorySlug: 'decor',
    sku: 'PW-DC-001',
    weight: 4.0,
    stock: 30,
    variants: [
      { name: 'Walnut', sku: 'PW-DC-001-W', price: 249, stock: 10, attributes: { wood: 'Walnut', finish: 'Natural' } },
      { name: 'Oak', sku: 'PW-DC-001-O', price: 229, stock: 10, attributes: { wood: 'Oak', finish: 'Natural' } },
      { name: 'Cherry', sku: 'PW-DC-001-C', price: 269, stock: 10, attributes: { wood: 'Cherry', finish: 'Honey' } },
    ],
    images: [
      { url: placeholderUrl('Floating+Shelves'), altText: 'Floating Wall Shelf Set mounted on wall', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Shelves+Styled'), altText: 'Floating Wall Shelf Set with decor items', sortOrder: 1, isPrimary: false },
    ],
  },
  {
    name: 'Round Mirror Frame',
    slug: 'round-mirror-frame',
    description: 'Hand-turned circular mirror frame with a smooth beveled interior edge. Makes a striking statement in entryways and bathrooms. Diameter: 30 inches, depth: 2 inches.',
    price: 399,
    compareAtPrice: 479,
    categorySlug: 'decor',
    sku: 'PW-DC-002',
    weight: 6.0,
    stock: 15,
    variants: [
      { name: 'Walnut', sku: 'PW-DC-002-W', price: 399, stock: 8, attributes: { wood: 'Walnut', finish: 'Natural' } },
      { name: 'Oak Light', sku: 'PW-DC-002-OL', price: 379, stock: 7, attributes: { wood: 'Oak', finish: 'Light' } },
    ],
    images: [
      { url: placeholderUrl('Round+Mirror'), altText: 'Round Mirror Frame on wall', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Mirror+Detail'), altText: 'Round Mirror Frame edge detail', sortOrder: 1, isPrimary: false },
    ],
  },
  {
    name: 'Wooden Coat Rack',
    slug: 'wooden-coat-rack',
    description: 'Wall-mounted coat rack with five hand-shaped pegs and a top shelf for hats and accessories. Simple Shaker-inspired design. Dimensions: 36"W x 6"D x 12"H.',
    price: 199,
    compareAtPrice: null,
    categorySlug: 'decor',
    sku: 'PW-DC-003',
    weight: 3.0,
    stock: 35,
    variants: [
      { name: 'Maple Natural', sku: 'PW-DC-003-MN', price: 199, stock: 15, attributes: { wood: 'Maple', finish: 'Natural' } },
      { name: 'Walnut Dark', sku: 'PW-DC-003-WD', price: 219, stock: 20, attributes: { wood: 'Walnut', finish: 'Dark' } },
    ],
    images: [
      { url: placeholderUrl('Coat+Rack'), altText: 'Wooden Coat Rack mounted on wall', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Coat+Rack+Detail'), altText: 'Wooden Coat Rack peg detail', sortOrder: 1, isPrimary: false },
    ],
  },
  {
    name: 'Geometric Wall Art',
    slug: 'geometric-wall-art',
    description: 'Three-dimensional geometric wall sculpture assembled from contrasting wood species. Each piece is precision-cut and hand-glued. Dimensions: 24" x 24" x 2" deep.',
    price: 299,
    compareAtPrice: null,
    categorySlug: 'decor',
    sku: 'PW-DC-004',
    weight: 3.5,
    stock: 20,
    variants: [
      { name: 'Walnut & Maple', sku: 'PW-DC-004-WM', price: 299, stock: 10, attributes: { wood: 'Walnut & Maple', finish: 'Natural' } },
      { name: 'Cherry & Oak', sku: 'PW-DC-004-CO', price: 319, stock: 10, attributes: { wood: 'Cherry & Oak', finish: 'Natural' } },
    ],
    images: [
      { url: placeholderUrl('Geometric+Wall+Art'), altText: 'Geometric Wall Art front view', sortOrder: 0, isPrimary: true },
      { url: placeholderUrl('Wall+Art+Angle'), altText: 'Geometric Wall Art angled view showing depth', sortOrder: 1, isPrimary: false },
    ],
  },
];

export async function seedProducts(): Promise<void> {
  console.log('[seed] Seeding products...');

  // First, fetch category IDs by slug
  const { rows: categories } = await pool.query('SELECT id, slug FROM categories');
  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    categoryMap.set(cat.slug, cat.id);
  }

  for (const product of PRODUCTS) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) {
      console.warn(`[seed]   WARNING: Category "${product.categorySlug}" not found, skipping "${product.name}"`);
      continue;
    }

    // Insert product
    const { rows: productRows } = await pool.query(
      `INSERT INTO products (name, slug, description, price, compare_at_price, category_id, sku, weight, stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (slug) DO NOTHING
       RETURNING id`,
      [
        product.name,
        product.slug,
        product.description,
        product.price,
        product.compareAtPrice,
        categoryId,
        product.sku,
        product.weight,
        product.stock,
      ]
    );

    // If product was already inserted, fetch its id for variants/images
    let productId: string;
    if (productRows.length > 0) {
      productId = productRows[0].id;
    } else {
      const { rows: existing } = await pool.query(
        'SELECT id FROM products WHERE slug = $1',
        [product.slug]
      );
      if (existing.length === 0) continue;
      productId = existing[0].id;
      console.log(`[seed]   Product already exists: ${product.name}`);
      continue; // Skip variants/images if product already existed
    }

    // Insert variants
    for (const variant of product.variants) {
      await pool.query(
        `INSERT INTO product_variants (product_id, name, sku, price, stock, attributes)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (sku) DO NOTHING`,
        [productId, variant.name, variant.sku, variant.price, variant.stock, JSON.stringify(variant.attributes)]
      );
    }

    // Insert images
    for (const image of product.images) {
      await pool.query(
        `INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [productId, image.url, image.altText, image.sortOrder, image.isPrimary]
      );
    }

    console.log(`[seed]   Product: ${product.name} (${product.variants.length} variants, ${product.images.length} images)`);
  }

  console.log(`[seed] Products seeded. Total: ${PRODUCTS.length} products.`);
}
