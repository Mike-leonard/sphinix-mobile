# Server Actions Logic & State Mutations

*This file documents the Next.js Server Actions used for mutations, server-side actions, form processing, and optimistic updates.*

---

## 1. Design & Security Patterns
*   **Use Server Directive:** Must be declared with `"use server"` at the top of the file or function level.
*   **Security & Authorization:** All server actions must verify user authorization before executing any query or mutation.
*   **Validation:** Use Zod (or custom validators) to validate incoming arguments.

## 2. Server Action Index

### Action: `createPost(formData)`
*   **File:** `app/actions/posts.js`
*   **Arguments:** `formData`
*   **Authorization Required:** Yes (Authenticated user)
*   **Revalidation:** `revalidatePath("/")` or `revalidateTag("posts")`
*   **Flow:**
    1. Parse and validate form fields.
    2. Retrieve authenticated session.
    3. Execute database insert model/query.
    4. Revalidate cache.
    5. Return status or redirect.

---

### Action: `deletePost(postId)`
*   **File:** `app/actions/posts.js`
*   **Arguments:** `postId` (UUID)
*   **Authorization Required:** Yes (Owner of the post)
*   **Revalidation:** `revalidatePath("/")`
