import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { CartProvider } from '@/providers/CartProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

const playfairDisplay = Playfair_Display({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Pyra Wood | Artisan Wood Furniture',
    template: '%s | Pyra Wood',
  },
  description:
    'Premium handcrafted wood furniture designed with natural beauty and built to last generations. Discover artisan tables, chairs, shelves, and more.',
  keywords: [
    'wood furniture',
    'handcrafted furniture',
    'artisan furniture',
    'solid wood',
    'premium furniture',
    'Pyra Wood',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Pyra Wood',
    title: 'Pyra Wood | Artisan Wood Furniture, Crafted for Life',
    description:
      'Premium handcrafted wood furniture designed with natural beauty and built to last generations.',
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <CartDrawer />
                <Toaster position="bottom-right" />
              </TooltipProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
