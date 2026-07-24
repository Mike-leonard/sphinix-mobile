# Design & UX Architecture

*This file outlines the visual design, user experience (UX) flows, layout structure, and component design patterns for the Sphinix Mobile project.*

---

## 1. Visual Design & Theme
*   **Color Palette:**
    *   **Primary (Brand):** Vibrant Purples. `brand-400` (#a855f7) used heavily in dark mode for a glowing effect, and a deeper `brand-600` (#7c3aed) used in light mode for strict high-contrast legibility.
    *   **Background (Dark):** Deep premium navy/black. Base background is `#090d16`, with `slate-900` (#0f172a) and `slate-950` used for layered surfaces and cards.
    *   **Background (Light):** Clean, spacious whites. Base background is `slate-50` (#f8fafc) with pure `white` (#ffffff) used for elevated surfaces.
    *   **Button Text States:** public action buttons (e.g. "View All Phones" and "Read More Blogs") implement explicit light/dark contrast (`text-slate-900 dark:text-white`) with active hover states returning to brand accents (`hover:text-brand-600 dark:hover:text-brand-400`).
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

## 3. UI Component System
*   **State Orchestrator Pattern:** Complex features (e.g., `BlogsManager`, `BlogEditor`, `CategoryManager`, and all `SettingsForm` variants) use the Orchestrator pattern. A parent component manages top-level state and API interactions, while modular child components handle UI rendering.
*   **Base Library:** `shadcn/ui` components are heavily integrated to handle accessibility and logic, while strictly preserving custom Tailwind brand aesthetics.
*   **Modals & Dialogs:**
    *   Sliding drawers (Compare Drawer, Mobile Nav) use Shadcn's `<Sheet>`.
    *   **Custom Modals:** Critical administrative actions (e.g., Delete, Trash, Unsaved Changes) bypass native `window.confirm()` and `window.alert()` in favor of custom backdrop-blurred modals (`DeleteCategoryModal`, `BlogsConfirmModal`, `LeaveConfirmationModal`).
*   **Cards & Lists:**
    *   `ProductCard` and `BlogCard` are built using Shadcn's `<Card>` and `<CardContent>`.
*   **Admin Data Tables:**
    *   Data tables rely on conditional hover AND click states to display row actions (Edit, Trash, View), catering to both desktop mouse users and mobile touch users.
*   **Rich Text Integration:**
    *   The **Tiptap** editor implements the `@tailwindcss/typography` plugin (`prose`) combined with standard Tailwind utility classes to ensure the editing canvas matches public published output (WYSIWYG).

## 4. User Experience & Hydration Safeguards
*   **Deterministic SSR/Hydration:**
    *   Visual components like `PublishTrendsChart.jsx` use deterministic formulas instead of `Math.random()` to ensure 100% server-client markup parity during Next.js hydration.
*   **Micro-animations & Transitions:**
    *   **Hover states:** Deeply integrated color transitions (`transition-colors duration-300`) ensure hover effects feel fluid rather than jarring.
    *   **Scaling:** Interactive elements feature a slight zoom on hover (`hover:scale-[1.01]`) and a physical press down effect on click (`active:scale-95`).
*   **Accessibility & Contrast:**
    *   Strict Light/Dark parity. Status badges (e.g. Draft, Trash, Published) use distinct color families (Amber, Red, Emerald) with calculated background opacities.
