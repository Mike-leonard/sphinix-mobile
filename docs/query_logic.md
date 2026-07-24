# Query Logic & Data Fetching Strategies

*This file outlines the database query abstraction layer (`queries/`), caching strategies, pagination patterns, and server-side data fetching techniques.*

---

## 1. Modular Query Abstraction Layer (`queries/`)
Database interactions are isolated from Server Actions inside dedicated query modules:
*   `queries/settings.js`: Manages PostgreSQL `SiteSettings` Singleton fetches and updates.
*   `queries/device-attributes.js`: Queries device spec attributes and group relations.
*   `queries/device-brands.js`: Queries and manages brand records.
*   `queries/device-groups.js`: Handles spec categories and groups.
*   `queries/devices.js`: Fetches paginated devices, counts, and search results.
*   `queries/blogs.js`: Manages blog articles, filtering by status (`published`, `draft`, `trash`), and pagination.
*   `queries/users.js`: User profiles and authentication query logic.

---

## 2. Caching & Revalidation Strategy

### 1. Next.js `unstable_cache` & Tag Invalidation
*   **Site Settings Caching:** `getSettings()` wraps the PostgreSQL fetch in `unstable_cache` with cache tag `['site-settings']`:
    ```javascript
    export const getSettings = unstable_cache(
      async () => { ... },
      ['site-settings'],
      { tags: ['site-settings'] }
    );
    ```
*   **Targeted Revalidation:** On setting updates, `revalidateTag('site-settings')` purges the stale cache immediately so administrative changes reflect instant site-wide updates.
*   **Path Revalidation:** Server Actions trigger `revalidatePath(...)` on dynamic routes (e.g. `/phones`, `/blogs`, `/dashboard/settings/...`).

---

## 3. Query Patterns & Layout Limit Propagation

### 1. Dynamic Layout Limit Controls
*   Public list pages (`app/(main)/phones/page.js` and `app/(main)/blogs/page.js`) query site settings to determine pagination size (`ITEMS_PER_PAGE`):
    ```javascript
    const settings = await getSettings();
    const ITEMS_PER_PAGE = settings?.appearance?.phones?.deviceLimit 
      ?? settings?.appearance?.devices?.deviceLimit 
      ?? 12;
    ```
*   `DeviceGrid` passes `deviceCardSpecLimit` down to `ProductCard`, controlling how many key specification badges display on each product card dynamically.

### 2. Search, Filtering & Pagination
*   `publishedDevices({ limit, offset, query, brand, filters })` executes parallel PostgreSQL queries using Prisma `findMany` and `count` with offset-based pagination.
*   Sidebar filter parameters (`filter_price`, `filter_ram`, etc.) are parsed server-side into structured search filters.
