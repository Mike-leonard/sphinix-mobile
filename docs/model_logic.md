# Model Logic & Schema Design

*This file outlines the PostgreSQL database models, Prisma schemas, JSON configurations, validations, and relational mappings within the project.*

---

## 1. Relational Database Architecture (Prisma & PostgreSQL)
Database persistence is managed via **Prisma ORM** connecting to a PostgreSQL database hosted on Supabase (with direct session-mode connection pooler support).

### Schema File: `prisma/schema.prisma`

---

## 2. Model Definitions & Entities

### Model: `SiteSettings` (Table: `SiteSettings`)
*   **Description:** Stores global application configuration columns formatted as JSON/JsonB. Uses a **Singleton Pattern** where `id = 1`.
*   **Fields:**
    *   `id`: Int (Primary Key, Default: `1`)
    *   `seo`: Json? (Meta titles, meta descriptions, open graph, structured data rules)
    *   `typography`: Json? (Dynamic H1-H3, body paragraph, button font sizes)
    *   `appearance`: Json? (Theme mode, primary brand colors, home/phones/blogs layout limits)
    *   `analytics`: Json? (GA4 property ID, Search Console site URL, visitor stats toggle)
    *   `advertisements`: Json? (Network config, ad placement toggles, in-feed injection frequencies)
    *   `comments`: Json? (Comment enablement, approval flags)
    *   `localization`: Json? (Site language, timezone)
    *   `maintenance`: Json? (Maintenance mode toggle, custom offline message)
    *   `socialMedia`: Json? (Brand social channel links)
    *   `media`: Json? (Max upload size, image compression, WebP conversion, CDN settings)
    *   `security`: Json? (Rate limit rules, reCAPTCHA keys, login attempt caps)
    *   `ai`: Json? (AI feature toggles, active provider, model name, API key, prompt configuration)
    *   `updatedAt`: DateTime (`@updatedAt`)

---

### Model: `AffiliateCountry` (Table: `AffiliateCountry`)
*   **Description:** Manages multi-country affiliate target markets, localized currency symbols, default retailer lists, and active status for Geo-IP target routing.
*   **Fields:**
    *   `id`: String (Primary Key, `cuid()`)
    *   `name`: String (Country name e.g. `"Italy"`, `"United States"`)
    *   `code`: String (Unique ISO country code e.g. `"IT"`, `"US"`, `"ES"`, `"BD"`)
    *   `flag`: String (Flag emoji e.g. `"🇮🇹"`, `"🇺🇸"`)
    *   `currencySymbol`: String (Localized symbol e.g. `"€"`, `"$"`, `"৳"`, `"CA$"`)
    *   `currencyCode`: String (ISO currency code e.g. `"EUR"`, `"USD"`, `"BDT"`)
    *   `isDefault`: Boolean (Default: `false`, fallback market indicator)
    *   `enabled`: Boolean (Default: `true`)
    *   `order`: Int (Default: `0`)
    *   `stores`: Json? (Array of default store names e.g. `["Amazon Italy", "MediaWorld", "Unieuro"]`)
    *   `createdAt`, `updatedAt`: DateTime

---

### Model: `User` (Table: `User`)
*   **Description:** Manages user profiles, credentials, role-based access control, and Supabase auth sync.
*   **Fields:**
    *   `id`: String (Primary Key, UUID or Supabase Auth ID)
    *   `email`: String (Unique)
    *   `password`: String? (Hashed password for local credentials)
    *   `name`: String
    *   `role`: String (Default: `"User"`, options: `"Admin"`, `"Editor"`, `"User"`)
    *   `emailVerified`: Boolean (Default: `false`)
    *   `image`: String?
    *   `createdAt`, `updatedAt`: DateTime

---

### Model: `Blog` (Table: `Blog`)
*   **Description:** Content articles for the tech news and benchmark blog.
*   **Fields:**
    *   `id`: String (Primary Key)
    *   `title`: String
    *   `slug`: String (Unique)
    *   `excerpt`: String?
    *   `content`: String (HTML content output from Tiptap editor)
    *   `category`: String (Default: `"General"`)
    *   `status`: StatusType Enum (`DRAFT`, `PUBLISHED`, `TRASHED`). Queries normalize UI string `'trash'` to `'TRASHED'`.
    *   `date`: String
    *   `readTime`: String?
    *   `author`: String?
    *   `coverImage`: String?
    *   `seo`: Json? (`metaTitle`, `metaDescription`, `keywords`)
    *   `createdAt`, `updatedAt`: DateTime

---

### Model: `Device` (Table: `Device`)
*   **Description:** Smartphone catalog database. Primary key `id` string serves as the URL slug (`/phones/[brandSlug]/[deviceSlug]`).
*   **Fields:**
    *   `id`: String (Primary Key / URL Slug). Generated upon creation or duplication, and remains permanent even if the device title is updated later to prevent broken URLs.
    *   `name`: String
    *   `brand`: String
    *   `image`: String?
    *   `price`: String?
    *   `status`: StatusType Enum (`DRAFT`, `PUBLISHED`, `TRASHED`). Queries normalize UI string `'trash'` to `'TRASHED'`.
    *   `affiliates`: Json? (Multi-country store link mappings e.g. `{ US: { amazon: { url, price } }, IT: { ... } }`)
    *   `specs`: Json? (Quick specs, detailed grouped spec attributes, gallery images, and `imageAlts` SEO array)
    *   `ratings`: Json? (Expert rating breakdown numbers)
    *   `overview`: String? (HTML overview description)
    *   `createdAt`, `updatedAt`: DateTime

---

### Models: `DeviceAttribute`, `DeviceGroup`, `DeviceBrand`, `DeviceFilter`
*   **Description:** Normalization tables for dynamic mobile spec groups, brand listings, and sidebar filter definitions.
*   **Key Fields:**
    *   `DeviceAttribute`: `id`, `name`, `slug`, `group`, `groupId`, `placeholder`, `order`, `terms`.
    *   `DeviceGroup`: `id`, `name`, `slug`, `order`.
    *   `DeviceBrand`: `id`, `name`, `slug`, `logo`.
    *   `DeviceFilter`: `id`, `title`, `attributeSlug`, `options`, `order`.

---

## 3. Data Caching & Merging Logic

1. **Singleton Helper (`getSettingsRow()`)**:
   ```javascript
   prisma.siteSettings.upsert({
     where: { id: 1 },
     update: {},
     create: { id: 1 }
   })
   ```
2. **Layered Settings Hydration Pipeline**:
   ```
   defaultSettings (code) ──► PostgreSQL (DB Row 1) ──► deepMergeSettings() ──► Cached Settings
   ```
3. **Aggressive Cache Layer (`unstable_cache`)**:
   Settings queries are wrapped in Next.js `unstable_cache` with tag `['site-settings']`. Updating settings invalidates the cache via `revalidateTag('site-settings')`.
