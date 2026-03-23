import { render, screen } from '@testing-library/react';
import { CartSummary } from '@/components/cart/CartSummary';

// Mock separator
jest.mock('@/components/ui/separator', () => ({
  Separator: ({ className }: { className?: string }) => (
    <hr data-testid="separator" className={className} />
  ),
}));

describe('CartSummary', () => {
  it('displays the subtotal', () => {
    render(<CartSummary subtotal={200} />);
    expect(screen.getByText('$200.00')).toBeInTheDocument();
  });

  it('calculates and displays the tax at 8%', () => {
    render(<CartSummary subtotal={1000} />);
    // Tax = 1000 * 0.08 = 80
    expect(screen.getByText('$80.00')).toBeInTheDocument();
    expect(screen.getByText('Tax (8%)')).toBeInTheDocument();
  });

  it('shows shipping cost when subtotal is below $500', () => {
    render(<CartSummary subtotal={200} />);
    // Shipping = $50
    expect(screen.getByText('$50.00')).toBeInTheDocument();
    expect(screen.getByText(/Free shipping on orders over/)).toBeInTheDocument();
  });

  it('shows free shipping when subtotal is $500 or more', () => {
    render(<CartSummary subtotal={500} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
    // No "Free shipping on orders over" message when shipping is already free
    expect(screen.queryByText(/Free shipping on orders over/)).not.toBeInTheDocument();
  });

  it('calculates correct total with shipping', () => {
    // subtotal=200, tax=16, shipping=50, total=266
    render(<CartSummary subtotal={200} />);
    expect(screen.getByText('$266.00')).toBeInTheDocument();
  });

  it('calculates correct total with free shipping', () => {
    // subtotal=1000, tax=80, shipping=0, total=1080
    render(<CartSummary subtotal={1000} />);
    expect(screen.getByText('$1,080.00')).toBeInTheDocument();
  });

  it('handles zero subtotal', () => {
    render(<CartSummary subtotal={0} />);
    // Tax = 0, shipping = 50 (below threshold), total = 50
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });
});
