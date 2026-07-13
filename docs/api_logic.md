# API Logics & Route Handler Architecture

*This file outlines the REST API design, Route Handlers, middleware, authentication, and request validation logic.*

---

> **Current Implementation Status**: The application heavily relies on Next.js Server Actions (documented in `server_actions.md`) for mutations and data fetching. We intentionally bypass standard `app/api/` route handlers to take advantage of React Server Components and Server Actions, which reduce boilerplate and automatically infer TypeScript/Javascript types between the client and server.

## 1. Directory Structure
*   We do **not** utilize traditional REST endpoints in `app/api/...`.
*   All backend logic is housed in the `actions/` directory, exporting `async function` definitions marked with `"use server"`.

## 2. Global Middleware & Security
*   **Authentication Middleware:** Handled dynamically via `layout.js` layout route protection and specific functional guards inside each Server Action (`await verifySession()`).
*   **Rate Limiting:** Specific high-value server actions (like AI Generation) include explicit length caps and throttling mechanisms on the server execution side rather than an Edge middleware.

## 3. External API Logics
While internal endpoints use Server Actions, the application acts as an API Consumer for several third-party services:

### 1. Dynamic AI Providers (Gemini, OpenAI, Ollama)
*   **Usage:** For generating tech blog content from titles and parsing DOM text to generate SEO metadata.
*   **Authentication:** AI configurations (provider, model, apiKey) are fetched dynamically from `settings.json` (specifically `settings.ai`) at runtime.
*   **Endpoints Called:** Varies based on configuration (e.g., `gemini-2.5-flash`, `gpt-4o`, `ollama` local endpoints).

### 2. Jina Reader API (`https://r.jina.ai/`)
*   **Usage:** Bypassing bot protections (like Cloudflare) to scrape external tech news websites cleanly into Markdown format.
*   **Pattern:** Server Action executes a `fetch()` request locally before piping the resulting text into Gemini for rewriting, ensuring the client never exposes the scraping methodology or API keys.

## 4. Error Handling & Validation Guidelines
*   **Request Validation:** Forms use strict standard logic on the client, and server actions re-validate required arguments (checking types, `trim()` lengths, etc.) before proceeding with writes.
*   **Error Standard:** Server actions return standard Javascript Objects matching `{ success: boolean, error?: string, message?: string }`.
