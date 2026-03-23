import Link from 'next/link';
import { BRAND, PYRA_WOOD_CATEGORIES } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';
import { NewsletterForm } from '@/components/layout/NewsletterForm';

const companyLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Shipping & Delivery', href: '/shipping' },
  { name: 'Returns & Exchanges', href: '/returns' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
];

export function Footer() {
  return (
    <footer className="bg-pyra-walnut text-pyra-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold">{BRAND.name}</h2>
            <p className="text-sm leading-relaxed text-pyra-cream/80">
              {BRAND.description}
            </p>
            <p className="text-sm italic text-pyra-gold">{BRAND.tagline}</p>
          </div>

          {/* Shop Categories */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Shop</h3>
            <ul className="space-y-2">
              {PYRA_WOOD_CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-sm text-pyra-cream/70 transition-colors hover:text-pyra-gold"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-pyra-cream/70 transition-colors hover:text-pyra-gold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">
              Stay Connected
            </h3>
            <p className="text-sm text-pyra-cream/80">
              Subscribe to receive updates on new collections and exclusive
              offers.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <Separator className="my-8 bg-pyra-cream/20" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-pyra-cream/60">
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-pyra-cream/60">
              Handcrafted with care
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
