import { v4 as uuidv4 } from 'uuid';

/**
 * Converts a string to a URL-safe slug.
 * Lowercases, replaces spaces/underscores with hyphens, removes special characters,
 * and appends a short random suffix for uniqueness.
 */
export function generateSlug(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/['']/g, '')            // Remove apostrophes
    .replace(/[&]/g, 'and')          // Replace & with 'and'
    .replace(/[\s_]+/g, '-')         // Replace spaces and underscores with hyphens
    .replace(/[^a-z0-9-]/g, '')      // Remove non-alphanumeric characters (except hyphens)
    .replace(/-+/g, '-')             // Collapse multiple hyphens
    .replace(/^-|-$/g, '');          // Trim leading/trailing hyphens

  // Append a short unique suffix (first 8 chars of a UUID)
  const suffix = uuidv4().split('-')[0];

  return `${base}-${suffix}`;
}

/**
 * Creates a slug without the random suffix.
 * Useful when you want to check for existing slugs before adding uniqueness.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['']/g, '')
    .replace(/[&]/g, 'and')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
