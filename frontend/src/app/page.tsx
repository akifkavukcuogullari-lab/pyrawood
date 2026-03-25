'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Package, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ProductGrid } from '@/components/products/ProductGrid';
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd';
import { useProducts } from '@/hooks/useProducts';
import { BRAND, PYRA_WOOD_CATEGORIES } from '@/lib/constants';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const CATEGORY_ICONS: Record<string, string> = {
  'living-room': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
  'dining': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop',
  'bedroom': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop',
  'office': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop',
  'outdoor': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
  'decor': 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=600&fit=crop',
};

const TRUST_ITEMS = [
  { icon: Truck, label: 'Free Shipping', description: 'On orders over $500' },
  { icon: RotateCcw, label: '30-Day Returns', description: 'Hassle-free returns' },
  { icon: Shield, label: 'Lifetime Warranty', description: 'Built to last generations' },
  { icon: Package, label: 'Handcrafted', description: 'By master artisans' },
];

export default function HomePage() {
  const { products, isLoading } = useProducts({ limit: 8, sort: 'newest' });

  return (
    <div className="flex flex-col">
      <OrganizationJsonLd />

      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-br from-pyra-walnut via-pyra-walnut/95 to-pyra-walnut/80">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/wood-texture.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-pyra-walnut/90 via-pyra-walnut/70 to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-2xl space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.p
              variants={fadeInUp}
              className="text-sm font-medium uppercase tracking-[0.2em] text-pyra-gold"
            >
              Handcrafted Excellence
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="font-heading text-4xl font-bold leading-tight tracking-tight text-pyra-cream sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {BRAND.tagline}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="max-w-lg text-lg leading-relaxed text-pyra-cream/80"
            >
              Each piece tells a story of master craftsmanship, sustainable materials, and timeless design.
              Discover furniture that becomes a part of your family for generations.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-pyra-gold text-white hover:bg-pyra-gold/90"
                render={<Link href="/products" />}
              >
                Shop Collection
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-pyra-cream/30 text-pyra-cream hover:bg-pyra-cream/10"
                render={<Link href="#story" />}
              >
                Our Story
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b border-pyra-sand bg-pyra-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {TRUST_ITEMS.map((item) => (
              <motion.div
                key={item.label}
                variants={fadeInUp}
                className="flex items-center gap-3 sm:justify-center"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pyra-forest/10">
                  <item.icon className="size-5 text-pyra-forest" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-pyra-walnut">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
          >
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-pyra-gold">
              Browse by Room
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-pyra-walnut sm:text-4xl">
              Shop by Category
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-rows-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            {PYRA_WOOD_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.slug}
                variants={fadeInUp}
                className={index < 2 ? 'lg:row-span-1' : ''}
              >
                <Link href={`/categories/${category.slug}`} className="group block">
                  <Card className="relative overflow-hidden border-pyra-sand bg-pyra-sand transition-shadow duration-300 hover:shadow-xl">
                    <div className="relative aspect-[4/3]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={CATEGORY_ICONS[category.slug] || '/images/placeholder.jpg'}
                        alt={category.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-pyra-walnut/80 via-pyra-walnut/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <h3 className="font-heading text-xl font-semibold text-white sm:text-2xl">
                          {category.name}
                        </h3>
                        <p className="mt-1 text-sm text-white/80">{category.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-pyra-sand/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 flex items-end justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-pyra-gold">
                Curated Selection
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-pyra-walnut sm:text-4xl">
                Featured Products
              </h2>
            </div>
            <Button
              variant="outline"
              className="hidden sm:inline-flex"
              render={<Link href="/products" />}
            >
              View All
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>

          <ProductGrid products={products} isLoading={isLoading} skeletonCount={8} />

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" render={<Link href="/products" />}>
              View All Products
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section id="story" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeInUp}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src="/images/workshop.jpg"
                  alt="Pyra Wood workshop where artisan furniture is handcrafted"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Decorative floating card */}
              <div className="absolute -bottom-6 -right-6 rounded-xl bg-pyra-forest p-6 text-white shadow-xl sm:p-8">
                <p className="font-heading text-3xl font-bold">25+</p>
                <p className="text-sm text-white/80">Years of Craftsmanship</p>
              </div>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
            >
              <motion.p
                variants={fadeInUp}
                className="text-sm font-medium uppercase tracking-[0.15em] text-pyra-gold"
              >
                Our Heritage
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="font-heading text-3xl font-bold text-pyra-walnut sm:text-4xl"
              >
                The Pyra Wood Story
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg leading-relaxed text-pyra-charcoal/80">
                Founded with a passion for preserving the art of woodworking, Pyra Wood brings together
                traditional craftsmanship and contemporary design. Every piece is hand-selected from
                sustainably sourced timber, shaped by skilled artisans who have dedicated their lives to
                perfecting their craft.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-lg leading-relaxed text-pyra-charcoal/80">
                We believe furniture should be more than functional. It should carry character, warmth,
                and the natural beauty that only real wood can provide. Each grain pattern is unique, each
                joint is precise, and each finish is applied with care.
              </motion.p>

              <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-6 pt-4">
                {[
                  { value: 'Handcrafted', label: 'By master artisans' },
                  { value: 'Sustainable', label: 'Responsibly sourced' },
                  { value: 'Lifetime', label: 'Warranty included' },
                ].map((item) => (
                  <div key={item.value} className="text-center">
                    <p className="font-heading text-lg font-bold text-pyra-forest">{item.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-pyra-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.p
              variants={fadeInUp}
              className="text-sm font-medium uppercase tracking-[0.15em] text-pyra-gold"
            >
              Stay Connected
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="mt-2 font-heading text-3xl font-bold text-pyra-walnut sm:text-4xl"
            >
              Join the Pyra Wood Family
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-muted-foreground">
              Be the first to know about new collections, exclusive offers, and the stories behind our craft.
            </motion.p>
            <motion.form
              variants={fadeInUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white"
                required
              />
              <Button className="bg-pyra-forest text-white hover:bg-pyra-forest/90">
                Subscribe
              </Button>
            </motion.form>
            <motion.p variants={fadeInUp} className="mt-3 text-xs text-muted-foreground">
              No spam. Unsubscribe at any time.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
