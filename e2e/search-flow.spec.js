const { test, expect } = require('@playwright/test');

test.describe('Search Autocomplete Flow', () => {
  test('should display autocomplete dropdown with mixed results', async ({ page }) => {
    await page.goto('/');

    // Locate the search input (it should be in the right sidebar)
    // We target by placeholder and take the last one (desktop version)
    const searchInput = page.getByPlaceholder(/Search model, brand/i).last();
    
    // Type a query that matches mock data
    await searchInput.fill('Galaxy');

    // The dropdown should appear and contain Galaxy S24 Ultra
    const dropdownItem = page.getByText('Galaxy S24 Ultra').first();
    await expect(dropdownItem).toBeVisible();
  });

  test('should filter dropdown by scope when clicking filter pills', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder(/Search model, brand/i).last();
    await searchInput.fill('Galaxy');

    // Click the "Phones" scope pill
    const devicesPill = page.locator('[data-slot="badge"]', { hasText: /^Phones$/ }).last();
    await devicesPill.click({ force: true });

    // Now it should ONLY show devices, so "Blogs" header in results shouldn't be there
    // We expect the Blog specific items to be hidden
    await expect(page.getByText('Samsung Galaxy S24 Ultra Review')).toBeHidden();
    
  });
});
