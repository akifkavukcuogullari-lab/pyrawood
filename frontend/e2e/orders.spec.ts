import { test, expect } from '@playwright/test';

test.describe('Order Management', () => {
  test('should redirect unauthenticated users from orders to login', async ({
    page,
  }) => {
    await page.goto('/orders');
    await page.waitForURL(/\/login/, { timeout: 15_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display orders page for authenticated user', async ({
    page,
  }) => {
    // Login
    await page.goto('/login');
    await page.locator('#email').fill('customer@example.com');
    await page.locator('#password').fill('customer123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/', { timeout: 15_000 });

    // Navigate to orders
    await page.goto('/orders');
    await expect(
      page.getByRole('heading', { name: /my orders/i }).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('should display empty orders state or order list', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.locator('#email').fill('customer@example.com');
    await page.locator('#password').fill('customer123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/', { timeout: 15_000 });

    await page.goto('/orders');
    await page.waitForTimeout(3000);

    // Either empty state or order cards
    const emptyState = page.getByText('No orders yet').first();
    const orderCards = page.locator('a[href^="/orders/"]').first();
    const hasContent =
      (await emptyState.isVisible().catch(() => false)) ||
      (await orderCards.isVisible().catch(() => false));
    expect(hasContent).toBeTruthy();
  });

  test('should navigate to order detail if orders exist', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.locator('#email').fill('customer@example.com');
    await page.locator('#password').fill('customer123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/', { timeout: 15_000 });

    await page.goto('/orders');
    await page.waitForTimeout(3000);

    const firstOrderLink = page.locator('a[href^="/orders/"]').first();
    if (await firstOrderLink.isVisible()) {
      await firstOrderLink.click();
      await expect(page).toHaveURL(/\/orders\/.+/);
    }
  });

  test('should access orders page from user menu dropdown', async ({
    page,
  }) => {
    // Login
    await page.goto('/login');
    await page.locator('#email').fill('customer@example.com');
    await page.locator('#password').fill('customer123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/', { timeout: 15_000 });

    // Open user menu
    await page.getByRole('button', { name: /account/i }).click();
    await page.getByRole('link', { name: /orders/i }).first().click();
    await expect(page).toHaveURL('/orders');
  });
});
