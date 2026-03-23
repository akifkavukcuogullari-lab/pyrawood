import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('should display the login page with form fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should display the register page with form fields', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByText('Create Account')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /create account/i })
    ).toBeVisible();
  });

  test('should show validation errors for empty login form', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    // The form should show at least one validation message
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
  });

  test('should show validation error for short password on login', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('ab');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(
      page.locator('text=Password must be at least 6 characters')
    ).toBeVisible();
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('nonexistent@example.com');
    await page.locator('#password').fill('wrongpassword123');
    await page.getByRole('button', { name: /sign in/i }).click();
    // Wait for server error message
    await expect(
      page.locator('.border-destructive\\/30').first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('customer@example.com');
    await page.locator('#password').fill('customer123');
    await page.getByRole('button', { name: /sign in/i }).click();
    // Should redirect to homepage after login
    await page.waitForURL('/', { timeout: 15_000 });
    await expect(page).toHaveURL('/');
  });

  test('should register a new user with unique email', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    await page.goto('/register');
    await page.locator('#name').fill('Test Shopper');
    await page.locator('#email').fill(uniqueEmail);
    await page.locator('#password').fill('securepass123');
    await page.locator('#confirmPassword').fill('securepass123');
    await page.getByRole('button', { name: /create account/i }).click();
    // Should redirect to homepage after registration
    await page.waitForURL('/', { timeout: 15_000 });
    await expect(page).toHaveURL('/');
  });

  test('should show error for mismatched passwords during registration', async ({
    page,
  }) => {
    await page.goto('/register');
    await page.locator('#name').fill('Test Shopper');
    await page.locator('#email').fill('mismatch@example.com');
    await page.locator('#password').fill('securepass123');
    await page.locator('#confirmPassword').fill('differentpass');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(
      page.locator('text=Passwords do not match')
    ).toBeVisible();
  });

  test('should show error for registering with existing email', async ({
    page,
  }) => {
    await page.goto('/register');
    await page.locator('#name').fill('Duplicate User');
    await page.locator('#email').fill('customer@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('#confirmPassword').fill('password123');
    await page.getByRole('button', { name: /create account/i }).click();
    // Server error for duplicate email
    await expect(
      page.locator('.border-destructive\\/30').first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('should redirect unauthenticated user from /orders to /login', async ({
    page,
  }) => {
    await page.goto('/orders');
    // Should be redirected to login
    await page.waitForURL(/\/login/, { timeout: 15_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect unauthenticated user from /checkout to /login', async ({
    page,
  }) => {
    await page.goto('/checkout');
    await page.waitForURL(/\/login/, { timeout: 15_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate between login and register pages', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /create one/i }).click();
    await expect(page).toHaveURL('/register');

    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/login');
  });

  test('should logout and clear session', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.locator('#email').fill('customer@example.com');
    await page.locator('#password').fill('customer123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/', { timeout: 15_000 });

    // Open user menu and click logout
    await page.getByRole('button', { name: /account/i }).click();
    await page.getByRole('button', { name: /logout/i }).click();

    // After logout, user menu should show login option
    await page.getByRole('button', { name: /account/i }).click();
    await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
  });
});
