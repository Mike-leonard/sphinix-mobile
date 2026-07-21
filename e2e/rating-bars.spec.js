const { test, expect } = require('@playwright/test');

test.describe('Rating Bars Manager Layout and Features', () => {
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

  test('should display Rating Bars UI and allow interaction', async ({ page }) => {
    // Navigate to rating bars page
    await page.goto('/dashboard/phones/rating-bars');

    // Verify adding new bar section is visible
    await expect(page.locator('h2:has-text("Add New Rating Bar")')).toBeVisible();

    // Verify existing rating bars list is visible
    await expect(page.locator('h3:has-text("Existing Rating Bars")')).toBeVisible();
    
    // Generate a unique name for this test run
    const uniqueId = Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
    const testBarName = `Test Bar ${uniqueId}`;
    const testBarSlug = `test-bar-${uniqueId}`;

    // Type into the Name field and verify Slug is auto-populated
    const nameInput = page.locator('label:has-text("Name") + input');
    await nameInput.fill(testBarName);
    
    const slugInput = page.locator('label:has-text("Slug") + input');
    await expect(slugInput).toHaveValue(testBarSlug);

    // Add a new rating bar
    await page.click('button:has-text("Add New Rating Bar")');
    
    // Ensure the new item is listed in the table
    await expect(page.locator('table').locator('td', { hasText: testBarName })).toBeVisible();
    
    // We can't fully simulate complex HTML5 Drag and Drop reliably in some headless browsers without complex dispatching,
    // but we can verify the table rows have the draggable attribute and correct grip icons.
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toHaveAttribute('draggable', 'true');
    await expect(firstRow.locator('.lucide-grip-vertical')).toBeVisible();

    // Clean up: delete the test bar
    // Since window.confirm is used, we need to handle the dialog
    page.once('dialog', async dialog => {
      await dialog.accept();
    });
    
    const rowToDelete = page.locator('tbody tr', { hasText: testBarName });
    await rowToDelete.hover();
    
    const deleteBtn = rowToDelete.locator('button', { has: page.locator('.lucide-trash-2') });
    await deleteBtn.click({ force: true });
    
    await expect(page.locator('table').locator('td', { hasText: testBarName })).not.toBeVisible();
  });
});
