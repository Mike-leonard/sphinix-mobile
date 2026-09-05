# API Logics & Route Handler Architecture

*This file outlines the REST API design, Route Handlers, middleware, authentication, external API integrations, and request validation logic.*

---

> **Current Implementation Status**: The application heavily relies on Next.js Server Actions (documented in `server_actions.md`) for mutations and data fetching. We intentionally bypass standard `app/api/` route handlers to take advantage of React Server Components and Server Actions, which reduce boilerplate and automatically infer TypeScript/JavaScript types between the client and server. Specialized Route Handlers exist for OAuth callbacks (`app/api/auth/callback/route.js`), database backup downloads (`app/api/backup/download/route.js`), and sitemaps/robots generation (`app/robots.txt/route.js`, `app/sitemap.js`).

## 1. Directory Structure & Route Handlers
*   **OAuth Callback Route Handler (`app/api/auth/callback/route.js`)**: Processes Supabase Auth codes after Google OAuth authentication, upserts user email verification in Prisma, and redirects users to role-based URLs (`/dashboard` or `/`) with origin sanitization (stripping `0.0.0.0` to respect `NEXT_PUBLIC_BASE_URL` or `BASE_URL`).
*   **Backup Stream Route Handler (`app/api/backup/download/route.js`)**: Streams encrypted JSON database backups directly to admin browsers.
*   **Robots & Sitemap Route Handlers (`app/robots.txt/route.js`, `app/sitemap.js`)**: Dynamically generates crawler rules and XML sitemaps indexing all published phones, brands, and blog articles.
*   **Server Actions Core (`actions/`)**: All main backend database operations, forms, media uploads, and status mutations reside in the `actions/` directory, exporting `async function` definitions marked with `"use server"`.
*   **Modular API Helpers (`lib/`)**: Modular helper functions, S3/R2 storage clients, and AI client initializations reside in `lib/` (e.g. `lib/ai/`, `lib/analytics/`, `lib/r2-client.js`).

## 2. Global Middleware & Security
*   **Authentication Guards:** Handled dynamically via `layout.js` layout route protection and functional session verification inside each Server Action (`await verifySession()`).
*   **Status Protection Security Guard:** Administrative server actions (`trashBlog`, `trashDevice`) enforce a strict safety rule: published posts or devices cannot be trashed directly. They must first be transitioned into `draft` status.
*   **Rate Limiting:** High-value server actions (like AI Generation and Authentication) include length caps and throttling mechanisms on the server side (`lib/rate-limit.js`).
*   **Origin Sanitization & Base URL Fallbacks:** Both client and server auth helpers fallback across `NEXT_PUBLIC_BASE_URL`, `BASE_URL`, and `x-forwarded-host` to ensure redirects resolve to the canonical live domain (`https://sphinix.xyz`).
*   **Service Account Security:** Google Analytics and Search Console integration credentials strictly resolve from environment variables (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`) in production, with a fallback to local `data/google-credentials.json` if environment variables are not set.
*   **Decoupled Social Media Architecture:** Direct third-party social media integrations (e.g., Pinterest OAuth and auto-post hooks) were deprecated and removed from this codebase to prevent monolithic complexity. Social publishing is decoupled into a planned standalone "Social Media Publisher" microservice that references live canonical device/blog URLs.

## 3. External API Logics & Consumers
While internal endpoints use Server Actions, the application acts as an API Consumer for third-party services:

### 1. Dynamic AI Providers (Gemini, OpenAI, Ollama, OpenRouter, Anthropic, Kilo)
*   **Module Location:** `lib/ai/text-generator.js`
*   **Usage:** Generating tech blog content from titles/URLs, extracting device specifications, generating structured JSON for SEO metadata, and validating specifications.
*   **Authentication:** AI configurations (`provider`, `model`, `apiKey`, `temperature`, `systemPrompt`) are resolved dynamically from database settings (`settings.ai`) or `.env` overrides at runtime.

### 2. Jina Reader & Search API (`https://r.jina.ai/` & `https://s.jina.ai/`)
*   **Module Location:** `lib/ai/jina-scraper.js` & `lib/ai/device-query-optimizer.js`
*   **Usage:** 
    1. Scrapes clean Markdown content from external specification URLs bypassing Cloudflare anti-bot blocks.
    2. Executes live web searches for specific technical attributes to eradicate AI hallucinations (`SpecFinderModal`).
    3. Powers the **Cross-Validation & Accuracy Auditor** (`DeviceSpecValidatorModal`), fetching web ground truth to compare against generated device specs.
*   **Pattern:** Server-side `fetch()` with timeout handling, regex markdown table parsing, and retry fallbacks.

### 3. Cloudflare R2 Object Storage (S3-Compatible API)
*   **Module Location:** `lib/r2-client.js` & `actions/media-actions.js`
*   **Usage:** Direct high-speed server uploads and management of smartphone gallery images, avoiding local disk constraints and optimizing global CDN delivery.

### 4. Google Analytics 4 (`@google-analytics/data`) & Search Console (`googleapis`)
*   **Module Location:** `lib/analytics/google-clients.js`
*   **Usage:** Fetches 28-day active users, page views, search clicks, and impressions for the admin dashboard metrics widget.
*   **Credentials Resolution:** Dynamically parses `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` (formatted with newline replacement) or reads `data/google-credentials.json`. Falls back to `getDummySiteKitData()` when credentials are missing.

## 4. Client-Side Data Portability (Device JSON Import/Export)
*   **Device Configuration Export:** Client-side generation of structured `.json` payloads via `Blob` and `URL.createObjectURL`, capturing all website-filled values (name, brand, pricing, badges, overview HTML, gallery images, SEO alts, quick specs, detailed spec groups, international affiliate links, expert ratings, and SEO tags).
*   **Device Configuration Import:** Client-side `FileReader` parsing with schema normalization, dirty-form unsaved edits protection, and intelligent fallback for external/AI spec formats (`quickSpecs`, `detailedSpecs`).

## 5. Error Handling & Validation Guidelines
*   **Prisma Enum Sanitization:** Queries normalize UI status strings (`'draft'`, `'published'`, `'trash'`) to match Prisma schema `StatusType` (`DRAFT`, `PUBLISHED`, `TRASHED`), preventing schema validation exceptions.
*   **Permanent Primary Key Slugs:** The `id` string (e.g., `samsung-galaxy-s26-ultra-copy`) serves as the permanent primary key and URL slug. It is generated upon creation or duplication, but does NOT change when updating device titles later. This ensures external links, comparisons, and SEO URLs do not break.
*   **Standardized Return Format:** All server actions return a consistent JavaScript Object structure: `{ success: boolean, data?: any, error?: string, message?: string, newId?: string }`.
