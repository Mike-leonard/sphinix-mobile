# Toolstack & Environment Configuration

*This file documents the tools, libraries, frameworks, and configuration settings utilized in the project.*

---

## 1. Core Framework & Runtimes
*   **Framework:** Next.js (Version 16.x) with App Router
*   **UI Library:** React (Version 19.x)
*   **Runtime:** Node.js

## 2. Styling & UI Libraries
*   **CSS Framework:** Tailwind CSS v4
*   **Component Library:** `shadcn/ui` (Radix UI primitives customized with Tailwind)
*   **Theme Management:** `next-themes` (Provides strict Light/Dark mode toggling using `class` strategy)
*   **Icon Library:** `lucide-react` (Scalable SVG icons)
*   **Animation Library:** `tw-animate-css` and Tailwind built-in transitions

## 3. State Management & Data Fetching
*   **Architecture:** Heavily relies on Next.js Server Components combined with standard React hooks (`useState`, `useEffect`) for client-side interactivity (e.g., search, sliders, modals).
*   **Global Contexts:** Utilizes standard React Context API for global state management (e.g., `CompareContext` for cross-component device comparison).
*   **Data Fetching:** Currently utilizing synchronous/mock JSON data imports for prototyping (e.g., `mockProducts`, `mockBlogs`).

## 4. Backend & Databases
*   *Currently mocking data. Backend architectures (Database, ORM, Auth) are pending implementation.*

## 5. Development & Build Tools
*   **Package Manager:** npm
*   **Linting & Formatting:** ESLint
*   **Build Pipeline:** Next.js Turbopack (Optimized production builds & fast dev server)

## 6. Testing & Quality Assurance
*   **Unit Testing:** `vitest` configured with `jsdom` (mocking Next.js routing) for testing React components in isolation.
*   **End-to-End (E2E) Testing:** `playwright` (`@playwright/test`) configured to run automated browser-based flows across Chromium, Firefox, and WebKit to guarantee integration integrity.
