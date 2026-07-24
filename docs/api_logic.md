# API Logics & Route Handler Architecture

*This file outlines the REST API design, Route Handlers, middleware, authentication, external API integrations, and request validation logic.*

---

> **Current Implementation Status**: The application heavily relies on Next.js Server Actions (documented in `server_actions.md`) for mutations and data fetching. We intentionally bypass standard `app/api/` route handlers to take advantage of React Server Components and Server Actions, which reduce boilerplate and automatically infer TypeScript/JavaScript types between the client and server.

## 1. Directory Structure
*   We do **not** utilize traditional REST endpoints in `app/api/...` (with the exception of specialized file download streams like `app/api/backup/download/route.js`).
*   All backend server operations are housed in the `actions/` directory, exporting `async function` definitions marked with `"use server"`.
*   Modular helper functions and API client initializations reside in `lib/` (e.g. `lib/ai/`, `lib/analytics/`).

## 2. Global Middleware & Security
*   **Authentication Guards:** Handled dynamically via `layout.js` layout route protection and functional session verification inside each Server Action (`await verifySession()`).
*   **Rate Limiting:** High-value server actions (like AI Generation and Authentication) include length caps and throttling mechanisms on the server side (`lib/rate-limit.js`).
*   **Service Account Security:** Google Analytics and Search Console integration credentials strictly resolve from environment variables (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`) in production, with a fallback to local `data/google-credentials.json` if environment variables are not set.

## 3. External API Logics & Consumers
While internal endpoints use Server Actions, the application acts as an API Consumer for third-party services:

### 1. Dynamic AI Providers (Gemini, OpenAI, Ollama, OpenRouter, Anthropic, Kilo)
*   **Module Location:** `lib/ai/text-generator.js`
*   **Usage:** Generating tech blog content from titles/URLs, extracting device specifications, and generating structured JSON for SEO metadata.
*   **Authentication:** AI configurations (`provider`, `model`, `apiKey`, `temperature`, `systemPrompt`) are resolved dynamically from database settings (`settings.ai`) or `.env` overrides at runtime.

### 2. Jina Reader API (`https://r.jina.ai/`)
*   **Module Location:** `lib/ai/jina-scraper.js`
*   **Usage:** Scrapes clean Markdown content from external web pages while bypassing anti-bot protections (Cloudflare).
*   **Pattern:** Executes server-side `fetch()` with timeout handling before piping scraped Markdown into the AI generator.

### 3. Google Analytics 4 (`@google-analytics/data`) & Search Console (`googleapis`)
*   **Module Location:** `lib/analytics/google-clients.js`
*   **Usage:** Fetches 28-day active users, page views, search clicks, and impressions for the admin dashboard metrics widget.
*   **Credentials Resolution:** Dynamically parses `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` (formatted with newline replacement) or reads `data/google-credentials.json`. Falls back to `getDummySiteKitData()` when credentials are missing.

## 4. Error Handling & Validation Guidelines
*   **Request Validation:** Forms use client-side state validation, while server actions re-validate required arguments (checking types, `trim()` lengths, non-null values).
*   **Standardized Return Format:** All server actions return a consistent JavaScript Object structure: `{ success: boolean, data?: any, error?: string, message?: string }`.
