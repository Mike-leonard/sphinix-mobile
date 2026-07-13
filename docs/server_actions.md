# Server Actions Logic & State Mutations

*This file documents the Next.js Server Actions used for mutations, server-side operations, form processing, and integrations.*

---

> **Current Implementation Status**: The application heavily utilizes Next.js Server Actions (`use server`) across the Admin Dashboard for file-based CRUD operations, AI integrations, settings management, and authentication.

## 1. Design & Security Patterns
*   **Use Server Directive:** Declared with `"use server"` at the top of the action files.
*   **Security & Authorization:** All administrative server actions verify the user session via `verifySession()` from `actions/auth.js`. If the session is invalid or unauthorized, an error is thrown.
*   **Data Persistence:** Currently, data is persisted to local JSON files using `fs/promises`.
*   **Rate & Size Limits:** AI actions explicitly validate the size of inputs to prevent token exhaustion and DoS attacks.

## 2. Server Action Index

### Authentication (`actions/auth.js`)
*   `verifySession()`: Parses the `session` cookie, verifies the HMAC-SHA256 signature, and returns the user payload.
*   `loginAction(email, password)`: Authenticates against mock users and sets a signed, HttpOnly session cookie.
*   `logoutAction()`: Clears the session cookie.

### Blogs (`actions/blogs.js`)
*   `getBlogs()`, `getBlogById(id)`: Read operations.
*   `createBlog(formData)`: Creates a new blog. Revalidates `/dashboard/blogs`.
*   `updateBlog(id, formData)`: Updates blog data.
*   `trashBlog(id)`: Soft-deletes a blog (status = 'trash').
*   `restoreBlog(id)`: Restores a trashed blog (status = 'draft').
*   `permanentlyDeleteBlog(id)`: Hard-deletes a blog.
*   `reassignCategory(old, new)`: Bulk updates category references.
*   **Auth Required**: Yes, for all mutations.

### Categories (`actions/categories.js`)
*   `getCategories()`: Reads the array of category strings.
*   `createCategory(name)`: Adds a new category and sorts alphabetically.
*   `updateCategory(oldName, newName)`: Renames a category and reassigns all related blogs.
*   `deleteCategory(name)`: Removes a category and reassigns orphaned blogs to "Uncategorized".
*   **Auth Required**: Yes, for all mutations.

### AI Integrations (`actions/ai.js`)
*   `generateBlogFromTitle(title)`: Calls the dynamic AI Provider to write a full HTML blog post based on a title.
*   `generateBlogFromUrl(url)`: Uses Jina Reader API to scrape external content, bypass bot protections, and rewrite it via the selected AI model.
*   `generateSEOFromContent(htmlContent, title)`: Generates strict JSON for `metaTitle`, `metaDescription`, and `keywords`.
*   **Auth Required**: Yes. Includes hard caps on string lengths.

### Settings (`actions/settings.js`)
*   `getSettings()`: Fetches settings and deeply merges with defaults to prevent missing schema keys.
*   `updateSettings(newSettings)`: Performs a deep merge update of site configuration and revalidates the entire layout.
*   **Auth Required**: Yes (Admin strictly).
