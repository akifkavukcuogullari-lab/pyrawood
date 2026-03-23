import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/shared/EmptyState';
import { ShoppingBag } from 'lucide-react';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ShoppingBag: (props: Record<string, unknown>) => (
    <svg data-testid="icon" {...props} />
  ),
}));

// Mock UI button to simplify testing
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, render: renderProp, ...props }: { children: React.ReactNode; render?: React.ReactElement; [key: string]: unknown }) => {
    // If render prop is provided (as base-ui does), just render a link-like button
    if (renderProp && typeof renderProp === 'object' && 'props' in renderProp) {
      return <a href={renderProp.props.href} data-testid="action-button">{children}</a>;
    }
    return <button data-testid="action-button" {...props}>{children}</button>;
  },
}));

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Start shopping to add items to your cart."
      />
    );

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Start shopping to add items to your cart.')).toBeInTheDocument();
  });

  it('renders the icon', () => {
    render(
      <EmptyState
        icon={ShoppingBag}
        title="No orders yet"
        description="Place an order to see it here."
      />
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders action button when action prop is provided', () => {
    render(
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Start shopping to add items to your cart."
        action={{ label: 'Browse Products', href: '/products' }}
      />
    );

    const button = screen.getByTestId('action-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Browse Products');
    expect(button).toHaveAttribute('href', '/products');
  });

  it('does not render action button when no action prop', () => {
    render(
      <EmptyState
        icon={ShoppingBag}
        title="No results"
        description="Try different search terms."
      />
    );

    expect(screen.queryByTestId('action-button')).not.toBeInTheDocument();
  });
});
