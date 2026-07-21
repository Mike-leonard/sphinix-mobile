import { test, expect } from '@playwright/test';

test.describe('Authentication and Role-Based Routing', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Turnstile script to auto-pass instantly in tests
    await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: `
          window.turnstile = {
            render: function(element, options) {
              setTimeout(() => {
                if (options.callback) options.callback('e2e-bypass-token');
              }, 100);
              return 'widget-id';
            },
            reset: function() {},
            remove: function() {}
          };
        `
      });
    });
  });

  test('unauthenticated users are redirected to login from protected routes', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*\/login/);

    // Try to access activities
    await page.goto('/activities');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('admin user flow and route restrictions', async ({ page }) => {
    await page.goto('/login');
    
    // Login as Admin
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password123');
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled({ timeout: 15000 });
    await submitBtn.click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Navbar should have Admin User profile
    await expect(page.locator('text=Admin User').first()).toBeVisible();

    // Admin should not be able to access activities
    await page.goto('/activities');
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Logout
    await page.click('button[aria-label="Toggle profile menu"]');
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('normal user flow and route restrictions', async ({ page }) => {
    await page.goto('/login');
    
    // Login as Normal user
    await page.fill('input[type="email"]', 'normal@example.com');
    await page.fill('input[type="password"]', 'password123');
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled({ timeout: 15000 });
    await submitBtn.click();

    // Should redirect to homepage (or activities, but let's assume home for now based on login flow)
    await expect(page).toHaveURL(/.*(\/|\/activities)$/);

    // Navbar should have Normal User profile
    await expect(page.locator('text=Normal User').first()).toBeVisible();

    // Normal user can access activities
    await page.goto('/activities');
    await expect(page).toHaveURL(/.*\/activities/);

    // Normal user should not be able to access dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*\/$/); // Redirected to home

    // Logout
    await page.click('button[aria-label="Toggle profile menu"]');
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(/.*\/login/);
  });
  test('forgot password flow', async ({ page }) => {
    await page.goto('/login');
    
    // Click forgot password link
    await page.click('text="Forgot password?"');
    
    // Expect to navigate to forgot password or open modal
    await expect(page).toHaveURL(/.*\/forgot-password/);
    
    // Fill in email
    await page.fill('input[type="email"]', 'test@example.com');
    
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled({ timeout: 15000 });
    await submitBtn.click();
    
    // Expect success message
    await expect(page.locator('text="Check your email for the password reset link"')).toBeVisible({ timeout: 10000 });
  });
});
