const { test, expect } = require('@playwright/test');

test.describe('Right Sidebar Dynamic Logic', () => {
  test('should hide NewArrivals on devices route and show LatestBlogs', async ({ page }) => {
    await page.goto('/devices');

    // On devices route, NewArrivals should be hidden
    await expect(page.locator('h3:has-text("New Arrivals")')).not.toBeVisible();

    // Trending Articles should be visible
    await expect(page.locator('h3:has-text("Trending Articles")')).toBeVisible();

    // Categories and Top Rated should also be visible
    await expect(page.locator('h3:has-text("Categories")')).toBeVisible();
    await expect(page.locator('h3:has-text("Top Rated")')).toBeVisible();
  });

  test('should hide BrandList on blogs route but show device cross-pollination', async ({ page }) => {
    await page.goto('/blogs');

    // On blogs route, BrandList should be hidden
    await expect(page.locator('h3:has-text("Brands")')).not.toBeVisible();

    // New Arrivals and Top Rated (Device content) should be visible (Cross-pollination)
    await expect(page.locator('h3:has-text("New Arrivals")')).toBeVisible();
    await expect(page.locator('h3:has-text("Top Rated")')).toBeVisible();

    // Trending Articles should also be visible
    await expect(page.locator('h3:has-text("Trending Articles")')).toBeVisible();
  });

  test('home page should show everything except categories optionally', async ({ page }) => {
    await page.goto('/');

    // Home page shows almost everything
    await expect(page.locator('h3:has-text("New Arrivals")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Trending Articles")').first()).toBeVisible();
    // In our logic, Categories is actually shown on the Home Route!
    await expect(page.locator('h3:has-text("Categories")').first()).toBeVisible();
  });
});
