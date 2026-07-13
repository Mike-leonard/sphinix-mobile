# Toolstack & Environment Configuration

*This file documents the tools, libraries, frameworks, and configuration settings utilized in the project.*

---

## 1. Core Framework & Runtimes
*   **Framework:** Next.js (App Router, Server Actions)
*   **UI Library:** React (Version 19.x)
*   **Runtime:** Node.js

## 2. Styling & UI Libraries
*   **CSS Framework:** Tailwind CSS v4
*   **Component Library:** `shadcn/ui` (Radix UI primitives customized with Tailwind)
*   **Theme Management:** `next-themes` (Provides strict Light/Dark mode toggling using `class` strategy)
*   **Icon Library:** `lucide-react` (Scalable SVG icons)
*   **Animation Library:** `tw-animate-css` and Tailwind built-in transitions

## 3. Advanced Features & Integrations
*   **Rich Text Editor:** `@tiptap/react` and `@tiptap/starter-kit` (Used for headless content editing in the admin panel).
*   **Data Visualization:** `recharts` (Used for admin dashboard analytics like Line, Bar, and Radar charts).
*   **AI SDK:** `@google/genai` (Handles interactions with Gemini models for blog generation and SEO tasks).
*   **HTML Sanitization:** `isomorphic-dompurify` (Secures dynamically generated AI HTML and Tiptap editor output).
*   **Web Scraping:** `cheerio` (For parsing DOM elements) and Jina Reader API (for bypassing bot protections).
*   **Cryptography:** Node.js built-in `crypto` module (Used for HMAC SHA-256 session signature generation and validation).

## 4. Development & Testing
*   **Unit Testing:** Vitest and React Testing Library
*   **E2E Testing:** Playwright
*   **Data Storage:** Native `fs/promises` reading from local JSON files (`blogs.json`, `users.json`, `settings.json`) as a mock database.
