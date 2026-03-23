import { ProductModel, ProductListParams, MappedProduct } from '../models/product.model';
import { NotFoundError } from '../utils/errors';
import { buildPaginationResponse } from '../utils/pagination';
import { generateSlug } from '../utils/slug';

interface PaginatedProducts {
  products: MappedProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const ProductService = {
  async getAll(params: ProductListParams): Promise<PaginatedProducts> {
    const { products, total } = await ProductModel.findAll(params);
    const pagination = buildPaginationResponse(
      total,
      params.page || 1,
      params.limit || 12
    );
    return { products, pagination };
  },

  async getById(id: string): Promise<MappedProduct> {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new NotFoundError('Product');
    }
    return product;
  },

  async create(data: {
    name: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    categoryId?: string;
    isActive?: boolean;
    stock?: number;
    sku?: string;
    weight?: number;
    metadata?: Record<string, unknown>;
  }): Promise<MappedProduct> {
    const slug = generateSlug(data.name);
    return ProductModel.create({ ...data, slug });
  },

  async update(
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
    // If name is being updated, regenerate slug
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

  async delete(id: string): Promise<void> {
    const deleted = await ProductModel.delete(id);
    if (!deleted) {
      throw new NotFoundError('Product');
    }
  },
};
