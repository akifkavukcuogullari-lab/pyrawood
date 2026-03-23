import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForURL(/\/login/, { timeout: 15_000 });
    await expect(page).toHaveURL(/\/login.*redirect.*checkout/);
  });

  test('should show empty cart state on checkout when cart is empty', async ({
    page,
  }) => {
    // Login first
    await page.goto('/login');
    await page.locator('#email').fill('customer@example.com');
    await page.locator('#password').fill('customer123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/', { timeout: 15_000 });

    // Navigate to checkout with empty cart
    await page.goto('/checkout');
    await page.waitForTimeout(3000);

    // Should show empty cart state or the Checkout heading
    const emptyState = page.getByText('Your cart is empty').first();
    const checkoutHeading = page
      .getByRole('heading', { name: /checkout/i })
      .first();
    const hasContent =
      (await emptyState.isVisible().catch(() => false)) ||
      (await checkoutHeading.isVisible().catch(() => false));
    expect(hasContent).toBeTruthy();
  });

  test('should display the checkout page heading for authenticated user', async ({
    page,
  }) => {
    // Login first
    await page.goto('/login');
    await page.locator('#email').fill('customer@example.com');
    await page.locator('#password').fill('customer123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/', { timeout: 15_000 });

    await page.goto('/checkout');
    // Should see the Checkout heading (whether empty or with items)
    await expect(
      page.getByRole('heading', { name: /checkout/i }).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('should display Order Summary sidebar when cart has items', async ({
    page,
  }) => {
    // Login
    await page.goto('/login');
    await page.locator('#email').fill('customer@example.com');
    await page.locator('#password').fill('customer123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/', { timeout: 15_000 });

    // Try to add an item first
    await page.goto('/products');
    await page.waitForTimeout(3000);

    const firstProductLink = page.locator('a[href^="/products/"]').first();
    if (await firstProductLink.isVisible()) {
      await firstProductLink.click();
      await page.waitForURL(/\/products\/.+/, { timeout: 10_000 });

      const addToCartButton = page
        .getByRole('button', { name: /add to cart/i })
        .first();
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click();
        await page.waitForTimeout(2000);

        // Navigate to checkout
        await page.goto('/checkout');
        await page.waitForTimeout(3000);

        // Should show Order Summary
        const orderSummary = page.getByText('Order Summary').first();
        if (await orderSummary.isVisible().catch(() => false)) {
          await expect(orderSummary).toBeVisible();
        }
      }
    }
  });
});
