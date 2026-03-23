import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.locator('#email').fill('admin@pyrawood.com');
    await page.locator('#password').fill('admin123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/', { timeout: 15_000 });
  });

  test('should display the admin dashboard with stats', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(3000);
    // Admin panel header
    await expect(page.getByText('Admin Panel').first()).toBeVisible({
      timeout: 10_000,
    });
    // Dashboard heading
    await expect(
      page.getByRole('heading', { name: /dashboard/i }).first()
    ).toBeVisible();
  });

  test('should display Quick Actions section', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(3000);
    await expect(page.getByText('Quick Actions').first()).toBeVisible({
      timeout: 10_000,
    });
    await expect(
      page.getByRole('link', { name: /add new product/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /manage products/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /view all orders/i }).first()
    ).toBeVisible();
  });

  test('should navigate to product management page', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForTimeout(3000);
    await expect(page.getByText('Admin Panel').first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('should navigate to create new product page', async ({ page }) => {
    await page.goto('/admin/products/new');
    await page.waitForTimeout(3000);
    await expect(page.getByText('Admin Panel').first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('should navigate to order management page', async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForTimeout(3000);
    await expect(page.getByText('Admin Panel').first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('should navigate to user management page', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForTimeout(3000);
    await expect(page.getByText('Admin Panel').first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('should display Recent Orders section on dashboard', async ({
    page,
  }) => {
    await page.goto('/admin');
    await page.waitForTimeout(3000);
    await expect(page.getByText('Recent Orders').first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('should display Overview text on dashboard', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(3000);
    await expect(
      page.getByText('Overview of your store performance').first()
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Admin Access Control', () => {
  test('should redirect non-admin user away from admin pages', async ({
    page,
  }) => {
    // Login as regular customer
    await page.goto('/login');
    await page.locator('#email').fill('customer@example.com');
    await page.locator('#password').fill('customer123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/', { timeout: 15_000 });

    // Try to access admin
    await page.goto('/admin');
    // Should be redirected to homepage
    await page.waitForURL('/', { timeout: 15_000 });
    await expect(page).toHaveURL('/');
  });

  test('should redirect unauthenticated user away from admin pages', async ({
    page,
  }) => {
    await page.goto('/admin');
    // Should be redirected (either to / or /login)
    await page.waitForTimeout(5000);
    const url = page.url();
    expect(url).not.toContain('/admin');
  });
});
