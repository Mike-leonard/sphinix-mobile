import { test, expect } from '@playwright/test';

test.describe('Theme Toggling', () => {
  test('should toggle dark mode on and off', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    const htmlElement = page.locator('html');
    
    // Get the initial theme class (it might be 'light' or 'dark')
    const initialClass = await htmlElement.getAttribute('class');
    const isInitiallyDark = initialClass?.includes('dark');
    
    // Locate the theme toggle button
    const themeToggleButton = page.locator('button[aria-label="Toggle Theme"]');
    await expect(themeToggleButton).toBeVisible();

    // Click the toggle
    await themeToggleButton.click();

    // Wait for the class to update
    if (isInitiallyDark) {
      await expect(htmlElement).not.toHaveClass(/dark/);
      await expect(htmlElement).toHaveClass(/light/);
    } else {
      await expect(htmlElement).toHaveClass(/dark/);
      await expect(htmlElement).not.toHaveClass(/light/);
    }

    // Click again to switch back
    await themeToggleButton.click();

    // Verify it returned to the initial state
    if (isInitiallyDark) {
      await expect(htmlElement).toHaveClass(/dark/);
    } else {
      await expect(htmlElement).not.toHaveClass(/dark/);
    }
  });
});
