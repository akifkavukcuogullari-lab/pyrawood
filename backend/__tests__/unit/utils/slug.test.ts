import { generateSlug, slugify } from '../../../src/utils/slug';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'abcd1234-5678-9abc-def0-123456789abc'),
}));

describe('slugify', () => {
  it('should convert to lowercase', () => {
    expect(slugify('Walnut Dining Table')).toBe('walnut-dining-table');
  });

  it('should replace spaces with hyphens', () => {
    expect(slugify('oak craftsman bookshelf')).toBe('oak-craftsman-bookshelf');
  });

  it('should replace underscores with hyphens', () => {
    expect(slugify('oak_craftsman_bookshelf')).toBe('oak-craftsman-bookshelf');
  });

  it('should remove special characters', () => {
    expect(slugify('Table #1 (Limited Edition!)')).toBe('table-1-limited-edition');
  });

  it('should remove apostrophes', () => {
    expect(slugify("Artisan's Choice")).toBe('artisans-choice');
  });

  it('should replace ampersand with "and"', () => {
    expect(slugify('Chairs & Tables')).toBe('chairs-and-tables');
  });

  it('should collapse multiple hyphens', () => {
    expect(slugify('table---top')).toBe('table-top');
  });

  it('should trim leading and trailing hyphens', () => {
    expect(slugify('-walnut table-')).toBe('walnut-table');
  });

  it('should trim whitespace', () => {
    expect(slugify('  Walnut Table  ')).toBe('walnut-table');
  });
});

describe('generateSlug', () => {
  it('should produce a slug with a unique suffix', () => {
    const slug = generateSlug('Walnut Harvest Dining Table');
    expect(slug).toBe('walnut-harvest-dining-table-abcd1234');
  });

  it('should append the first segment of the UUID', () => {
    const slug = generateSlug('Oak Shelf');
    expect(slug).toMatch(/^oak-shelf-[a-z0-9]+$/);
  });

  it('should handle special characters before appending suffix', () => {
    const slug = generateSlug("Artisan's Collection & More!");
    expect(slug).toBe('artisans-collection-and-more-abcd1234');
  });
});
