import type { MetadataRoute } from 'next';
import { API_BASE_URL, ENDPOINTS } from '@/lib/api-contract';
import { PYRA_WOOD_CATEGORIES } from '@/lib/constants';
import type { PaginatedResponse, Product } from '@/lib/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = PYRA_WOOD_CATEGORIES.map(
    (cat) => ({
      url: `${SITE_URL}/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  );

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_BASE_URL}${ENDPOINTS.PRODUCTS.LIST}?limit=1000`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json: PaginatedResponse<Product> = await res.json();
      productPages = json.data.map((product) => ({
        url: `${SITE_URL}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Silently fail — static pages will still be generated
  }

  return [...staticPages, ...categoryPages, ...productPages];
}
