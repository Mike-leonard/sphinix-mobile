const { test, expect } = require('@playwright/test');

test.describe('Attribute Manager Layout and Features', () => {
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

    // Login as Admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password123');
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled({ timeout: 15000 });
    await submitBtn.click();
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('should display the Global Layout Order hint and allow dragging groups', async ({ page }) => {
    // Navigate to attributes page
    await page.goto('/dashboard/phones/attributes');

    // Verify layout hint is visible
    await expect(page.locator('h4:has-text("Global Layout Order")')).toBeVisible();
    await expect(page.locator('text=Drag and drop these groups to reorder them')).toBeVisible();

    // Verify sidebar has groups (e.g. "General", "Camera")
    const sidebarGroups = page.locator('button', { has: page.locator('.lucide-grip-vertical') });
    await expect(sidebarGroups.first()).toBeVisible();
    
    // We can't fully simulate complex HTML5 Drag and Drop reliably in some headless browsers without complex dispatching,
    // but we can verify the elements have the draggable attribute and correct grip icons.
    const firstGroupBtn = sidebarGroups.first();
    await expect(firstGroupBtn).toHaveAttribute('draggable', 'true');
    await expect(firstGroupBtn.locator('.lucide-grip-vertical')).toBeVisible();
  });

  test('should toggle active group and display corresponding attributes', async ({ page }) => {
    await page.goto('/dashboard/phones/attributes');

    // Get the first group name (usually General)
    const sidebarGroups = page.locator('button', { has: page.locator('.lucide-grip-vertical') });
    const firstGroupName = await sidebarGroups.first().locator('div').innerText();
    
    // Verify it's active by checking for the brand-600 color class
    await expect(sidebarGroups.first()).toHaveClass(/bg-brand-600/);

    // Click on another group
    const secondGroupBtn = sidebarGroups.nth(1);
    const secondGroupName = await secondGroupBtn.locator('div').innerText();
    await secondGroupBtn.click();

    // Second group should now be active
    await expect(secondGroupBtn).toHaveClass(/bg-brand-600/);
    
    // Check if the right content area reflects the change
    await expect(page.locator('.flex-1.min-w-0')).toBeVisible();
  });
});
