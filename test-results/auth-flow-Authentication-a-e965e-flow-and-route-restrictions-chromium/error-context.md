# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-flow.spec.js >> Authentication and Role-Based Routing >> normal user flow and route restrictions
- Location: e2e/auth-flow.spec.js:38:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*\/login/
Received string:  "http://localhost:3000/"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    12 × unexpected value "http://localhost:3000/"

```

```yaml
- banner:
  - link "SPHINIX MOBILE":
    - /url: /
  - navigation:
    - link "Home":
      - /url: /
    - link "Devices":
      - /url: /devices
    - link "Comparisons":
      - /url: /comparisons
    - link "Blogs":
      - /url: /blogs
    - button "Compare"
    - text: Select items to compare
  - button "Toggle Theme"
  - button "Toggle profile menu": N Normal User normal@example.com
- main:
  - text: Custom Ad 728 x 90 (Leaderboard) DISCOVER NEXT-GEN TECHNOLOGY
  - heading "Sphinix Flagship Hub" [level=1]
  - paragraph: Compare hardware specifications, view expert scores, and find the perfect phone matching your budget.
  - button "Compare Now"
  - button "Watch Video"
  - text: READ REAL-WORLD EXPERT BLOGS
  - heading "Unbiased Mobile Reviews" [level=1]
  - paragraph: Our testers push screen brightness, camera sensors, and battery limits to provide reviews you can trust.
  - button "Read Reviews"
  - button "Watch Video"
  - text: Sphinix Dev Galaxy S24 Ultra 120Hz LTPO OLED Sphinix Dev iPhone 16 Pro Max 120Hz LTPO OLED
  - button
  - button
  - button
  - button
  - heading "Latest Products" [level=2]
  - paragraph: Showing 8 devices based on filters
  - link "OnePlus OnePlus 12 OnePlus ★ 4.8 OnePlus 12 Processor Snapdragon Display 6.82\" QHD+ Camera 50MP Primary RAM 16GB LPDDR5X":
    - /url: /devices/oneplus-12
    - text: OnePlus OnePlus 12 OnePlus ★ 4.8
    - heading "OnePlus 12" [level=3]
    - text: Processor Snapdragon Display 6.82" QHD+ Camera 50MP Primary RAM 16GB LPDDR5X
  - text: $799
  - checkbox "Compare"
  - text: Compare
  - link "Samsung Galaxy S24 Ultra Samsung ★ 4.9 Galaxy S24 Ultra Processor Snapdragon Display 6.8\" QHD+ Camera 200MP Primary RAM 12GB LPDDR5X":
    - /url: /devices/galaxy-s24-ultra
    - text: Samsung Galaxy S24 Ultra Samsung ★ 4.9
    - heading "Galaxy S24 Ultra" [level=3]
    - text: Processor Snapdragon Display 6.8" QHD+ Camera 200MP Primary RAM 12GB LPDDR5X
  - text: $1,299
  - checkbox "Compare"
  - text: Compare
  - link "Apple iPhone 16 Pro Max Apple ★ 4.9 iPhone 16 Pro Max Processor Apple Display 6.9\" Super Camera 48MP Primary RAM 8GB Unified Memory":
    - /url: /devices/iphone-16-pro-max
    - text: Apple iPhone 16 Pro Max Apple ★ 4.9
    - heading "iPhone 16 Pro Max" [level=3]
    - text: Processor Apple Display 6.9" Super Camera 48MP Primary RAM 8GB Unified Memory
  - text: $1,199
  - checkbox "Compare"
  - text: Compare
  - link "Google Google Pixel 9 Pro XL Google ★ 4.7 Google Pixel 9 Pro XL Processor Google Display 6.8\" Super Camera 50MP Primary RAM 16GB RAM":
    - /url: /devices/google-pixel-9-pro-xl
    - text: Google Google Pixel 9 Pro XL Google ★ 4.7
    - heading "Google Pixel 9 Pro XL" [level=3]
    - text: Processor Google Display 6.8" Super Camera 50MP Primary RAM 16GB RAM
  - text: $1,099
  - checkbox "Compare"
  - text: Compare
  - link "OnePlus OnePlus 11R OnePlus ★ 4.6 OnePlus 11R Processor Snapdragon Display 6.74\" AMOLED Camera 50MP Primary RAM 8GB / 16GB":
    - /url: /devices/oneplus-11r
    - text: OnePlus OnePlus 11R OnePlus ★ 4.6
    - heading "OnePlus 11R" [level=3]
    - text: Processor Snapdragon Display 6.74" AMOLED Camera 50MP Primary RAM 8GB / 16GB
  - text: $499
  - checkbox "Compare"
  - text: Compare
  - link "OnePlus OnePlus Nord 3 OnePlus ★ 4.5 OnePlus Nord 3 Processor MediaTek Display 6.74\" AMOLED Camera 50MP Primary RAM 8GB / 16GB":
    - /url: /devices/oneplus-nord-3
    - text: OnePlus OnePlus Nord 3 OnePlus ★ 4.5
    - heading "OnePlus Nord 3" [level=3]
    - text: Processor MediaTek Display 6.74" AMOLED Camera 50MP Primary RAM 8GB / 16GB
  - text: $399
  - checkbox "Compare"
  - text: Compare Custom Ad Ad Space
  - heading "Experience the Future of Mobile" [level=4]
  - paragraph: Discover the latest deals on flagship devices and exclusive carrier offers. Upgrade today and save up to $500 on trade-ins.
  - link "Learn More":
    - /url: "#"
  - link "Google Google Pixel 6a Google ★ 4.4 Google Pixel 6a Processor Google Display 6.1\" OLED Camera 12.2MP Primary RAM 6GB RAM":
    - /url: /devices/google-pixel-6a
    - text: Google Google Pixel 6a Google ★ 4.4
    - heading "Google Pixel 6a" [level=3]
    - text: Processor Google Display 6.1" OLED Camera 12.2MP Primary RAM 6GB RAM
  - text: $299
  - checkbox "Compare"
  - text: Compare
  - link "LG LG G6 (Legacy) LG ★ 4.2 LG G6 (Legacy) Processor Snapdragon Display 5.7\" IPS Camera 13MP Primary RAM 4GB RAM":
    - /url: /devices/lg-g6-legacy
    - text: LG LG G6 (Legacy) LG ★ 4.2
    - heading "LG G6 (Legacy)" [level=3]
    - text: Processor Snapdragon Display 5.7" IPS Camera 13MP Primary RAM 4GB RAM
  - text: $149
  - checkbox "Compare"
  - text: Compare
  - link "View More Devices":
    - /url: /devices
  - text: Custom Ad 728 x 90 (Leaderboard)
  - heading "Latest News & Tech Articles" [level=2]
  - paragraph: Stay updated with deep technical benchmarks and mobile news
  - 'link "SPHINIX Processors June 28, 2026 • 5 min read • By Leonard Tech The Mobile Chip War: Apple A18 Pro vs Snapdragon 8 Gen 4 (Part 1) We analyze the upcoming 3nm architectures, detailing single-core performance leaps and battery management upgrades. Read Full Article →"':
    - /url: /blogs/the-mobile-chip-war
    - text: SPHINIX Processors June 28, 2026 • 5 min read • By Leonard Tech
    - 'heading "The Mobile Chip War: Apple A18 Pro vs Snapdragon 8 Gen 4 (Part 1)" [level=3]'
    - paragraph: We analyze the upcoming 3nm architectures, detailing single-core performance leaps and battery management upgrades.
    - text: Read Full Article →
  - link "SPHINIX Cameras June 25, 2026 • 8 min read • By Sarah Lens Is 200 Megapixels Overkill? The Science of Mobile Sensors (Part 2) Why pixel binning, sensor size, and neural imaging processors dictate image quality much more than resolution counts. Read Full Article →":
    - /url: /blogs/is-200-megapixels-overkill
    - text: SPHINIX Cameras June 25, 2026 • 8 min read • By Sarah Lens
    - heading "Is 200 Megapixels Overkill? The Science of Mobile Sensors (Part 2)" [level=3]
    - paragraph: Why pixel binning, sensor size, and neural imaging processors dictate image quality much more than resolution counts.
    - text: Read Full Article →
  - link "SPHINIX Speculations June 21, 2026 • 6 min read • By Alex Vintage Will LG Ever Return to the Smartphone Market? (Part 3) A nostalgic review of LG's pioneering smartphone designs and an analytical forecast of mobile market dynamics. Read Full Article →":
    - /url: /blogs/will-lg-ever-return-to-the-smartphone-market
    - text: SPHINIX Speculations June 21, 2026 • 6 min read • By Alex Vintage
    - heading "Will LG Ever Return to the Smartphone Market? (Part 3)" [level=3]
    - paragraph: A nostalgic review of LG's pioneering smartphone designs and an analytical forecast of mobile market dynamics.
    - text: Read Full Article →
  - 'link "SPHINIX Software June 28, 2026 • 5 min read • By Leonard Tech The Mobile Chip War: Apple A18 Pro vs Snapdragon 8 Gen 4 (Part 4) We analyze the upcoming 3nm architectures, detailing single-core performance leaps and battery management upgrades. Read Full Article →"':
    - /url: /blogs/the-mobile-chip-war
    - text: SPHINIX Software June 28, 2026 • 5 min read • By Leonard Tech
    - 'heading "The Mobile Chip War: Apple A18 Pro vs Snapdragon 8 Gen 4 (Part 4)" [level=3]'
    - paragraph: We analyze the upcoming 3nm architectures, detailing single-core performance leaps and battery management upgrades.
    - text: Read Full Article →
  - text: Custom Ad Ad Space
  - heading "Experience the Future of Mobile" [level=4]
  - paragraph: Discover the latest deals on flagship devices and exclusive carrier offers. Upgrade today and save up to $500 on trade-ins.
  - link "Learn More":
    - /url: "#"
  - link "SPHINIX Industry June 25, 2026 • 8 min read • By Sarah Lens Is 200 Megapixels Overkill? The Science of Mobile Sensors (Part 5) Why pixel binning, sensor size, and neural imaging processors dictate image quality much more than resolution counts. Read Full Article →":
    - /url: /blogs/is-200-megapixels-overkill
    - text: SPHINIX Industry June 25, 2026 • 8 min read • By Sarah Lens
    - heading "Is 200 Megapixels Overkill? The Science of Mobile Sensors (Part 5)" [level=3]
    - paragraph: Why pixel binning, sensor size, and neural imaging processors dictate image quality much more than resolution counts.
    - text: Read Full Article →
  - link "SPHINIX Processors June 21, 2026 • 6 min read • By Alex Vintage Will LG Ever Return to the Smartphone Market? (Part 6) A nostalgic review of LG's pioneering smartphone designs and an analytical forecast of mobile market dynamics. Read Full Article →":
    - /url: /blogs/will-lg-ever-return-to-the-smartphone-market
    - text: SPHINIX Processors June 21, 2026 • 6 min read • By Alex Vintage
    - heading "Will LG Ever Return to the Smartphone Market? (Part 6)" [level=3]
    - paragraph: A nostalgic review of LG's pioneering smartphone designs and an analytical forecast of mobile market dynamics.
    - text: Read Full Article →
  - 'link "SPHINIX Cameras June 28, 2026 • 5 min read • By Leonard Tech The Mobile Chip War: Apple A18 Pro vs Snapdragon 8 Gen 4 (Part 7) We analyze the upcoming 3nm architectures, detailing single-core performance leaps and battery management upgrades. Read Full Article →"':
    - /url: /blogs/the-mobile-chip-war
    - text: SPHINIX Cameras June 28, 2026 • 5 min read • By Leonard Tech
    - 'heading "The Mobile Chip War: Apple A18 Pro vs Snapdragon 8 Gen 4 (Part 7)" [level=3]'
    - paragraph: We analyze the upcoming 3nm architectures, detailing single-core performance leaps and battery management upgrades.
    - text: Read Full Article →
  - link "SPHINIX Speculations June 25, 2026 • 8 min read • By Sarah Lens Is 200 Megapixels Overkill? The Science of Mobile Sensors (Part 8) Why pixel binning, sensor size, and neural imaging processors dictate image quality much more than resolution counts. Read Full Article →":
    - /url: /blogs/is-200-megapixels-overkill
    - text: SPHINIX Speculations June 25, 2026 • 8 min read • By Sarah Lens
    - heading "Is 200 Megapixels Overkill? The Science of Mobile Sensors (Part 8)" [level=3]
    - paragraph: Why pixel binning, sensor size, and neural imaging processors dictate image quality much more than resolution counts.
    - text: Read Full Article →
  - link "Read More Blogs":
    - /url: /blogs
  - heading "Search Database" [level=3]
  - textbox "Search model, brand, processor..."
  - text: Product Filter Type All Types Devices Blogs
  - heading "New Arrivals Hot" [level=3]
  - text: OnePlus $799 Galaxy $1,299 iPhone $1,199 Google $1,099
  - heading "Trending Articles" [level=3]
  - 'link "Img The Mobile Chip War: Apple A18 Pro vs Snapdragon 8 Gen 4 (Part 1) 5 min read • June 28, 2026"':
    - /url: /blogs
    - text: Img
    - 'heading "The Mobile Chip War: Apple A18 Pro vs Snapdragon 8 Gen 4 (Part 1)" [level=4]'
    - paragraph: 5 min read • June 28, 2026
  - link "Img Is 200 Megapixels Overkill? The Science of Mobile Sensors (Part 2) 8 min read • June 25, 2026":
    - /url: /blogs
    - text: Img
    - heading "Is 200 Megapixels Overkill? The Science of Mobile Sensors (Part 2)" [level=4]
    - paragraph: 8 min read • June 25, 2026
  - link "Img Will LG Ever Return to the Smartphone Market? (Part 3) 6 min read • June 21, 2026":
    - /url: /blogs
    - text: Img
    - heading "Will LG Ever Return to the Smartphone Market? (Part 3)" [level=4]
    - paragraph: 6 min read • June 21, 2026
  - 'link "Img The Mobile Chip War: Apple A18 Pro vs Snapdragon 8 Gen 4 (Part 4) 5 min read • June 28, 2026"':
    - /url: /blogs
    - text: Img
    - 'heading "The Mobile Chip War: Apple A18 Pro vs Snapdragon 8 Gen 4 (Part 4)" [level=4]'
    - paragraph: 5 min read • June 28, 2026
  - heading "Top Rated" [level=3]
  - text: OnePlus
  - heading "OnePlus 12" [level=4]
  - text: ★ 4.8 (48 votes) $799 Samsung
  - heading "Galaxy S24 Ultra" [level=4]
  - text: ★ 4.9 (49 votes) $1,299 Apple
  - heading "iPhone 16 Pro Max" [level=4]
  - text: ★ 4.9 (49 votes) $1,199
  - heading "Product Categories" [level=3]
  - list:
    - listitem:
      - button "Devices 95"
    - listitem:
      - button "Laptops 4"
    - listitem:
      - button "Digital Cameras 2"
    - listitem:
      - button "Cameras 0"
    - listitem:
      - button "DSLR Cameras 0"
    - listitem:
      - button "Gadgets 0"
  - heading "Popular Brands" [level=3]
  - button "All"
  - button "Apple"
  - button "Samsung"
  - button "OnePlus"
  - button "Google"
  - button "LG"
  - button "Nokia"
  - button "HTC"
  - button "Sony"
  - button "Motorola"
  - button "Huawei"
  - button "Oppo"
  - text: Custom Ad 300 x 600 (Half Page) Custom Ad 728 x 90 (Leaderboard)
- contentinfo:
  - text: SPHINIX MOBILE |
  - paragraph: © 2026 Sphinix Mobile. All rights reserved.
  - link "Privacy Policy":
    - /url: /privacy-policy
  - link "Terms of Service":
    - /url: /terms-of-service
  - link "Contact Support":
    - /url: /contact-support
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication and Role-Based Routing', () => {
  4  |   test('unauthenticated users are redirected to login from protected routes', async ({ page }) => {
  5  |     // Try to access dashboard
  6  |     await page.goto('/dashboard');
  7  |     await expect(page).toHaveURL(/.*\/login/);
  8  | 
  9  |     // Try to access activities
  10 |     await page.goto('/activities');
  11 |     await expect(page).toHaveURL(/.*\/login/);
  12 |   });
  13 | 
  14 |   test('admin user flow and route restrictions', async ({ page }) => {
  15 |     await page.goto('/login');
  16 |     
  17 |     // Login as Admin
  18 |     await page.fill('input[type="email"]', 'admin@example.com');
  19 |     await page.fill('input[type="password"]', 'password123');
  20 |     await page.click('button[type="submit"]');
  21 | 
  22 |     // Should redirect to dashboard
  23 |     await expect(page).toHaveURL(/.*\/dashboard/);
  24 | 
  25 |     // Navbar should have Admin User profile
  26 |     await expect(page.locator('text=Admin User').first()).toBeVisible();
  27 | 
  28 |     // Admin should not be able to access activities
  29 |     await page.goto('/activities');
  30 |     await expect(page).toHaveURL(/.*\/dashboard/);
  31 | 
  32 |     // Logout
  33 |     await page.click('button[aria-label="Toggle profile menu"]');
  34 |     await page.click('button:has-text("Logout")');
  35 |     await expect(page).toHaveURL(/.*\/login/);
  36 |   });
  37 | 
  38 |   test('normal user flow and route restrictions', async ({ page }) => {
  39 |     await page.goto('/login');
  40 |     
  41 |     // Login as Normal user
  42 |     await page.fill('input[type="email"]', 'normal@example.com');
  43 |     await page.fill('input[type="password"]', 'password123');
  44 |     await page.click('button[type="submit"]');
  45 | 
  46 |     // Should redirect to homepage (or activities, but let's assume home for now based on login flow)
  47 |     await expect(page).toHaveURL(/.*(\/|\/activities)$/);
  48 | 
  49 |     // Navbar should have Normal User profile
  50 |     await expect(page.locator('text=Normal User').first()).toBeVisible();
  51 | 
  52 |     // Normal user can access activities
  53 |     await page.goto('/activities');
  54 |     await expect(page).toHaveURL(/.*\/activities/);
  55 | 
  56 |     // Normal user should not be able to access dashboard
  57 |     await page.goto('/dashboard');
  58 |     await expect(page).toHaveURL(/.*\/$/); // Redirected to home
  59 | 
  60 |     // Logout
  61 |     await page.click('button[aria-label="Toggle profile menu"]');
  62 |     await page.click('button:has-text("Logout")');
> 63 |     await expect(page).toHaveURL(/.*\/login/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  64 |   });
  65 | });
  66 | 
```