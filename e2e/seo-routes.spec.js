import { test, expect } from '@playwright/test';

test.describe('SEO Routes Verification', () => {
  test('should serve robots.txt with text/plain content type', async ({ page }) => {
    // Navigate to the robots.txt route
    const response = await page.goto('/robots.txt');
    
    // Check status code
    expect(response.status()).toBe(200);
    
    // Verify it is served as plain text
    expect(response.headers()['content-type']).toContain('text/plain');
    
    // Verify default custom content is present
    const content = await response.text();
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
  });

  test('should serve sitemap.xml with XML format and valid routes', async ({ page }) => {
    // Navigate to the sitemap route
    const response = await page.goto('/sitemap.xml');
    
    // Check status code
    expect(response.status()).toBe(200);
    
    // Verify it is served as XML
    expect(response.headers()['content-type']).toContain('application/xml');
    
    // Verify the sitemap contains the default core routes
    const content = await response.text();
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<urlset');
    
    // Check for the main URL
    expect(content).toContain('<loc>https://sphinix-mobile.com</loc>');
    
    // Check for nested core routes
    expect(content).toContain('<loc>https://sphinix-mobile.com/phones</loc>');
    expect(content).toContain('<loc>https://sphinix-mobile.com/blogs</loc>');
  });
});
