import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Manage your Pyra Wood account settings and profile information.',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
