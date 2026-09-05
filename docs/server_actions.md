# Server Actions Logic & State Mutations

*This file documents the Next.js Server Actions used for mutations, server-side operations, form processing, and integrations.*

---

## 1. Design & Security Patterns
*   **Directive:** Declared with `"use server"` at the top of action files.
*   **Security & Authorization:** All administrative server actions verify the user session via `verifySession()` from `actions/auth.js`.
*   **Status Protection Security Rule:** `trashBlog(id)` and `trashDevice(id)` check status before trashing. Published items cannot be trashed directly; they must first be set to `draft` status.
*   **JSDoc Standardized Hints:** Every Server Action file contains standardized JSDoc headers (`@description`, `@why`, `@where`, `@security`, `@param`, `@returns`) documenting execution behavior and call sites.
*   **Data Persistence:** PostgreSQL database persistence executed via `queries/` layer using Prisma ORM.
*   **100% Backward Compatibility Re-exports:** Large Server Action modules (like `actions/ai.js`) are modularized into domain sub-modules while re-exporting all functions from the root file for seamless compatibility across the codebase.

---

## 2. Server Action Index

### Authentication (`actions/auth.js`)
*   `verifySession()`: Parses the session cookie, verifies Supabase auth & Prisma user session payload.
*   `loginAction(email, password)`: Authenticates user credentials and sets HttpOnly session cookie.
*   `logoutAction()`: Clears the session cookie.

---

### Cloudflare R2 Media Management (`actions/media-actions.js`)
*   `uploadMediaToR2(formData)`: Uploads image file buffer directly to Cloudflare R2 bucket with unique timestamped keys, returns public CDN URL. Protected by `verifySession()`.
*   `listR2MediaFiles()`: Fetches inventory of images stored in the R2 bucket (`ListObjectsV2Command`) with keys, URLs, and timestamps.
*   `deleteMediaFromR2(fileKey)`: Removes image asset from the R2 bucket (`DeleteObjectCommand`). Protected by `verifySession()`.

---

### Settings (`actions/settings.js`)
*   `getSettings()`: Fetches settings from PostgreSQL with `unstable_cache` tag `['site-settings']` and performs `deepMergeSettings` with `defaultSettings`.
*   `updateSettings(newSettings)`: Updates `SiteSettings` in PostgreSQL, invalidates cache tag via `revalidateTag('site-settings')`, and revalidates site layouts.

---

### Affiliate Countries & Geo-Targeting (`actions/affiliate-countries.js` & `actions/geo.js`)
*   `actions/affiliate-countries.js`:
    *   `getAffiliateCountries()`: Fetches all target market records (triggers pre-seeding if table is empty).
    *   `getPublishedAffiliateCountries()`: Fetches enabled country markets for public UI rendering.
    *   `createAffiliateCountry(data)`: Creates a target market record (protected by `verifySession()`).
    *   `updateAffiliateCountry(id, data)`: Updates market settings, default status, or store list (`verifySession()`).
    *   `deleteAffiliateCountry(id)`: Removes a market record (`verifySession()`).
*   `actions/geo.js`:
    *   `detectVisitorCountry()`: Safe server action utilizing dynamic `require('geoip-lite')` inside an execution `try/catch` block. Inspects Vercel/Cloudflare headers (`x-vercel-ip-country`, `cf-ipcountry`, `x-country-code`) and client IP, returning the 2-letter ISO country code (defaults to `"US"`). Safe from Next.js server initialization crashes.

---

### AI Integrations (`actions/ai.js` & `actions/ai/*`)
Modularized into:
*   `actions/ai/blog-actions.js`: `generateBlogFromTitle(title)`, `generateBlogFromUrl(url)`.
*   `actions/ai/seo-actions.js`: `generateSEOFromContent(content, title)`, `generateDeviceSEO(deviceName, brand, description)`.
*   `actions/ai/device-actions.js`: 
    *   `generateDeviceData(deviceName, brand)`: Generates quickSpecs and detailedSpecs.
    *   `generateDeviceDataFromUrl(url)`: Scrapes external spec page via Jina and parses specs into form payload.
    *   `generateGalleryImageAltsAction(deviceName, brand, images)`: Auto-suggests SEO image alt text for gallery images.
    *   `generateSingleAttributeValue(deviceName, brand, groupName, attrName, attrSlug)`: Live searches web specs via Jina to fill an individual spec attribute without hallucination.
    *   `validateDeviceSpecsWithWeb(deviceName, brand, specs)`: Cross-validates all device specs against scraped web search ground truth and returns discrepancy matrix.

---

### Analytics (`actions/analytics.js` & `lib/analytics/*`)
*   `getGoogleMetrics()`: Fetches active users, page views, clicks, and impressions via `@google-analytics/data` and `googleapis`.
*   `getDummySiteKitData()`: Located in `lib/analytics/dummy-data.js` for development fallback.

---

### Blogs (`actions/blogs.js`)
*   `publishedBlogs({ limit, offset, query, category })`: Fetches published blogs.
*   `getBlogs()`, `getBlogById(id)`: Reads blogs array.
*   `createBlog(formData)`, `updateBlog(id, formData)`: Creates/updates blog posts.
*   `duplicateBlog(id)`: Admin action: creates a duplicate copy of an existing blog article in `Draft` status titled `"[Original Title] (Copy)"` with a clean unique slug.
*   `trashBlog(id)`: Soft-deletes a blog. Enforces protection error if post status is `published`.
*   `restoreBlog(id)`, `permanentlyDeleteBlog(id)`: Status transition mutations.

---

### Devices & Catalog (`actions/devices.js`)
*   `publishedDevices({ limit, offset, query, brand, filters })`: Fetches published smartphone products.
*   `publishedDevicesCount(...)`: Calculates total matching device count for pagination.
*   `getDevices(options)`: Admin query action supporting database sorting (`sortField`, `sortOrder`) and filtering.
*   `createDevice(formData)`: Smartphone creation with `imageAlts` SEO array support and structured `specs` JSON payload.
*   `updateDevice(id, formData)`: Smartphone update action. The device's primary key `id` (slug) remains permanent to prevent broken links even if the title changes.
*   `duplicateDevice(id)`: Admin action: creates a duplicate copy of an existing device in `Draft` status titled `"[Original Name] (Copy)"` with a clean unique slug.
*   `trashDevice(id)`: Soft-deletes a device. Enforces protection error if device status is `published`.
*   `deleteDevice(id)`: Permanently deletes a device record.
*   `setDeviceViewMode(mode)`: Sets user view mode preference (`'grid'` or `'list'`) in HTTP cookie `deviceViewMode` and revalidates `/phones`.
*   `getDeviceViewMode()`: Reads user view mode preference from HTTP cookies on server render pass (used by `app/(main)/phones/loading.js` for dynamic shimmer rendering).

---

### Device Attributes, Groups, Brands, Filters (`actions/device-*.js`)
*   `actions/device-attributes.js`: `getDeviceAttributes()`, `createDeviceAttribute()`, `updateDeviceAttribute()`, `deleteDeviceAttribute()`, `addAttributeTerm()`, `deleteAttributeTerm()`, `reorderDeviceAttributes()`.
*   `actions/device-groups.js`: Spec group management and reordering.
*   `actions/device-brands.js`: Brand listing CRUD operations.
*   `actions/device-filters.js`: `getDeviceFilters()`, `saveDeviceFilters()`.
*   `actions/rating-bars.js`: `getRatingBars()`, `createRatingBar()`, `updateRatingBar()`, `deleteRatingBar()`, `reorderRatingBars()`.
