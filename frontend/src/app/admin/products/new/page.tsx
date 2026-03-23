'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiGet, apiPost } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api-contract';
import type { Category } from '@/lib/types';
import { ProductForm } from '@/components/admin/ProductForm';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { VariantBuilder, type VariantRow } from '@/components/admin/VariantBuilder';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<
    { id: string; url: string; file?: File; isPrimary: boolean }[]
  >([]);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await apiGet<Category[]>(ENDPOINTS.CATEGORIES.LIST);
        if (res.data) setCategories(res.data);
      } catch {
        // Categories are optional; ignore errors
      }
    }
    loadCategories();
  }, []);

  async function handleSubmit(data: Record<string, unknown>) {
    setIsSubmitting(true);
    try {
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

      await apiPost(ENDPOINTS.ADMIN.PRODUCTS.CREATE, payload);
      toast.success('Product created successfully');
      router.push('/admin/products');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create product'
      );
    } finally {
      setIsSubmitting(false);
    }
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
        <span className="text-foreground">New Product</span>
      </div>

      <h2 className="font-playfair text-2xl font-semibold text-foreground">
        Create New Product
      </h2>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ProductForm
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
