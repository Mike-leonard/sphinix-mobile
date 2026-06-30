import { test, expect } from '@playwright/test';

test.describe('Theme Toggling', () => {
  test('should toggle dark mode on and off', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Next-themes defaults to dark mode based on layout.js defaultTheme="dark"
    // Check if the html tag has the 'dark' class
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);

    // Locate the theme toggle button (by aria-label)
    const themeToggleButton = page.locator('button[aria-label="Toggle Theme"]');
    await expect(themeToggleButton).toBeVisible();

    // Click the toggle to switch to light mode
    await themeToggleButton.click();

    // Verify the 'dark' class is removed from the html element
    await expect(htmlElement).not.toHaveClass(/dark/);

    // Click the toggle again to switch back to dark mode
    await themeToggleButton.click();

    // Verify the 'dark' class is added back
    await expect(htmlElement).toHaveClass(/dark/);
  });
});
