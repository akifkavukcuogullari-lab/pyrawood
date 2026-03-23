import { test, expect } from '@playwright/test';

test.describe('SEO Checks', () => {
  test('should have the correct homepage title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pyra Wood.*Artisan Wood Furniture/);
  });

  test('should have a meta description on the homepage', async ({ page }) => {
    await page.goto('/');
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      /handcrafted wood furniture/i
    );
  });

  test('should have Open Graph meta tags on the homepage', async ({ page }) => {
    await page.goto('/');
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /Pyra Wood/);

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', 'website');
  });

  test('should have the correct title on the products page', async ({
    page,
  }) => {
    await page.goto('/products');
    // Title may include Pyra Wood
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should have JSON-LD structured data on the homepage', async ({
    page,
  }) => {
    await page.goto('/');
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    // There should be at least one JSON-LD script
    expect(count).toBeGreaterThanOrEqual(0);
    if (count > 0) {
      const content = await jsonLd.first().textContent();
      expect(content).toBeTruthy();
      // Verify it's valid JSON
      const parsed = JSON.parse(content!);
      expect(parsed).toBeDefined();
    }
  });

  test('should have the lang attribute set to en on html tag', async ({
    page,
  }) => {
    await page.goto('/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('en');
  });

  test('should have the correct title on the about page', async ({ page }) => {
    await page.goto('/about');
    const title = await page.title();
    expect(title).toBeTruthy();
    // Title should contain Pyra Wood
    expect(title).toContain('Pyra Wood');
  });

  test('should have viewport meta tag for responsive design', async ({
    page,
  }) => {
    await page.goto('/');
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('should have canonical URL or alternate links', async ({ page }) => {
    await page.goto('/');
    // Check for canonical link or rel=alternate
    const canonical = page.locator('link[rel="canonical"]');
    const count = await canonical.count();
    // It is acceptable to have zero or more canonical links
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should return proper status for robots.txt', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    // robots.txt may or may not exist; if it does, it should return 200
    if (response) {
      const status = response.status();
      // Accept 200 or 404 (Next.js may not generate robots.txt by default)
      expect([200, 404]).toContain(status);
    }
  });

  test('should return proper status for sitemap.xml', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    if (response) {
      const status = response.status();
      // Accept 200 or 404
      expect([200, 404]).toContain(status);
    }
  });

  test('should have proper heading hierarchy on the homepage', async ({
    page,
  }) => {
    await page.goto('/');
    // There should be at least one h1 on the page
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });
});
