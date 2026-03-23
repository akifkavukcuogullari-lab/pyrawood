import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design - Mobile', () => {
  test.use({ ...devices['Pixel 5'] });

  test('should display the hamburger menu button on mobile', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(
      page.getByRole('button', { name: /open menu/i })
    ).toBeVisible();
  });

  test('should open mobile navigation when hamburger is clicked', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open menu/i }).click();
    // Mobile nav should show with Pyra Wood brand and links
    await expect(page.getByText('Shop All').first()).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.getByText('About').first()).toBeVisible();
    await expect(page.getByText('Contact').first()).toBeVisible();
  });

  test('should show categories accordion in mobile navigation', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open menu/i }).click();
    // Click Categories accordion
    await page.getByText('Categories').first().click();
    await expect(page.getByText('Living Room').first()).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.getByText('Dining').first()).toBeVisible();
  });

  test('should show login and register buttons in mobile nav for unauthenticated user', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open menu/i }).click();
    await expect(
      page.getByRole('link', { name: /login/i }).first()
    ).toBeVisible({ timeout: 5_000 });
    await expect(
      page.getByRole('link', { name: /register/i }).first()
    ).toBeVisible();
  });

  test('should navigate from mobile menu to products page', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByText('Shop All').first().click();
    await expect(page).toHaveURL('/products');
  });

  test('should show cart button on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('button', { name: /cart/i })
    ).toBeVisible();
  });

  test('should load the products page on mobile with correct layout', async ({
    page,
  }) => {
    await page.goto('/products');
    await expect(
      page.getByRole('heading', { name: /our collection/i })
    ).toBeVisible();
    // Search input should be visible
    await expect(
      page.getByPlaceholder('Search products...')
    ).toBeVisible();
  });
});

test.describe('Responsive Design - Desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('should show full desktop navigation without hamburger menu', async ({
    page,
  }) => {
    await page.goto('/');
    // Desktop nav links should be visible
    await expect(
      page.getByRole('link', { name: 'Shop' }).first()
    ).toBeVisible();
    await expect(page.getByText('Categories').first()).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'About' }).first()
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Contact' }).first()
    ).toBeVisible();
    // Hamburger menu should be hidden on desktop
    await expect(
      page.getByRole('button', { name: /open menu/i })
    ).toBeHidden();
  });

  test('should display the filter sidebar on desktop products page', async ({
    page,
  }) => {
    await page.goto('/products');
    // Desktop sidebar with Filters heading
    await expect(page.getByText('Filters').first()).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.getByText('Category').first()).toBeVisible();
    await expect(page.getByText('Price Range').first()).toBeVisible();
  });

  test('should display brand name in header', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Pyra Wood').first()).toBeVisible();
  });
});
