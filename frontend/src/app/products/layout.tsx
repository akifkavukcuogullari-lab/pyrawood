import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Collection',
  description:
    'Browse the full Pyra Wood collection of handcrafted wood furniture. Shop dining tables, desks, beds, shelves, and more — all built from sustainably sourced timber.',
  alternates: { canonical: '/products' },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
