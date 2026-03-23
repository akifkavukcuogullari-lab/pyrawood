import { render, screen } from '@testing-library/react';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { Product } from '@/lib/types';

// Mock ProductCard
jest.mock('@/components/products/ProductCard', () => ({
  ProductCard: ({ product }: { product: Product }) => (
    <div data-testid="product-card">{product.name}</div>
  ),
}));

// Mock ProductSkeleton
jest.mock('@/components/products/ProductSkeleton', () => ({
  ProductSkeleton: () => <div data-testid="product-skeleton" />,
}));

// Mock the cart store (required by ProductCard, even though mocked)
jest.mock('@/store/cart-store', () => ({
  useCartStore: jest.fn(() => jest.fn()),
}));

function createMockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: `prod-${Math.random().toString(36).slice(2)}`,
    name: 'Oak Craftsman Bookshelf',
    slug: 'oak-craftsman-bookshelf',
    price: 899,
    isActive: true,
    stock: 5,
    metadata: {},
    variants: [],
    images: [
      {
        id: 'img-1',
        productId: 'prod-1',
        url: '/images/bookshelf.jpg',
        altText: 'Oak bookshelf',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('ProductGrid', () => {
  it('renders the correct number of product cards', () => {
    const products = [
      createMockProduct({ id: '1', name: 'Walnut Harvest Dining Table' }),
      createMockProduct({ id: '2', name: 'Oak Craftsman Bookshelf' }),
      createMockProduct({ id: '3', name: 'Cedar Outdoor Bench' }),
    ];

    render(<ProductGrid products={products} />);

    const cards = screen.getAllByTestId('product-card');
    expect(cards).toHaveLength(3);
    expect(screen.getByText('Walnut Harvest Dining Table')).toBeInTheDocument();
    expect(screen.getByText('Oak Craftsman Bookshelf')).toBeInTheDocument();
    expect(screen.getByText('Cedar Outdoor Bench')).toBeInTheDocument();
  });

  it('shows empty state when no products are provided', () => {
    render(<ProductGrid products={[]} />);

    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(
      screen.getByText('Try adjusting your filters or search terms to find what you are looking for.')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('product-card')).not.toBeInTheDocument();
  });

  it('shows loading skeletons when isLoading is true', () => {
    render(<ProductGrid products={[]} isLoading={true} />);

    const skeletons = screen.getAllByTestId('product-skeleton');
    expect(skeletons).toHaveLength(8); // default skeletonCount
  });

  it('shows custom number of loading skeletons', () => {
    render(<ProductGrid products={[]} isLoading={true} skeletonCount={4} />);

    const skeletons = screen.getAllByTestId('product-skeleton');
    expect(skeletons).toHaveLength(4);
  });

  it('shows skeletons instead of products when loading', () => {
    const products = [createMockProduct()];

    render(<ProductGrid products={products} isLoading={true} />);

    expect(screen.queryByTestId('product-card')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('product-skeleton')).toHaveLength(8);
  });
});
