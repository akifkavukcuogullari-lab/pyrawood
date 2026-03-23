import { render, screen } from '@testing-library/react';
import { StarRating } from '@/components/reviews/StarRating';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Star: ({ className, ...props }: { className?: string }) => (
    <svg data-testid="star-icon" className={className} {...props} />
  ),
  StarHalf: ({ className, ...props }: { className?: string }) => (
    <svg data-testid="star-half-icon" className={className} {...props} />
  ),
  ShoppingBag: ({ className, ...props }: { className?: string }) => (
    <svg data-testid="shopping-bag-icon" className={className} {...props} />
  ),
}));

describe('StarRating', () => {
  it('renders 5 star icons for a rating of 5', () => {
    render(<StarRating rating={5} />);
    const stars = screen.getAllByTestId('star-icon');
    // 5 full stars, all should have fill class
    expect(stars).toHaveLength(5);
    stars.forEach((star) => {
      expect(star.className).toContain('fill-pyra-gold');
    });
  });

  it('renders correct number of filled stars for integer rating', () => {
    render(<StarRating rating={3} />);
    const allStars = screen.getAllByTestId('star-icon');
    // 3 full (fill-pyra-gold) + 2 empty (text-pyra-sand)
    expect(allStars).toHaveLength(5);
    const filledStars = allStars.filter((s) => s.className?.includes('fill-pyra-gold'));
    const emptyStars = allStars.filter((s) => s.className?.includes('text-pyra-sand'));
    expect(filledStars).toHaveLength(3);
    expect(emptyStars).toHaveLength(2);
  });

  it('renders half star for rating like 3.5', () => {
    render(<StarRating rating={3.5} />);
    // Should have: 3 full stars, 1 half-star container (with Star + StarHalf), 1 empty
    const halfStars = screen.getAllByTestId('star-half-icon');
    expect(halfStars).toHaveLength(1);

    const allStars = screen.getAllByTestId('star-icon');
    // 3 full + 1 in half-star container + 1 empty = 5
    expect(allStars).toHaveLength(5);
  });

  it('rounds up to full star when fractional part is >= 0.75', () => {
    render(<StarRating rating={3.8} />);
    // 3.8 -> adjustedFull=4, hasHalf=false, emptyStars=1
    const halfStars = screen.queryAllByTestId('star-half-icon');
    expect(halfStars).toHaveLength(0);

    const allStars = screen.getAllByTestId('star-icon');
    expect(allStars).toHaveLength(5);
    const filledStars = allStars.filter((s) => s.className?.includes('fill-pyra-gold'));
    expect(filledStars).toHaveLength(4);
  });

  it('renders empty stars correctly', () => {
    render(<StarRating rating={0} />);
    const allStars = screen.getAllByTestId('star-icon');
    expect(allStars).toHaveLength(5);
    const emptyStars = allStars.filter((s) => s.className?.includes('text-pyra-sand'));
    expect(emptyStars).toHaveLength(5);
  });

  it('shows numeric value when showValue is true', () => {
    render(<StarRating rating={4.5} showValue />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('does not show numeric value by default', () => {
    render(<StarRating rating={4.5} />);
    expect(screen.queryByText('4.5')).not.toBeInTheDocument();
  });
});
