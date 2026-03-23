'use client';

import { useState, useRef, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductInfo } from '@/components/products/ProductInfo';
import { VariantSelector } from '@/components/products/VariantSelector';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { RelatedProducts } from '@/components/products/RelatedProducts';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ProductJsonLd } from '@/components/seo/ProductJsonLd';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { useProduct } from '@/hooks/useProducts';
import type { ProductVariant } from '@/lib/types';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const { product, isLoading, error } = useProduct(slug);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-heading text-2xl font-bold text-pyra-walnut">Product Not Found</h1>
        <p className="text-muted-foreground">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="text-pyra-forest underline-offset-4 hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  const effectivePrice = selectedVariant?.price ?? product.price;
  const effectiveStock = selectedVariant?.stock ?? product.stock;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ProductJsonLd product={product} url={`/products/${slug}`} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          ...(product.category
            ? [{ name: product.category.name, url: `/categories/${product.category.slug}` }]
            : []),
          { name: product.name, url: `/products/${slug}` },
        ]}
      />

      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-pyra-walnut">Home</Link>
          </li>
          <ChevronRight className="size-3.5" />
          <li>
            <Link href="/products" className="hover:text-pyra-walnut">Products</Link>
          </li>
          {product.category && (
            <>
              <ChevronRight className="size-3.5" />
              <li>
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="hover:text-pyra-walnut"
                >
                  {product.category.name}
                </Link>
              </li>
            </>
          )}
          <ChevronRight className="size-3.5" />
          <li className="font-medium text-pyra-charcoal line-clamp-1">{product.name}</li>
        </ol>
      </nav>

      {/* Product section */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Info + Actions */}
          <div className="space-y-8">
            <ProductInfo product={product} onScrollToReviews={scrollToReviews} />

            {product.variants.length > 0 && (
              <>
                <Separator />
                <VariantSelector
                  variants={product.variants}
                  selectedVariantId={selectedVariant?.id ?? null}
                  onSelect={setSelectedVariant}
                  basePrice={product.price}
                />
              </>
            )}

            <Separator />

            <AddToCartButton
              productId={product.id}
              variantId={selectedVariant?.id}
              stock={effectiveStock}
              productName={product.name}
            />

            {/* Trust indicators */}
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-pyra-sand/50 p-4">
              {[
                { label: 'Free Shipping', desc: 'On orders over $500' },
                { label: '30-Day Returns', desc: 'Hassle-free policy' },
                { label: 'Lifetime Warranty', desc: 'Quality guaranteed' },
                { label: 'Handcrafted', desc: 'Artisan quality' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xs font-semibold text-pyra-walnut">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs: Description, Reviews */}
      <section ref={reviewsRef} className="border-t border-pyra-sand bg-pyra-ivory">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Tabs defaultValue="description">
            <TabsList className="mb-8">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews {product.reviewCount ? `(${product.reviewCount})` : ''}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <div className="prose prose-sm max-w-none text-pyra-charcoal/80">
                {product.description ? (
                  <div className="space-y-4">
                    {product.description.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p>No detailed description available for this product.</p>
                )}

                {/* Product attributes table */}
                {product.weight && (
                  <table className="mt-8 w-full max-w-md text-sm">
                    <tbody>
                      {product.sku && (
                        <tr className="border-b border-pyra-sand">
                          <td className="py-2 font-medium text-pyra-charcoal">SKU</td>
                          <td className="py-2 text-muted-foreground">{product.sku}</td>
                        </tr>
                      )}
                      <tr className="border-b border-pyra-sand">
                        <td className="py-2 font-medium text-pyra-charcoal">Weight</td>
                        <td className="py-2 text-muted-foreground">{product.weight} kg</td>
                      </tr>
                      {product.category && (
                        <tr className="border-b border-pyra-sand">
                          <td className="py-2 font-medium text-pyra-charcoal">Category</td>
                          <td className="py-2 text-muted-foreground">{product.category.name}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-8">
                <ReviewForm productId={product.id} />
                <ReviewList productId={product.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products */}
      <section className="border-t border-pyra-sand py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RelatedProducts product={product} />
        </div>
      </section>
    </motion.div>
  );
}
