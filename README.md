# Sphinix Mobile

Sphinix Mobile is a modern, responsive Next.js web application dedicated to exploring, comparing, and discovering mobile devices. It offers an intuitive interface for viewing device specifications, reading the latest tech blogs, and putting devices head-to-head in a powerful comparison tool. It also features a fully-fledged, secure Admin Dashboard for content management.

## 📖 Architecture & Technical Documentation

For deep technical insights into the codebase architecture, design system, database schemas, and workflows, explore the detailed documentation files below:

- 🛠️ **[Toolstack & Tech Stack](docs/toolstack.md)**: Breakdown of frameworks, libraries, database engines, and runtime toolchains used across the application.
- 🚀 **[Next.js Features & Architecture](docs/next-features.md)**: Deep-dive into Next.js App Router, React Server Components (RSC), cookie-based SSR view revalidation, and caching strategies (`unstable_cache` & tags).
- 🔐 **[Server Actions Logic](docs/server_actions.md)**: Index and security specifications for Next.js Server Actions (`actions/`), session guards (`verifySession`), and data mutation contracts.
- 🗄️ **[Database Query Layer](docs/query_logic.md)**: Documentation of PostgreSQL & Prisma queries (`queries/`), multi-attribute spec filtering algorithms, and data aggregations.
- 📊 **[Database Schemas & Data Models](docs/model_logic.md)**: Prisma schema definitions, database relational models (`Device`, `Blog`, `SiteSettings`, `User`, `AffiliateCountry`), and JSON specification fields.
- 🌐 **[API Logic & External Integrations](docs/api_logic.md)**: External API client handlers, AI providers (Google Gemini, OpenAI, Claude, Ollama), Jina Reader web scraping, and rate-limiting rules.
- 🧩 **[Component Architecture & Types](docs/components-type.md)**: Categorization of Server vs. Client Components, UI state management, prop structures, and component hierarchies.
- 🎨 **[Design System & Visual Styling](docs/design.md)**: Color palettes, dark mode implementation, typography rules, glassmorphism, and dynamic micro-animations.
- ⚡ **[Utility Library & Helper Functions](docs/lib_functions.md)**: Reference guide for pure utility functions, affiliate normalizers, formatters, and helper modules (`lib/`).
- 🔄 **[Application & User Workflows](docs/application-flows.md)**: Step-by-step architectural diagrams and flowcharts for device comparisons, blog creation, AI generation, and Geo-IP localization.

---

## Features

### Public Facing
- **Device Catalog**: Browse the latest smartphones with rich, visual product cards and detailed specifications.
- **Advanced Comparisons**: 
  - Compare up to 3 devices side-by-side.
  - Floating compare widget and drawer to easily manage your selected devices.
  - Clear, categorised specification tables highlighting differences.
- **Tech Blog**: Read trending articles and news about the mobile industry.
- **Geo-IP & Multi-Country Affiliate Links**: Automatically detects visitor country to highlight localized buy buttons and regional currencies.
- **Clean SSR Cookie Preferences**: Persist layout preferences (Grid vs List) using server cookies without polluting browser URLs.
- **Responsive Design**: Fully responsive UI built with Vanilla CSS & Tailwind CSS, ensuring a seamless experience across desktop, tablet, and mobile devices.
- **Dark Mode**: Built-in dark mode support for a comfortable viewing experience in any lighting condition.

### Admin Dashboard & Management
- **Secure Admin Panel**: Cryptographically secured session management protecting all admin routes and server actions.
- **Advanced Blog Manager**:
  - Full-featured data table with sorting, search, and category filtering.
  - **Smart Trash System**: Drafts and published posts can be moved to a dedicated Trash view before permanent deletion or restoration.
  - **Rich Text Editing**: Integrated **Tiptap** editor with "unsaved changes" safeguards (dirty state tracking).
  - Draft vs Published status toggles with visual indicators.
- **AI Integration**:
  - Automatically generate complete blog articles from a single Title prompt using multi-provider AI (Gemini, OpenAI, Claude, OpenRouter, Ollama).
  - URL Scraping: Extract content from an external tech URL (via Jina Reader to bypass bot protection) and rewrite it into an original blog post.
  - SEO Generation: Auto-generate optimized `metaTitle`, `metaDescription`, and `keywords` based on the article's HTML content.
  - Rate Limiting and strict input validations to prevent DoS attacks and token exhaustion.
- **Dynamic Settings & Backup**: Manage SEO tokens, typography sizing, API keys, and app configurations dynamically with JSON backup import/export.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React Server Components, Server Actions)
- **Database & ORM**: PostgreSQL, [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS Design System
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **Editor**: [Tiptap](https://tiptap.dev/) (Headless Rich Text Editor)
- **Charts**: [Recharts](https://recharts.org/) (Dashboard Analytics)
- **AI Integration**: Google Gen AI SDK (`@google/genai`), OpenAI, Anthropic, OpenRouter APIs
- **State Management**: React Context API (`CompareContext`)
- **Security**: Crypto module for HMAC signed session cookies, DOMPurify for HTML sanitization
- **Theming**: `next-themes` (Dark/Light mode)
- **Testing**: 
  - [Vitest](https://vitest.dev/) & React Testing Library for unit testing.
  - [Playwright](https://playwright.dev/) for end-to-end (E2E) testing.

---

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Testing

The project includes a robust test suite covering unit components, server actions, and end-to-end user flows.

**Run Unit Tests:**
```bash
npm run test
```

**Run E2E Tests:**
```bash
npm run test:e2e
```

---

## Project Structure

- `app/` - Next.js App Router pages and layouts.
  - `(main)/` - Main route group including Home, Devices, Blogs, and Comparisons pages.
  - `dashboard/` - Admin interface (Layouts, Sidebar, Analytics, Blog Manager, Phone Manager).
  - `(auth)/` - Login and registration routes.
- `actions/` - Next.js Server Actions ([Documentation](docs/server_actions.md)) handling backend logic, authorization, and cache invalidation.
- `queries/` - Prisma & PostgreSQL database query functions ([Documentation](docs/query_logic.md)).
- `components/` - Reusable UI components ([Documentation](docs/components-type.md)).
- `docs/` - Comprehensive technical documentation markdown files.
- `lib/` - Utility functions, API scrapers, and helper modules ([Documentation](docs/lib_functions.md)).
- `context/` - Global state providers.
- `__tests__/` - Unit and component tests using Vitest.
- `e2e/` - End-to-end tests using Playwright.
