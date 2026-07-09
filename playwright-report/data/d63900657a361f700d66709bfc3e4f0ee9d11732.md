# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: theme.spec.js >> Theme Toggling >> should toggle dark mode on and off
- Location: e2e/theme.spec.js:4:7

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('html')
Expected pattern: /dark/
Received string:  "light"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('html')
    13 × locator resolved to <html lang="en" class="light">…</html>
       - unexpected value "light"

```

```yaml
- document:
  - banner
  - main
  - contentinfo
  - alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Theme Toggling', () => {
  4  |   test('should toggle dark mode on and off', async ({ page }) => {
  5  |     // Navigate to the homepage
  6  |     await page.goto('/');
  7  | 
  8  |     // Next-themes defaults to dark mode based on layout.js defaultTheme="dark"
  9  |     // Check if the html tag has the 'dark' class
  10 |     const htmlElement = page.locator('html');
> 11 |     await expect(htmlElement).toHaveClass(/dark/);
     |                               ^ Error: expect(locator).toHaveClass(expected) failed
  12 | 
  13 |     // Locate the theme toggle button (by aria-label)
  14 |     const themeToggleButton = page.locator('button[aria-label="Toggle Theme"]');
  15 |     await expect(themeToggleButton).toBeVisible();
  16 | 
  17 |     // Click the toggle to switch to light mode
  18 |     await themeToggleButton.click();
  19 | 
  20 |     // Verify the 'dark' class is removed from the html element
  21 |     await expect(htmlElement).not.toHaveClass(/dark/);
  22 | 
  23 |     // Click the toggle again to switch back to dark mode
  24 |     await themeToggleButton.click();
  25 | 
  26 |     // Verify the 'dark' class is added back
  27 |     await expect(htmlElement).toHaveClass(/dark/);
  28 |   });
  29 | });
  30 | 
```