import { CategoryModel, MappedCategory } from '../models/category.model';
import { NotFoundError } from '../utils/errors';

export const CategoryService = {
  async getAll(): Promise<MappedCategory[]> {
    return CategoryModel.findAll();
  },

  async getById(id: string): Promise<MappedCategory> {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new NotFoundError('Category');
    }
    return category;
  },

  async getBySlug(slug: string): Promise<MappedCategory> {
    const category = await CategoryModel.findBySlug(slug);
    if (!category) {
      throw new NotFoundError('Category');
    }
    return category;
  },
};
