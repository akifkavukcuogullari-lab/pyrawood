import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your Pyra Wood order with secure checkout.',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
