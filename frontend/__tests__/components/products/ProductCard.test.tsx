import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/lib/types';

// Mock the cart store
jest.mock('@/store/cart-store', () => ({
  useCartStore: jest.fn((selector) =>
    selector({ addItem: jest.fn(), isOpen: false, cart: null, isLoading: false })
  ),
}));

// Mock the StarRating component
jest.mock('@/components/reviews/StarRating', () => ({
  StarRating: ({ rating }: { rating: number }) => (
    <div data-testid="star-rating">{rating} stars</div>
  ),
}));

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card-content" className={className}>{children}</div>
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span data-testid="badge" className={className}>{children}</span>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <button {...props}>{children}</button>
  ),
}));

const baseProduct: Product = {
  id: 'prod-1',
  name: 'Walnut Harvest Dining Table',
  slug: 'walnut-harvest-dining-table',
  price: 1299,
  isActive: true,
  stock: 10,
  metadata: {},
  variants: [],
  images: [
    {
      id: 'img-1',
      productId: 'prod-1',
      url: '/images/walnut-table.jpg',
      altText: 'Walnut dining table',
      isPrimary: true,
      sortOrder: 0,
    },
  ],
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText('Walnut Harvest Dining Table')).toBeInTheDocument();
  });

  it('renders product price formatted as USD', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText('$1,299.00')).toBeInTheDocument();
  });

  it('shows compare-at price when present and higher than price', () => {
    const discountedProduct: Product = {
      ...baseProduct,
      price: 999,
      compareAtPrice: 1299,
    };

    render(<ProductCard product={discountedProduct} />);
    expect(screen.getByText('$999.00')).toBeInTheDocument();
    expect(screen.getByText('$1,299.00')).toBeInTheDocument();
  });

  it('shows discount badge when compare-at price is set', () => {
    const discountedProduct: Product = {
      ...baseProduct,
      price: 999,
      compareAtPrice: 1299,
    };

    render(<ProductCard product={discountedProduct} />);
    // The discount is ~23%
    expect(screen.getByText('-23%')).toBeInTheDocument();
  });

  it('renders star rating when average rating is present', () => {
    const ratedProduct: Product = {
      ...baseProduct,
      averageRating: 4.5,
      reviewCount: 12,
    };

    render(<ProductCard product={ratedProduct} />);
    expect(screen.getByTestId('star-rating')).toBeInTheDocument();
    expect(screen.getByText('(12)')).toBeInTheDocument();
  });

  it('does not render star rating when average rating is 0', () => {
    const noRatingProduct: Product = {
      ...baseProduct,
      averageRating: 0,
      reviewCount: 0,
    };

    render(<ProductCard product={noRatingProduct} />);
    expect(screen.queryByTestId('star-rating')).not.toBeInTheDocument();
  });

  it('links to the product detail page', () => {
    render(<ProductCard product={baseProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/walnut-harvest-dining-table');
  });

  it('shows Out of Stock overlay when stock is 0', () => {
    const outOfStockProduct: Product = {
      ...baseProduct,
      stock: 0,
    };

    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('shows category badge when category is present', () => {
    const categorizedProduct: Product = {
      ...baseProduct,
      categoryId: 'cat-1',
      category: {
        id: 'cat-1',
        name: 'Dining',
        slug: 'dining',
        sortOrder: 1,
        createdAt: '2025-01-01',
      },
    };

    render(<ProductCard product={categorizedProduct} />);
    // Category name appears in badge and in card content
    const diningTexts = screen.getAllByText('Dining');
    expect(diningTexts.length).toBeGreaterThanOrEqual(1);
  });
});
