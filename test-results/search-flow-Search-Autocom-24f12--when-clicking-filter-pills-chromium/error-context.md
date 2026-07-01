# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: search-flow.spec.js >> Search Autocomplete Flow >> should filter dropdown by scope when clicking filter pills
- Location: e2e/search-flow.spec.js:19:3

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('[data-slot="badge"]').filter({ hasText: /^Devices$/ }).last()
Expected pattern: /bg-brand-600/
Received string:  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3! border-border [a]:hover:bg-muted [a]:hover:text-muted-foreground cursor-pointer px-3 py-1 text-xs font-semibold transition-colors text-slate-600 dark:text-slate-400"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('[data-slot="badge"]').filter({ hasText: /^Devices$/ }).last()
    14 × locator resolved to <span data-slot="badge" data-variant="outline" class="group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3! border-border [a]:hover:b…>Devices</span>
       - unexpected value "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3! border-border [a]:hover:bg-muted [a]:hover:text-muted-foreground cursor-pointer px-3 py-1 text-xs font-semibold transition-colors text-slate-600 dark:text-slate-400"

```

```yaml
- text: Devices
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Search Autocomplete Flow', () => {
  4  |   test('should display autocomplete dropdown with mixed results', async ({ page }) => {
  5  |     await page.goto('/');
  6  | 
  7  |     // Locate the search input (it should be in the right sidebar)
  8  |     // We target by placeholder and take the last one (desktop version)
  9  |     const searchInput = page.getByPlaceholder(/Search model, brand/i).last();
  10 |     
  11 |     // Type a query that matches mock data
  12 |     await searchInput.fill('Galaxy');
  13 | 
  14 |     // The dropdown should appear and contain Galaxy S24 Ultra
  15 |     const dropdownItem = page.getByText('Galaxy S24 Ultra').first();
  16 |     await expect(dropdownItem).toBeVisible();
  17 |   });
  18 | 
  19 |   test('should filter dropdown by scope when clicking filter pills', async ({ page }) => {
  20 |     await page.goto('/');
  21 | 
  22 |     const searchInput = page.getByPlaceholder(/Search model, brand/i).last();
  23 |     await searchInput.fill('Galaxy');
  24 | 
  25 |     // Click the "Devices" scope pill
  26 |     const devicesPill = page.locator('[data-slot="badge"]', { hasText: /^Devices$/ }).last();
  27 |     await devicesPill.click({ force: true });
  28 | 
  29 |     // Now it should ONLY show devices, so "Blogs" header in results shouldn't be there
  30 |     // We expect the Blog specific items to be hidden
  31 |     await expect(page.getByText('Samsung Galaxy S24 Ultra Review')).toBeHidden();
  32 |     
  33 |     // Let's just verify the active state changed visually for now
> 34 |     await expect(devicesPill).toHaveClass(/bg-brand-600/);
     |                               ^ Error: expect(locator).toHaveClass(expected) failed
  35 |   });
  36 | });
  37 | 
```