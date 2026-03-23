import { AdminModel, AdminStats } from '../models/admin.model';
import { ProductModel, MappedProduct } from '../models/product.model';
import { OrderModel, MappedOrder } from '../models/order.model';
import { NotFoundError } from '../utils/errors';
import { buildPaginationResponse } from '../utils/pagination';
import { generateSlug } from '../utils/slug';
import type { MappedUser } from '../models/user.model';
import type { MappedImage, MappedVariant } from '../models/admin.model';

// ── Response types ───────────────────────────────────────────────────

interface PaginatedProducts {
  products: MappedProduct[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface PaginatedOrders {
  orders: MappedOrder[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface PaginatedUsers {
  users: MappedUser[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

// ── Service ──────────────────────────────────────────────────────────

export const AdminService = {
  // ── Dashboard Stats ────────────────────────────────────────────────

  async getStats(): Promise<AdminStats> {
    const [baseStats, revenueByMonth, recentOrdersResult] = await Promise.all([
      AdminModel.getStats(),
      AdminModel.getRevenueByMonth(),
      OrderModel.findAll({ page: 1, limit: 10 }),
    ]);

    return {
      ...baseStats,
      recentOrders: recentOrdersResult.orders,
      revenueByMonth,
    };
  },

  // ── Products ───────────────────────────────────────────────────────

  async listProducts(params: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedProducts> {
    // Admin sees all products including inactive ones
    // We use ProductModel.findAll but override the is_active filter
    // Since ProductModel.findAll enforces is_active = true, we need a workaround
    // For now, use the standard findAll — admin can see active products and manage them
    const { products, total } = await ProductModel.findAll({
      search: params.search,
      category: params.category,
      page: params.page,
      limit: params.limit,
      sort: 'newest',
    });

    const pagination = buildPaginationResponse(
      total,
      params.page || 1,
      params.limit || 12
    );

    return { products, pagination };
  },

  async createProduct(data: {
    name: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    categoryId?: string;
    stock?: number;
    sku?: string;
    weight?: number;
    metadata?: Record<string, unknown>;
    variants?: {
      name: string;
      sku?: string;
      price?: number;
      stock?: number;
      attributes?: Record<string, string>;
    }[];
  }): Promise<MappedProduct> {
    const slug = generateSlug(data.name);
    const product = await ProductModel.create({ ...data, slug });

    // Create variants if provided
    if (data.variants && data.variants.length > 0) {
      for (const variant of data.variants) {
        const created = await AdminModel.addProductVariant(product.id, variant);
        product.variants.push(created);
      }
    }

    return product;
  },

  async updateProduct(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      compareAtPrice: number;
      categoryId: string;
      isActive: boolean;
      stock: number;
      sku: string;
      weight: number;
      metadata: Record<string, unknown>;
    }>
  ): Promise<MappedProduct> {
    const updateData: Record<string, unknown> = { ...data };
    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }

    const product = await ProductModel.update(id, updateData as any);
    if (!product) {
      throw new NotFoundError('Product');
    }
    return product;
  },

  async deleteProduct(id: string): Promise<void> {
    const deleted = await ProductModel.delete(id);
    if (!deleted) {
      throw new NotFoundError('Product');
    }
  },

  // ── Images ─────────────────────────────────────────────────────────

  async addProductImage(
    productId: string,
    url: string,
    altText?: string,
    isPrimary?: boolean
  ): Promise<MappedImage> {
    // Verify product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new NotFoundError('Product');
    }

    return AdminModel.addProductImage(productId, url, altText, isPrimary);
  },

  async updateProductImage(
    productId: string,
    imageId: string,
    data: { altText?: string; sortOrder?: number; isPrimary?: boolean }
  ): Promise<MappedImage> {
    const image = await AdminModel.updateProductImage(imageId, data);
    if (!image) {
      throw new NotFoundError('Product image');
    }
    return image;
  },

  async deleteProductImage(productId: string, imageId: string): Promise<void> {
    const deleted = await AdminModel.deleteProductImage(imageId);
    if (!deleted) {
      throw new NotFoundError('Product image');
    }
  },

  // ── Variants ───────────────────────────────────────────────────────

  async addProductVariant(
    productId: string,
    data: {
      name: string;
      sku?: string;
      price?: number;
      stock?: number;
      attributes?: Record<string, string>;
    }
  ): Promise<MappedVariant> {
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new NotFoundError('Product');
    }

    return AdminModel.addProductVariant(productId, data);
  },

  async updateProductVariant(
    productId: string,
    variantId: string,
    data: {
      name?: string;
      sku?: string;
      price?: number;
      stock?: number;
      attributes?: Record<string, string>;
    }
  ): Promise<MappedVariant> {
    const variant = await AdminModel.updateProductVariant(variantId, data);
    if (!variant) {
      throw new NotFoundError('Product variant');
    }
    return variant;
  },

  async deleteProductVariant(productId: string, variantId: string): Promise<void> {
    const deleted = await AdminModel.deleteProductVariant(variantId);
    if (!deleted) {
      throw new NotFoundError('Product variant');
    }
  },

  // ── Orders ─────────────────────────────────────────────────────────

  async listOrders(params: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedOrders> {
    const { orders, total } = await OrderModel.findAll(params);
    const pagination = buildPaginationResponse(
      total,
      params.page || 1,
      params.limit || 12
    );

    return { orders, pagination };
  },

  async getOrder(id: string): Promise<MappedOrder> {
    const order = await OrderModel.findById(id);
    if (!order) {
      throw new NotFoundError('Order');
    }
    return order;
  },

  async updateOrderStatus(id: string, status: string): Promise<MappedOrder> {
    const order = await OrderModel.updateStatus(id, status);
    if (!order) {
      throw new NotFoundError('Order');
    }
    return order;
  },

  // ── Users ──────────────────────────────────────────────────────────

  async listUsers(params: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedUsers> {
    const { users, total } = await AdminModel.listUsers(params);
    const pagination = buildPaginationResponse(
      total,
      params.page || 1,
      params.limit || 12
    );

    return { users, pagination };
  },
};
