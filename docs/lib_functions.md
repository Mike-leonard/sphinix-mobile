# Lib Functions & Utilities Reference

*This file lists the shared library utilities, helper functions, formatters, modular API abstraction wrappers, and global instances configuration.*

---

## 1. Directory Structure
*   Utility modules and helper functions are situated in: `lib/...`

## 2. Utility References

### Module: `lib/affiliate-helpers.js`
*   **Purpose:** Pure helper module for affiliate country normalization, store link state mutations, and active market counts.
*   **Key Functions:**
    *   `normalizeCountryRecord(c)`: Normalizes country database records, ensuring ISO code, flag, currency symbol, and lowercase store arrays are formatted consistently.
    *   `normalizeAffiliates(affiliates, availableCountries)`: Guarantees active markets structure and default stores exist for every active country record.
    *   `updateStoreInAffiliates(current, countryCode, storeId, field, value)`: Pure state updater for modifying store URL/price entries.
    *   `deleteStoreFromAffiliates(current, countryCode, storeId)`: Pure state updater for removing a store from a country's affiliate links.
    *   `countActiveMarkets(affiliates)`: Returns total count of countries with at least 1 configured store link.

### Module: `lib/utils.js`
*   **Purpose:** Miscellaneous utility functions (formatting, Tailwind class name concatenation, slug formatting).
*   **Key Functions:**
    *   `cn(...inputs)`: Merges Tailwind/CSS class names cleanly using `clsx` and `tailwind-merge`. Used by UI components like `Skeleton` (`components/ui/skeleton.jsx`).
    *   `generateBlogSlug(title)`: Takes a raw string, splits by special characters, trims, lowercases, and replaces non-alphanumeric characters with hyphens to create URL-safe slugs for dynamic routing.
    *   `generateDeviceSlug(title)`: Alias mapped to `generateBlogSlug` to maintain consistency across domain entities.
    *   `generateBrandSlug(brand)`: Generates URL-friendly brand slugs.

### Module: `lib/settings-helpers.js`
*   **Purpose:** Deep merging default settings schemas with database JSON values.
*   **Key Functions:**
    *   `deepMergeSettings(target, source)`: Recursively merges target default objects with user override values from PostgreSQL, ensuring missing schema keys are safely populated without crashing the UI.

### Module: `config/default-settings.js`
*   **Purpose:** Single source of truth constant for all default application settings (`defaultSettings`), covering SEO, typography, appearance, analytics, advertisements, comments, localization, maintenance, social media, media, security, and AI defaults.

### Module: `lib/ai/text-generator.js`
*   **Purpose:** Multi-provider LLM text generator driver supporting Gemini, OpenAI, Anthropic, OpenRouter, Kilo, and Ollama.
*   **Key Functions:**
    *   `generateText(prompt, systemInstruction, jsonMode)`: Queries the active AI provider configured in settings or `.env` and returns raw or structured JSON output.

### Module: `lib/ai/jina-scraper.js`
*   **Purpose:** Integration with Jina Reader API (`https://r.jina.ai/`).
*   **Key Functions:**
    *   `fetchPageContentWithJina(url, timeoutMs)`: Scrapes clean Markdown text from web URLs with timeout guards.

### Module: `lib/analytics/google-clients.js`
*   **Purpose:** Authentication and client initialization for Google Analytics 4 Data API (`@google-analytics/data`) and Google Search Console API (`googleapis`).
*   **Key Functions:**
    *   `getGoogleAuthCredentials()`: Resolves credentials from `.env` (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY` with newline replacement) or falls back to `data/google-credentials.json`.
    *   `getGoogleApiClients()`: Returns initialized `BetaAnalyticsDataClient` and Google Webmasters client instances.

### Module: `lib/analytics/dummy-data.js`
*   **Purpose:** Generates mock analytics and search traffic chart data when Google API credentials are not present or when API error boundaries trigger.
*   **Key Functions:**
    *   `getDummySiteKitData()`: Returns fallback metrics, 28-day chart arrays, and channels breakdown.

### Module: `lib/prisma.js`
*   **Purpose:** Singleton Prisma Client instance manager with hot-reload protection for Next.js development server environments.

---

## 3. Global Contexts

### Module: `context/CompareContext.jsx`
*   **Purpose:** Centralized global state provider for managing device comparisons across the application.
*   **Exports:**
    *   `CompareProvider`: Context Provider component wrapping the app.
    *   `useCompare()`: Custom hook to access comparison state (`compareList`, `isCompareOpen`) and toggle actions (`handleToggleCompare`, `clearCompare`).

### Module: `context/SettingsContext.jsx`
*   **Purpose:** Exposes dynamic site settings (such as dynamic typography font sizes and global SEO rules) to client components without prop-drilling.
*   **Exports:**
    *   `SettingsProvider`: Injects settings into CSS custom properties (`--font-size-h1-default`, etc.).
    *   `useSettings()`: Hook to read dynamic site configuration variables.
