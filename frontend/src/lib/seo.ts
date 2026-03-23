import type { Metadata } from 'next';
import type { Product, Category } from '@/lib/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_NAME = 'Pyra Wood';

export function generatePageMetadata(
  title: string,
  description: string,
  path?: string
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      type: 'website',
    },
    alternates: path ? { canonical: path } : undefined,
  };
}

export function generateProductMetadata(product: Product): Metadata {
  const title = product.name;
  const description =
    product.description?.slice(0, 160) ||
    `Shop the ${product.name} — handcrafted wood furniture by Pyra Wood. Built with premium materials and designed to last generations.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      type: 'website',
      images: product.images?.[0]?.url
        ? [
            {
              url: product.images[0].url,
              alt: product.images[0].altText || product.name,
            },
          ]
        : undefined,
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

export function generateCategoryMetadata(category: Category): Metadata {
  const title = `${category.name} Furniture`;
  const description =
    category.description ||
    `Browse our handcrafted ${category.name.toLowerCase()} furniture collection. Premium wood furniture designed with natural beauty by Pyra Wood.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      type: 'website',
      images: category.imageUrl
        ? [{ url: category.imageUrl, alt: category.name }]
        : undefined,
    },
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
  };
}

export { SITE_URL, SITE_NAME };
