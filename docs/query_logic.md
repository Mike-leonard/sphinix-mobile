# Query Logic & Data Fetching Strategies

*This file outlines the caching strategies, file parsing optimization, pagination patterns, and fetching techniques used across the application.*

---

## 1. Data Fetching Strategy
*   **React Server Components (RSC):** The application relies heavily on RSCs (`app/page.js`, `app/dashboard/page.js`, etc.) to securely parse `fs/promises` reads from the server directly without exposing APIs.
*   **Server Actions for Mutations:** Form submissions and state changes are passed to server actions, avoiding the need for dedicated API route handlers.
*   **Client-Side Pagination/Filtering:** The Blog Manager uses React `useMemo` hooks on the client to filter, sort, and paginate the data passed down as `initialBlogs` props.

## 2. Caching & Revalidation
*   **Next.js Data Cache:** Static routes pull JSON data during build time/request time. 
*   **Revalidation:** Server Actions manually clear the Next.js router cache using `revalidatePath(...)` after mutations.
    *   Example: `revalidatePath('/dashboard/blogs')` ensures the admin table immediately shows new edits or trashed files.
*   **Deep Revalidation:** `updateSettings` triggers `revalidatePath('/', 'layout')` to instantly update global typography and SEO rules site-wide.

## 3. Query Patterns & Optimizations
*   **Pagination & Orchestration:**
    *   State-driven parameters (`currentPage`, `itemsPerPage`, `search`, `category`) are lifted to a high-level Orchestrator component (e.g., `BlogsManager`, `CategoryManager`).
    *   The orchestrator runs the arrays through client-side `useMemo` hooks, and then calculates the paginated slice to pass down to simple, presentational child components (e.g., `BlogsTable`, `BlogsPagination`).
*   **Search & Filtering:**
    *   Client-side search uses lowercase string matching (`includes()`) across titles, categories, and excerpts.
    *   Visibility filters (like "Trash View") conditionally modify the base array before search filters apply.
*   **Public Visibility Guards:**
    *   All public-facing routes (`app/(main)/blogs/page.js`) perform server-side array filtering (`blog.status === 'published'`) before transmitting JSON to the client, preventing data leaks of drafted or trashed posts.
