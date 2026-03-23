import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders',
  description: 'View and track your Pyra Wood orders.',
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
