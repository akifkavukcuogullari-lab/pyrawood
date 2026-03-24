'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiGetPaginated, apiDelete } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api-contract';
import { formatCurrency, resolveImageUrl } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadProducts() {
    try {
      const res = await apiGetPaginated<Product>(ENDPOINTS.ADMIN.PRODUCTS.LIST, {
        limit: 100,
      });
      setProducts(res.data ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiDelete(ENDPOINTS.ADMIN.PRODUCTS.DELETE(deleteTarget.id));
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  const columns: Column<Product>[] = [
    {
      key: 'image',
      header: 'Image',
      className: 'w-16',
      render: (product) => (
        <div className="relative size-10 rounded overflow-hidden bg-muted">
          {product.images?.[0] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={resolveImageUrl(product.images[0].url)}
              alt={product.images[0].altText ?? product.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              N/A
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (product) => (
        <span className="font-medium text-foreground">{product.name}</span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (product) => formatCurrency(product.price),
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      render: (product) => (
        <span className={product.stock <= 0 ? 'text-destructive font-medium' : ''}>
          {product.stock}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (product) =>
        product.isActive ? (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-0 dark:bg-green-900/30 dark:text-green-400">
            Active
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-0 dark:bg-gray-800 dark:text-gray-400">
            Inactive
          </Badge>
        ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      render: (product) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex size-7 items-center justify-center rounded-md hover:bg-muted"
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => window.open(`/products/${product.slug}`, '_blank')}
            >
              <Eye className="size-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/admin/products/${product.id}/edit`)}
            >
              <Edit className="size-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteTarget(product)}
            >
              <Trash2 className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-semibold text-foreground">
            Products
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product catalog
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        searchPlaceholder="Search products..."
        searchFn={(product, query) =>
          product.name.toLowerCase().includes(query) ||
          (product.sku?.toLowerCase().includes(query) ?? false)
        }
        emptyMessage="No products found. Create your first product."
        actions={
          <Button render={<Link href="/admin/products/new" />}>
            <Plus className="size-4 mr-1.5" />
            Add Product
          </Button>
        }
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
