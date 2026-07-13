# Design & UX Architecture

*This file outlines the visual design, user experience (UX) flows, layout structure, and component design patterns for the Sphinix Mobile project.*

---

## 1. Visual Design & Theme
*   **Color Palette:**
    *   **Primary (Brand):** Vibrant Purples. `brand-400` (#a855f7) used heavily in dark mode for a glowing effect, and a deeper `brand-600` (#7c3aed) used in light mode for strict high-contrast legibility.
    *   **Background (Dark):** Deep premium navy/black. Base background is `#090d16`, with `slate-900` (#0f172a) and `slate-950` used for layered surfaces and cards.
    *   **Background (Light):** Clean, spacious whites. Base background is `slate-50` (#f8fafc) with pure `white` (#ffffff) used for elevated surfaces.
*   **Typography:**
    *   **Family:** `Plus Jakarta Sans`, falling back to standard sans-serif system fonts.
    *   **Usage:** Features tight tracking (`tracking-tight`) for headings to give a modern tech feel, and wider tracking (`tracking-wider`) for small uppercase eyebrow labels. Global sizes are dynamic and managed via `SettingsContext`.
*   **Design Paradigm:** 
    *   **Modern Premium & Subtle Glassmorphism:** Uses vibrant, blurred gradient meshes behind device mockups. Employs soft shadows (`shadow-sm`, `shadow-md`), rounded corners (`rounded-2xl`, `rounded-3xl`), and 1px subtle borders (`border-slate-200` in light mode, `border-slate-800` in dark mode) to define layers without heavy lines.

## 2. Layout Structure
*   **Global Layout:**
    *   Tailwind CSS v4 handles the styling.
    *   Responsive design strategy is mobile-first, capping out at a `max-w-7xl` centered container for ultra-wide desktop monitors.
*   **Navigation Structure:**
    *   Desktop: Horizontal top navigation with an always-visible search input and quick links.
    *   Tablet/Mobile: Collapses into a Hamburger Menu. The navigation menu and the search interface are placed securely inside sliding overlays (z-indexed above the page content).
    *   **Theme Management:** Next-Themes `ThemeProvider` handles the `class` toggle, appending `.dark` to the HTML tag instantly without flashing.
*   **Admin Dashboard Layout:**
    *   A permanent vertical `DashboardSidebar` tracks navigation state. The main content pane implements strict width caps and independent scrolling to avoid window scrolling.
    *   Dashboard elements utilize a flatter, more condensed layout (e.g. data tables) compared to the public marketing pages.

## 3. UI Component System
*   **Base Library:** `shadcn/ui` components have been heavily integrated to handle accessibility and logic, while strictly preserving the custom Tailwind brand aesthetics.
*   **Modals & Dialogs:**
    *   Sliding drawers (Compare Drawer, Mobile Nav) use Shadcn's `<Sheet>`.
    *   **Custom Modals:** Critical administrative actions (e.g., Delete, Trash, Unsaved Changes) bypass native `window.confirm()` in favor of high-fidelity, custom backdrop-blurred modals utilizing Tailwind animations (`animate-in fade-in zoom-in-95`).
*   **Cards & Lists:**
    *   `ProductCard` and `BlogCard` are built using Shadcn's `<Card>` and `<CardContent>`.
*   **Admin Data Tables:**
    *   The `BlogsManager` table relies on conditional hover AND click states to display row actions (Edit, Trash, View), catering to both desktop mouse users and mobile touch users simultaneously.
*   **Rich Text Integration:**
    *   The **Tiptap** editor implements the `@tailwindcss/typography` plugin (`prose`) combined with standard Tailwind utility classes to ensure the editing canvas looks exactly like the public published output (WYSIWYG).

## 4. User Experience & Flows
*   **Micro-animations & Transitions:**
    *   **Hover states:** Deeply integrated color transitions (`transition-colors duration-300`) ensure hover effects feel fluid rather than jarring.
    *   **Scaling:** Interactive elements like cards and buttons feature a slight zoom on hover (`hover:scale-[1.01]`) and a physical press down effect on click (`active:scale-95`).
*   **Accessibility & Contrast:**
    *   Strict Light/Dark parity. Special care was taken to invert specific text colors (e.g. `text-brand-600` in light mode, `text-brand-400` in dark mode) to ensure AAA readability.
    *   Status badges (e.g. Draft, Trash, Published) use distinct color families (Amber, Red, Emerald) with calculated background opacities to ensure visual separation in complex tables.
