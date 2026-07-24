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

## 3. Database & Caching
*   **Database:** PostgreSQL (Supabase PostgreSQL with direct session-mode connection pooler support)
*   **ORM:** Prisma ORM (`@prisma/client`, `prisma`)
*   **Caching Strategy:** Next.js `unstable_cache` with tag invalidation (`revalidateTag`) and `revalidatePath`

## 4. Advanced Features & Integrations
*   **Rich Text Editor:** `@tiptap/react` and `@tiptap/starter-kit` (Headless content editing in admin panel)
*   **Data Visualization:** `recharts` (Admin dashboard analytics charts)
*   **Analytics APIs:** `@google-analytics/data` (GA4 Data API) and `googleapis` (Search Console API)
*   **AI Integration:** Multi-provider text generation engine (`lib/ai/text-generator.js`) supporting Gemini, OpenAI, Anthropic, OpenRouter, Kilo, and Ollama
*   **HTML Sanitization:** `isomorphic-dompurify` (Secures generated HTML output)
*   **Web Scraping:** Jina Reader API (`https://r.jina.ai/`) for clean Markdown web page scraping
*   **Authentication:** Supabase Auth & custom signed cookie sessions (`actions/auth.js`)

## 5. Development & Testing
*   **Unit Testing:** Vitest & React Testing Library (`npx vitest run`)
*   **Database Migrations:** `npx prisma db push` and `npx prisma migrate dev`
