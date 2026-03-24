'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiGet, apiPut, apiDelete } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api-contract';
import { getToken } from '@/lib/auth';
import type { Product, Category } from '@/lib/types';
import { ProductForm } from '@/components/admin/ProductForm';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { VariantBuilder, type VariantRow } from '@/components/admin/VariantBuilder';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<
    { id: string; url: string; file?: File; isPrimary: boolean }[]
  >([]);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          apiGet<Product>(ENDPOINTS.ADMIN.PRODUCTS.UPDATE(id)),
          apiGet<Category[]>(ENDPOINTS.CATEGORIES.LIST),
        ]);

        if (productRes.data) {
          const p = productRes.data;
          setProduct(p);

          // Populate images
          setImages(
            (p.images ?? []).map((img) => ({
              id: img.id,
              url: img.url,
              isPrimary: img.isPrimary,
            }))
          );

          // Populate variants
          setVariants(
            (p.variants ?? []).map((v) => ({
              id: v.id,
              name: v.name,
              sku: v.sku ?? '',
              price: v.price != null ? String(v.price) : '',
              stock: String(v.stock),
              attributes: Object.entries(v.attributes).map(([key, value]) => ({
                key,
                value,
              })),
            }))
          );
        }

        if (categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load product'
        );
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(data: Record<string, unknown>) {
    setIsSubmitting(true);
    try {
      // 1. Update product data + variants
      const payload = {
        ...data,
        variants: variants
          .filter((v) => v.name.trim())
          .map((v) => ({
            name: v.name,
            sku: v.sku || undefined,
            price: v.price ? Number(v.price) : undefined,
            stock: Number(v.stock) || 0,
            attributes: Object.fromEntries(
              v.attributes
                .filter((a) => a.key.trim() && a.value.trim())
                .map((a) => [a.key, a.value])
            ),
          })),
      };
      await apiPut(ENDPOINTS.ADMIN.PRODUCTS.UPDATE(id), payload);

      // 2. Upload new images (those with a file)
      const newImages = images.filter((img) => img.file);
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = getToken();

      for (const img of newImages) {
        const formData = new FormData();
        formData.append('image', img.file!);
        formData.append('isPrimary', String(img.isPrimary));

        await fetch(`${apiBase}/admin/products/${id}/images`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
      }

      // 3. Update isPrimary for existing images
      const existingImages = images.filter((img) => !img.file && !img.id.startsWith('temp-'));
      for (const img of existingImages) {
        const original = product?.images?.find((o) => o.id === img.id);
        if (original && original.isPrimary !== img.isPrimary) {
          await apiPut(ENDPOINTS.ADMIN.PRODUCTS.UPDATE_IMAGE(id, img.id), {
            isPrimary: img.isPrimary,
          });
        }
      }

      // 4. Delete removed images (images that were in the original product but not in current state)
      const currentImageIds = new Set(images.map((img) => img.id));
      const originalImages = product?.images ?? [];
      for (const orig of originalImages) {
        if (!currentImageIds.has(orig.id)) {
          await apiDelete(ENDPOINTS.ADMIN.PRODUCTS.DELETE_IMAGE(id, orig.id));
        }
      }

      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update product'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" render={<Link href="/admin/products" />}>
          <ChevronLeft className="size-4 mr-1" />
          Back to Products
        </Button>
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error ?? 'Product not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button variant="ghost" size="sm" render={<Link href="/admin/products" />}>
          <ChevronLeft className="size-4 mr-1" />
          Products
        </Button>
        <span>/</span>
        <span className="text-foreground">Edit: {product.name}</span>
      </div>

      <h2 className="font-playfair text-2xl font-semibold text-foreground">
        Edit Product
      </h2>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ProductForm
            product={product}
            categories={categories}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
          <VariantBuilder variants={variants} onChange={setVariants} />
        </div>
        <div>
          <ImageUploader images={images} onChange={setImages} />
        </div>
      </div>
    </div>
  );
}
