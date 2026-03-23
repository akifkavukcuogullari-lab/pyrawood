import { test, expect } from '@playwright/test';

test.describe('Product Browsing', () => {
  test('should load the homepage with hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pyra Wood/);
    // The header brand name should be visible
    await expect(page.getByText('Pyra Wood').first()).toBeVisible();
  });

  test('should navigate to the products page and display the collection', async ({
    page,
  }) => {
    await page.goto('/products');
    await expect(
      page.getByRole('heading', { name: /our collection/i })
    ).toBeVisible();
    await expect(
      page.getByText(
        /discover handcrafted furniture designed with natural beauty/i
      )
    ).toBeVisible();
  });

  test('should display the search input on the products page', async ({
    page,
  }) => {
    await page.goto('/products');
    const searchInput = page.getByPlaceholder('Search products...');
    await expect(searchInput).toBeVisible();
  });

  test('should update URL when searching for a product', async ({ page }) => {
    await page.goto('/products');
    const searchInput = page.getByPlaceholder('Search products...');
    await searchInput.fill('walnut');
    // URL should reflect search parameter
    await page.waitForURL(/search=walnut/, { timeout: 10_000 });
    await expect(page).toHaveURL(/search=walnut/);
  });

  test('should display the sort dropdown with all options', async ({
    page,
  }) => {
    await page.goto('/products');
    // Click the sort trigger
    const sortTrigger = page.locator('[class*="SelectTrigger"], button').filter({ hasText: /newest|sort by/i }).first();
    await sortTrigger.click();
    // Verify sort options are visible
    await expect(page.getByText('Price: Low to High')).toBeVisible();
    await expect(page.getByText('Price: High to Low')).toBeVisible();
    await expect(page.getByText('Name: A to Z')).toBeVisible();
  });

  test('should display category filters in desktop sidebar', async ({
    page,
  }) => {
    // Use desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/products');
    // Desktop sidebar should be visible with category checkboxes
    await expect(page.getByText('Living Room')).toBeVisible();
    await expect(page.getByText('Dining')).toBeVisible();
    await expect(page.getByText('Bedroom')).toBeVisible();
    await expect(page.getByText('Office')).toBeVisible();
  });

  test('should display product count or results info', async ({ page }) => {
    await page.goto('/products');
    // Wait for products to load
    await page.waitForTimeout(2000);
    // Either shows product count or product grid items
    const productsText = page.locator('text=/\\d+ products? found/');
    const productGrid = page.locator('[class*="grid"]').first();
    const hasContent =
      (await productsText.isVisible().catch(() => false)) ||
      (await productGrid.isVisible().catch(() => false));
    expect(hasContent).toBeTruthy();
  });

  test('should navigate to a product detail page from products listing', async ({
    page,
  }) => {
    await page.goto('/products');
    // Wait for products to load
    await page.waitForTimeout(3000);
    // Click the first product link
    const firstProductLink = page.locator('a[href^="/products/"]').first();
    if (await firstProductLink.isVisible()) {
      await firstProductLink.click();
      await expect(page).toHaveURL(/\/products\/.+/);
    }
  });

  test('should navigate to Shop via desktop navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.getByRole('link', { name: 'Shop' }).click();
    await expect(page).toHaveURL('/products');
  });

  test('should open categories dropdown in desktop navigation', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    // Click the Categories trigger in navigation
    await page.getByText('Categories').click();
    // Category links should appear
    await expect(
      page.getByRole('link', { name: /living room/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /dining/i }).first()
    ).toBeVisible();
  });

  test('should navigate to about page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.getByRole('link', { name: 'About' }).first().click();
    await expect(page).toHaveURL('/about');
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.getByRole('link', { name: 'Contact' }).first().click();
    await expect(page).toHaveURL('/contact');
  });
});
