import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Sign in to your Pyra Wood account to manage orders, track shipments, and access exclusive features.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-pyra-ivory px-4 py-12">
      <Link
        href="/"
        className="mb-8 font-heading text-3xl font-bold tracking-tight text-pyra-walnut"
      >
        {BRAND.name}
      </Link>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        {BRAND.tagline}
      </p>
    </div>
  );
}
