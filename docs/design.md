# Design & UX Architecture

*This file outlines the visual design, user experience (UX) flows, layout structure, and component design patterns for the Sphinix Mobile project.*

---

## 1. Visual Design & Theme
*   **Color Palette:**
    *   **Primary (Brand):** Vibrant Purples. `brand-400` (#a855f7) used heavily in dark mode for a glowing effect, and a deeper `brand-600` (#7c3aed) used in light mode for strict high-contrast legibility.
    *   **Background (Dark):** Deep premium navy/black. Base background is `#090d16`, with `slate-900` (#0f172a) and `slate-950` used for layered surfaces and cards.
    *   **Background (Light):** Clean, spacious whites. Base background is `slate-50` (#f8fafc) with pure `white` (#ffffff) used for elevated surfaces.
    *   **Button Text States:** Public action buttons (e.g. "View All Phones" and "Read More Blogs") implement explicit light/dark contrast (`text-slate-900 dark:text-white`) with active hover states returning to brand accents (`hover:text-brand-600 dark:hover:text-brand-400`).
*   **Typography:**
    *   **Family:** `Plus Jakarta Sans`, falling back to standard sans-serif system fonts.
    *   **Usage:** Features tight tracking (`tracking-tight`) for headings to give a modern tech feel, and wider tracking (`tracking-wider`) for small uppercase eyebrow labels. Global sizes are dynamic and managed via `SettingsContext` and injected CSS variables (`--font-size-h1-default`, etc.).
*   **Design Paradigm:** 
    *   **Modern Premium & Subtle Glassmorphism:** Uses vibrant, blurred gradient meshes behind device mockups. Employs soft shadows (`shadow-sm`, `shadow-md`), rounded corners (`rounded-2xl`, `rounded-3xl`), and 1px subtle borders (`border-slate-200` in light mode, `border-slate-800` in dark mode) to define layers without heavy lines.

## 2. Layout Structure & Responsive Controls
*   **Global Layout:**
    *   Tailwind CSS v4 handles styling and layout boundaries.
    *   Responsive design strategy is mobile-first, capping out at a `max-w-7xl` or `max-w-[1400px]` centered container for ultra-wide desktop monitors.
*   **Navigation Structure:**
    *   Desktop: Horizontal top navigation with an always-visible search input and quick links.
    *   Tablet/Mobile: Collapses into a Hamburger Menu with sliding overlays placed inside `<Sheet>` containers.
    *   **Theme Management:** Next-Themes `ThemeProvider` handles the `class` toggle, appending `.dark` to the HTML tag instantly without flashing.
*   **Admin Dashboard Layout:**
    *   A permanent vertical `DashboardSidebar` tracks navigation state. The main content pane implements strict width caps and independent scrolling to avoid window scrolling.
    *   Dashboard elements utilize a flatter, more condensed layout (e.g. data tables, form sections).
*   **Dynamic Grid Limits & Spec Badges:**
    *   The `/phones` grid layout (items per page, spec card badge limit) and home page section limits are dynamically governed by admin settings stored in PostgreSQL (`settings.appearance.phones` and `settings.appearance.home`).

## 3. UI Component System & Shimmer Loading Skeletons
*   **Shimmer Loading Skeletons (`components/ui/skeleton.jsx`):** Animated Tailwind pulse component (`animate-pulse`) used to construct 1-to-1 route loading skeletons across all public and admin pages (`loading.js`), eliminating layout shift during SSR navigation.
*   **State Orchestrator Pattern:** Complex features (e.g., `BlogsManager`, `BlogEditor`, `CategoryManager`, `AffiliateCountryManager`, `DeviceAffiliateInputs`, and all `SettingsForm` variants) use the Orchestrator pattern. A parent component manages top-level state and API interactions, while modular child components handle UI rendering.
*   **Base Library:** `shadcn/ui` components are heavily integrated to handle accessibility and logic, while strictly preserving custom Tailwind brand aesthetics.
*   **Modals & Dialogs:**
    *   Sliding drawers (Compare Drawer, Mobile Nav) use Shadcn's `<Sheet>`.
    *   **Custom Modals:** Critical administrative actions (e.g., Delete, Trash, Unsaved Changes, Add Retailer) bypass native `window.confirm()` and `window.prompt()` in favor of custom backdrop-blurred dialog modals (`DeleteCategoryModal`, `BlogsConfirmModal`, `LeaveConfirmationModal`, `AddRetailerModal`).
*   **Cards & Lists:**
    *   `ProductCard` and `BlogCard` are built using Shadcn's `<Card>` and `<CardContent>`.
    *   `StoreInputCard` renders individual store link and price input fields with localized currency symbols and trash icons.
*   **Interactive Analytics Widgets:**
    *   `SiteKitVisitorsChart.jsx` provides interactive sub-navigation tabs (**Channels**, **Locations**, **Devices**) to toggle pie chart distributions dynamically with smooth color transitions and legends.

## 4. User Experience & Hydration Safeguards
*   **Custom 404 & Error Boundaries:**
    *   `app/not-found.js`: Provides a high-contrast 404 page with glowing brand tags, inline search bar, quick action navigation buttons, and popular brand filter pills.
    *   `app/error.js` & `app/dashboard/error.js`: Catch unhandled route errors gracefully, rendering clean recovery cards with **"Try Again"** and **"Go Home"** buttons while keeping the top Navbar and Admin Sidebar intact.
*   **Deterministic SSR/Hydration:**
    *   Visual components like `PublishTrendsChart.jsx` use deterministic formulas instead of `Math.random()` to ensure 100% server-client markup parity during Next.js hydration.
*   **Micro-animations & Transitions:**
    *   **Hover states:** Deeply integrated color transitions (`transition-colors duration-300`) ensure hover effects feel fluid rather than jarring.
    *   **Scaling:** Interactive elements feature a slight zoom on hover (`hover:scale-[1.01]`) and a physical press down effect on click (`active:scale-95`).
*   **Accessibility & Contrast:**
    *   Strict Light/Dark parity. Status badges (e.g. Draft, Trash, Published) use distinct color families (Amber, Red, Emerald) with calculated background opacities.
