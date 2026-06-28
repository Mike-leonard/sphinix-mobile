# Query Logic & Data Fetching Strategies

*This file outlines the caching strategies, database query optimization, pagination patterns, and fetching techniques used across the application.*

---

## 1. Data Fetching Strategy
*   **React Server Components (RSC):** Direct database/API queries in Server Components are the preferred method for initial page loads.
*   **Client-Side Fetching:** Used for dynamic interactions, real-time data, and infinite scrolling.

## 2. Caching & Revalidation
*   **Next.js Data Cache:** Using `fetch(url, { next: { revalidate: 3600 } })` or tags.
*   **Route Segment Configuration:** Dynamic rendering settings (`export const dynamic = 'force-dynamic'`).

## 3. Query Patterns & Optimizations
*   **Pagination:** (e.g., Cursor-based pagination vs. Offset pagination)
*   **Indexing & Joins:** Details on database index mappings for common queries.
*   **N+1 Prevention:** Implementation details of batching/loading relations.
