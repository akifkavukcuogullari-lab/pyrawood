import { ProductService } from '../../../src/services/product.service';
import { ProductModel } from '../../../src/models/product.model';
import { NotFoundError } from '../../../src/utils/errors';

jest.mock('../../../src/models/product.model');

const mockProduct = {
  id: 'a1b2c3d4-5678-4abc-9def-000000000001',
  name: 'Walnut Harvest Dining Table',
  slug: 'walnut-harvest-dining-table-abc12345',
  description: 'A beautifully crafted walnut dining table.',
  price: 1299,
  compareAtPrice: 1599,
  categoryId: 'cat00001-0000-4000-a000-000000000001',
  isActive: true,
  stock: 15,
  sku: 'PW-DT-WAL-001',
  weight: 45.5,
  metadata: {},
  variants: [],
  images: [],
  averageRating: 4.5,
  reviewCount: 12,
  createdAt: '2025-06-10T08:00:00.000Z',
  updatedAt: '2025-06-12T14:30:00.000Z',
};

const mockProduct2 = {
  ...mockProduct,
  id: 'a1b2c3d4-5678-4abc-9def-000000000002',
  name: 'Oak Craftsman Bookshelf',
  slug: 'oak-craftsman-bookshelf-def56789',
  price: 899,
};

describe('ProductService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getAll', () => {
    it('should return paginated products', async () => {
      (ProductModel.findAll as jest.Mock).mockResolvedValue({
        products: [mockProduct, mockProduct2],
        total: 2,
      });

      const result = await ProductService.getAll({ page: 1, limit: 12 });

      expect(result.products).toHaveLength(2);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 12,
        total: 2,
        totalPages: 1,
      });
    });

    it('should pass filter params to the model', async () => {
      (ProductModel.findAll as jest.Mock).mockResolvedValue({
        products: [mockProduct],
        total: 1,
      });

      await ProductService.getAll({
        search: 'walnut',
        category: 'dining',
        minPrice: 500,
        maxPrice: 2000,
        sort: 'price_asc',
        page: 1,
        limit: 12,
      });

      expect(ProductModel.findAll).toHaveBeenCalledWith({
        search: 'walnut',
        category: 'dining',
        minPrice: 500,
        maxPrice: 2000,
        sort: 'price_asc',
        page: 1,
        limit: 12,
      });
    });

    it('should use default page and limit when not provided', async () => {
      (ProductModel.findAll as jest.Mock).mockResolvedValue({
        products: [],
        total: 0,
      });

      const result = await ProductService.getAll({});

      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(12);
    });
  });

  describe('getById', () => {
    it('should return a product with relations when found', async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue(mockProduct);

      const result = await ProductService.getById(mockProduct.id);

      expect(result.id).toBe(mockProduct.id);
      expect(result.name).toBe('Walnut Harvest Dining Table');
    });

    it('should throw NotFoundError when product does not exist', async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        ProductService.getById('nonexistent-id')
      ).rejects.toThrow(NotFoundError);

      await expect(
        ProductService.getById('nonexistent-id')
      ).rejects.toThrow('Product not found');
    });
  });

  describe('create', () => {
    it('should create a product with a generated slug', async () => {
      (ProductModel.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await ProductService.create({
        name: 'Walnut Harvest Dining Table',
        price: 1299,
        description: 'A beautifully crafted walnut dining table.',
      });

      expect(ProductModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Walnut Harvest Dining Table',
          price: 1299,
          slug: expect.stringContaining('walnut-harvest-dining-table'),
        })
      );
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      const updatedProduct = { ...mockProduct, price: 1199 };
      (ProductModel.update as jest.Mock).mockResolvedValue(updatedProduct);

      const result = await ProductService.update(mockProduct.id, { price: 1199 });

      expect(result.price).toBe(1199);
    });

    it('should regenerate slug when name is updated', async () => {
      (ProductModel.update as jest.Mock).mockResolvedValue(mockProduct);

      await ProductService.update(mockProduct.id, { name: 'Cherry Dining Table' });

      expect(ProductModel.update).toHaveBeenCalledWith(
        mockProduct.id,
        expect.objectContaining({
          name: 'Cherry Dining Table',
          slug: expect.stringContaining('cherry-dining-table'),
        })
      );
    });

    it('should throw NotFoundError when product does not exist', async () => {
      (ProductModel.update as jest.Mock).mockResolvedValue(null);

      await expect(
        ProductService.update('nonexistent-id', { price: 999 })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete successfully when product exists', async () => {
      (ProductModel.delete as jest.Mock).mockResolvedValue(true);

      await expect(ProductService.delete(mockProduct.id)).resolves.toBeUndefined();
    });

    it('should throw NotFoundError when product does not exist', async () => {
      (ProductModel.delete as jest.Mock).mockResolvedValue(false);

      await expect(
        ProductService.delete('nonexistent-id')
      ).rejects.toThrow(NotFoundError);
    });
  });
});
