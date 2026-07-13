# Lib Functions & Utilities Reference

*This file lists the shared library utilities, helper functions, formatters, and global instances configuration.*

---

## 1. Directory Structure
*   Utility modules are situated in: `lib/...`

## 2. Utility References

### Module: `lib/utils.js`
*   **Purpose:** Miscellaneous utility functions (formatting, classes concatenation, string parsing).
*   **Key Functions:**
    *   `cn(...inputs)`: Merges Tailwind/CSS class names cleanly using `clsx` and `tailwind-merge`.
    *   `generateBlogSlug(title)`: Takes a raw string, splits by special characters, trims, lowercases, and replaces non-alphanumeric characters with hyphens to create URL-safe slugs for dynamic routing.
    *   `generateDeviceSlug(title)`: Alias mapped to `generateBlogSlug` to maintain consistency across both domain entities.

---

## 3. Global Contexts

### Module: `context/CompareContext.jsx`
*   **Purpose:** Provides a centralized, global state provider for managing device comparisons across the entire application.
*   **Exports:**
    *   `CompareProvider`: The Context Provider component that wraps the application.
    *   `useCompare()`: Custom hook to consume the comparison state (`compareList`, `isCompareOpen`) and toggle actions (`handleToggleCompare`, `clearCompare`).

### Module: `context/SettingsContext.jsx`
*   **Purpose:** Exposes dynamic site settings (like typography sizes and global SEO) to client components without needing to prop-drill from layouts.
*   **Exports:**
    *   `SettingsProvider`: Wraps the application to inject JSON settings.
    *   `useSettings()`: Hook to read dynamic variables like CSS custom properties (`--font-size-h1-default`, etc.).
