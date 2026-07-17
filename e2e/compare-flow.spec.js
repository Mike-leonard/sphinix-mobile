const { test, expect } = require('@playwright/test');

test.describe('Compare Flow', () => {
  test('should allow selecting multiple devices and opening the compare drawer', async ({ page }) => {
    await page.goto('/phones');

    // Find all the compare checkboxes
    const checkboxes = page.locator('input[type="checkbox"]');
    
    // Ensure they exist
    await expect(checkboxes.first()).toBeVisible();

    // Click the first two checkboxes to add to compare
    await checkboxes.nth(0).click();
    await checkboxes.nth(1).click();

    // Verify the floating "Compare List" button is visible and shows count '2'
    const compareFloatingBtn = page.locator('button', { hasText: 'Compare List' });
    await expect(compareFloatingBtn).toBeVisible();
    await expect(compareFloatingBtn).toContainText('2');

    // Click the floating compare button to open drawer
    await compareFloatingBtn.click();

    // Drawer should open and display 'Compare Devices'
    const drawerTitle = page.locator('text="Compare Devices"');
    await expect(drawerTitle).toBeVisible();

    // Verify it says "Comparing 2 of max 3"
    await expect(page.locator('text="Comparing 2 of max 3"')).toBeVisible();

    // Click the Clear All button inside the drawer
    await page.locator('button', { hasText: 'Clear All' }).click();

    // Drawer should close and the floating button should disappear
    await expect(compareFloatingBtn).not.toBeVisible();
  });

  test('should clear compare list using the X button on the floating widget', async ({ page }) => {
    await page.goto('/phones');

    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.nth(0).click();
    await checkboxes.nth(1).click();

    // Verify floating button is there
    const compareFloatingBtn = page.locator('button', { hasText: 'Compare List' });
    await expect(compareFloatingBtn).toBeVisible();

    // Click the 'X' button which has title="Clear Compare List"
    const clearBtn = page.locator('button[title="Clear Compare List"]');
    await clearBtn.click();

    // Floating button should instantly disappear
    await expect(compareFloatingBtn).not.toBeVisible();
  });
});
