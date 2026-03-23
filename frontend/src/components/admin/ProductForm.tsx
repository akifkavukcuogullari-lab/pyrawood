'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product, Category } from '@/lib/types';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  compareAtPrice: z.coerce.number().min(0).optional().or(z.literal('')),
  categoryId: z.string().optional(),
  stock: z.coerce.number().int().min(0, 'Stock must be non-negative'),
  sku: z.string().optional(),
  weight: z.coerce.number().min(0).optional().or(z.literal('')),
  isActive: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  isSubmitting?: boolean;
  onSubmit: (data: ProductFormValues) => void;
}

export function ProductForm({
  product,
  categories,
  isSubmitting = false,
  onSubmit,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      compareAtPrice: '',
      categoryId: '',
      stock: 0,
      sku: '',
      weight: '',
      isActive: true,
    },
  });

  const isActive = watch('isActive');
  const categoryId = watch('categoryId');

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description ?? '',
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? '',
        categoryId: product.categoryId ?? '',
        stock: product.stock,
        sku: product.sku ?? '',
        weight: product.weight ?? '',
        isActive: product.isActive,
      });
    }
  }, [product, reset]);

  function handleFormSubmit(data: ProductFormValues) {
    const cleaned = {
      ...data,
      compareAtPrice:
        data.compareAtPrice === '' ? undefined : Number(data.compareAtPrice),
      weight: data.weight === '' ? undefined : Number(data.weight),
      categoryId: data.categoryId || undefined,
      sku: data.sku || undefined,
    };
    onSubmit(cleaned as ProductFormValues);
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-playfair text-lg">
          {product ? 'Edit Product' : 'New Product'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
              placeholder="Enter product name"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe this product..."
              rows={4}
            />
          </div>

          {/* Price + Compare */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                placeholder="0.00"
                aria-invalid={!!errors.price}
              />
              {errors.price && (
                <p className="text-xs text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="compareAtPrice">Compare at Price ($)</Label>
              <Input
                id="compareAtPrice"
                type="number"
                step="0.01"
                {...register('compareAtPrice')}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={categoryId || undefined}
              onValueChange={(val) => setValue('categoryId', val ?? '')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No category</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock + SKU */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                {...register('stock', { valueAsNumber: true })}
                placeholder="0"
                aria-invalid={!!errors.stock}
              />
              {errors.stock && (
                <p className="text-xs text-destructive">
                  {errors.stock.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...register('sku')} placeholder="e.g. PWD-001" />
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              {...register('weight')}
              placeholder="0.00"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isActive}
              onCheckedChange={(checked) =>
                setValue('isActive', checked === true)
              }
            />
            <Label className="cursor-pointer">Active (visible in store)</Label>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting
              ? product
                ? 'Updating...'
                : 'Creating...'
              : product
                ? 'Update Product'
                : 'Create Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
