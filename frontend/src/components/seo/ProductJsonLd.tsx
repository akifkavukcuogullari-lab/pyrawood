import { JsonLd } from './JsonLd';
import type { Product } from '@/lib/types';

interface ProductJsonLdProps {
  product: Product;
  url: string;
}

export function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `Handcrafted ${product.name} by Pyra Wood`,
    image: product.images?.[0]?.url || `${siteUrl}/images/placeholder.jpg`,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'Pyra Wood',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}${url}`,
      priceCurrency: 'USD',
      price: product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Pyra Wood',
      },
    },
  };

  if (product.averageRating && product.reviewCount) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return <JsonLd data={data} />;
}
