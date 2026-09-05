# Toolstack & Environment Configuration

*This file documents the tools, libraries, frameworks, database drivers, and configuration settings utilized in the project.*

---

## 1. Core Framework & Runtimes
*   **Framework:** Next.js (App Router, Server Actions, React Server Components, Turbopack)
*   **UI Library:** React (Version 19.x)
*   **Runtime:** Node.js

## 2. Styling & UI Libraries
*   **CSS Framework:** Tailwind CSS v4
*   **Component Library:** `shadcn/ui` (Radix UI primitives customized with Tailwind)
*   **Theme Management:** `next-themes` (Provides Light/Dark mode toggling using `class` strategy)
*   **Icon Library:** `lucide-react` (Scalable SVG icons)
*   **Animation Library:** `tw-animate-css` and Tailwind built-in transitions

## 3. Database, Object Storage & Caching
*   **Database:** PostgreSQL (Supabase PostgreSQL with direct session-mode connection pooler support)
*   **ORM:** Prisma ORM (`@prisma/client`, `prisma`)
*   **Object Storage (Media CDN):** Cloudflare R2 via AWS SDK S3Client (`@aws-sdk/client-s3`) for direct server-side smartphone gallery uploads
*   **Caching Strategy:** Next.js `unstable_cache` with tag invalidation (`revalidateTag`) and `revalidatePath`

## 4. Advanced Features & Integrations
*   **Geo-IP Location Detection:** `geoip-lite` (Dynamic safe runtime execution for visitor country code lookup, combined with Vercel `x-vercel-ip-country` & Cloudflare `cf-ipcountry` headers)
*   **Rich Text Editor:** `@tiptap/react` and `@tiptap/starter-kit` (Headless content editing in admin panel)
*   **Data Visualization:** `recharts` (Admin dashboard analytics charts & dynamic `PublishTrendsChart.jsx` with multi-timeframe filtering)
*   **Analytics APIs:** `@google-analytics/data` (GA4 Data API) and `googleapis` (Search Console API)
*   **AI Integration:** Multi-provider text generation engine (`lib/ai/text-generator.js`) supporting Gemini, OpenAI, Anthropic, OpenRouter, Kilo, and Ollama
*   **HTML Sanitization:** `isomorphic-dompurify` (Secures generated HTML output)
*   **Web Scraping & Ground-Truth Spec Search:** Jina Reader API (`https://r.jina.ai/`) & Jina Search API (`https://s.jina.ai/`) for clean Markdown web page scraping, single-attribute searches, and automated spec cross-validation
*   **Privacy & GDPR Compliance:** `CookieConsent.jsx` with Google Analytics gating wrapper (`AnalyticsWrapper.jsx`)
*   **Authentication:** Supabase Auth & custom signed cookie sessions (`actions/auth.js`)
*   **Bot Protection & CAPTCHA:** Cloudflare Turnstile (Integrated into authentication forms)

## 5. Development & Testing
*   **Unit Testing:** Vitest & React Testing Library (`npx vitest run`)
*   **End-to-End Testing:** Playwright (`npx playwright test`)
*   **Database Migrations:** `npx prisma db push` and `npx prisma migrate dev`
