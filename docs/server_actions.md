# Server Actions Logic & State Mutations

*This file documents the Next.js Server Actions used for mutations, server-side operations, form processing, and integrations.*

---

## 1. Design & Security Patterns
*   **Directive:** Declared with `"use server"` at the top of action files.
*   **Security & Authorization:** All administrative server actions verify the user session via `verifySession()` from `actions/auth.js`.
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
*   `actions/ai/device-actions.js`: `generateDeviceData(deviceName, brand)`, `generateDeviceDataFromUrl(url)`, `generateGalleryImageAltsAction(deviceName, brand, images)`. Fetches `DeviceAttribute` spec schema dynamically from PostgreSQL (`getDeviceAttributesQuery()`).

---

### Analytics (`actions/analytics.js` & `lib/analytics/*`)
*   `getGoogleMetrics()`: Fetches active users, page views, clicks, and impressions via `@google-analytics/data` and `googleapis`.
*   `getDummySiteKitData()`: Located in `lib/analytics/dummy-data.js` for development fallback.

---

### Blogs (`actions/blogs.js`)
*   `publishedBlogs({ limit, offset, query, category })`: Fetches published blogs.
*   `getBlogs()`, `getBlogById(id)`: Reads blogs array.
*   `createBlog(formData)`, `updateBlog(id, formData)`: Creates/updates blog posts.
*   `trashBlog(id)`, `restoreBlog(id)`, `permanentlyDeleteBlog(id)`: Status transition mutations.

---

### Devices & Catalog (`actions/devices.js`)
*   `publishedDevices({ limit, offset, query, brand, filters })`: Fetches published smartphone products.
*   `publishedDevicesCount(...)`: Calculates total matching device count for pagination.
*   `getDevices(options)`: Admin query action that supports database sorting (`sortField`, `sortOrder`) and filtering.
*   `createDevice(...)`, `updateDevice(...)`, `deleteDevice(...)`: Smartphone entity CRUD operations with `imageAlts` SEO array support.
*   `setDeviceViewMode(mode)`: Sets user view mode preference (`'grid'` or `'list'`) in HTTP cookie `deviceViewMode` and revalidates `/phones`.
*   `getDeviceViewMode()`: Reads user view mode preference from HTTP cookies on server render pass (used by `app/(main)/phones/loading.js` for dynamic shimmer rendering).

---

### Device Attributes, Groups, Brands, Filters (`actions/device-*.js`)
*   `actions/device-attributes.js`: `getDeviceAttributes()`, `createDeviceAttribute()`, `updateDeviceAttribute()`, `deleteDeviceAttribute()`.
*   `actions/device-groups.js`: Spec group management.
*   `actions/device-brands.js`: Brand listing CRUD operations.
*   `actions/device-filters.js`: `getDeviceFilters()`, `saveDeviceFilters()`.
