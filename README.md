# Sphinix Mobile

Sphinix Mobile is a modern, responsive Next.js web application dedicated to exploring, comparing, and discovering mobile devices. It offers an intuitive interface for viewing device specifications, reading the latest tech blogs, and putting devices head-to-head in a powerful comparison tool. It also features a fully-fledged, secure Admin Dashboard for content management.

## Features

### Public Facing
- **Device Catalog**: Browse the latest smartphones with rich, visual product cards and detailed specifications.
- **Advanced Comparisons**: 
  - Compare up to 3 devices side-by-side.
  - Floating compare widget and drawer to easily manage your selected devices.
  - Clear, categorised specification tables highlighting differences.
- **Tech Blog**: Read trending articles and news about the mobile industry.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS, ensuring a seamless experience across desktop, tablet, and mobile devices.
- **Dark Mode**: Built-in dark mode support for a comfortable viewing experience in any lighting condition.

### Admin Dashboard & Management
- **Secure Admin Panel**: Cryptographically secured session management protecting all admin routes and server actions.
- **Advanced Blog Manager**:
  - Full-featured data table with sorting, search, and category filtering.
  - **Smart Trash System**: Drafts and published posts can be moved to a dedicated Trash view before permanent deletion or restoration.
  - **Rich Text Editing**: Integrated **Tiptap** editor with "unsaved changes" safeguards (dirty state tracking).
  - Draft vs Published status toggles with visual indicators.
- **AI Integration**:
  - Automatically generate complete blog articles from a single Title prompt.
  - URL Scraping: Extract content from an external tech URL (via Jina Reader to bypass bot protection) and rewrite it into an original blog post.
  - SEO Generation: Auto-generate optimized `metaTitle`, `metaDescription`, and `keywords` based on the article's HTML content.
  - Rate Limiting and strict input validations to prevent DoS attacks and token exhaustion.
- **Dynamic Settings**: Manage SEO tokens, typography sizing, API keys, and app configurations dynamically.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (shadcn/ui patterns) & [Lucide Icons](https://lucide.dev/)
- **Editor**: [Tiptap](https://tiptap.dev/) (Headless Rich Text Editor)
- **Charts**: [Recharts](https://recharts.org/) (Dashboard Analytics)
- **AI Integration**: Google Gen AI SDK (`@google/genai`)
- **State Management**: React Context API (`CompareContext`)
- **Security**: Crypto module for HMAC signed session cookies, DOMPurify for HTML sanitization
- **Theming**: `next-themes` (Dark/Light mode)
- **Testing**: 
  - [Vitest](https://vitest.dev/) & React Testing Library for unit testing.
  - [Playwright](https://playwright.dev/) for end-to-end (E2E) testing.

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

## Testing

The project includes a robust test suite covering both unit components and end-to-end user flows.

**Run Unit Tests:**
```bash
npm run test
```

**Run E2E Tests:**
```bash
npm run test:e2e
```

## Project Structure

- `app/` - Next.js App Router pages and layouts.
  - `(main)/` - Main route group including Home, Devices, Blogs, and Comparisons pages.
  - `dashboard/` - Admin interface (Layouts, Sidebar, Analytics, Blog Manager).
  - `(auth)/` - Login and registration routes.
- `components/` - Reusable UI components (Navbar, Sidebar, Widgets, Cards, etc.).
- `actions/` - Next.js Server Actions (Auth, Blogs, AI, Categories, Settings) handling backend logic securely.
- `context/` - Global state providers.
- `data/` - Local JSON data storage (blogs.json, users.json, settings.json).
- `__tests__/` - Unit and component tests using Vitest.
- `e2e/` - End-to-end tests using Playwright.
