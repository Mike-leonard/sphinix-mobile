# Lib Functions & Utilities Reference

*This file lists the shared library utilities, helper functions, formatters, and global instances (e.g., db client) configuration.*

---

## 1. Directory Structure
*   Utility modules are situated in: `lib/...`

## 2. Utility References

### Module: `lib/db.js`
*   **Purpose:** Configures and exports the single instance database client.
*   **Exports:**
    *   `db`: DB connection pool client instance.

---

### Module: `lib/utils.js`
*   **Purpose:** Miscellaneous utility functions (formatting, classes concatenation, string parsing).
*   **Key Functions:**
    *   `cn(...inputs)`: Merges Tailwind/CSS class names cleanly.
    *   `formatDate(date)`: Formats timestamps to standard locale format.
    *   `truncateString(str, length)`: Truncates strings for previews.
