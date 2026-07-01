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
    *   **Usage:** Features tight tracking (`tracking-tight`) for headings to give a modern tech feel, and wider tracking (`tracking-wider`) for small uppercase eyebrow labels.
*   **Design Paradigm:** 
    *   **Modern Premium & Subtle Glassmorphism:** Uses vibrant, blurred gradient meshes behind device mockups. Employs soft shadows (`shadow-sm`, `shadow-md`), rounded corners (`rounded-2xl`, `rounded-3xl`), and 1px subtle borders (`border-slate-200` in light mode, `border-slate-800` in dark mode) to define layers without heavy lines.

## 2. Layout Structure
*   **Global Layout:**
    *   Tailwind CSS v4 handles the styling.
    *   Responsive design strategy is mobile-first, capping out at a `max-w-7xl` centered container for ultra-wide desktop monitors.
*   **Navigation Structure:**
    *   Desktop: Horizontal top navigation with an always-visible search input and quick links.
    *   Tablet/Mobile: Collapses into a Hamburger Menu. The navigation menu and the search interface are placed securely inside sliding overlays (z-indexed above the page content) so they do not push the DOM downward.
    *   **Theme Management:** Next-Themes `ThemeProvider` handles the `class` toggle, appending `.dark` to the HTML tag instantly without flashing.
    *   **Sidebar Adaptability:** The `RightSidebar` implements contextual rendering based on the active route (e.g., hiding `NewArrivals` on `/devices`, hiding `BrandList` on `/blogs`) to reduce clutter while cross-pollinating relevant content (like displaying top-rated devices on blog pages).
    *   **Ad Integration:** In-feed ads (`InFeedAd`) are seamlessly injected into product and blog grids at specific intervals (e.g., after 4 or 6 items), utilizing `col-span-full` to avoid breaking multi-column layouts.

## 3. UI Component System
*   **Base Library:** `shadcn/ui` components have been heavily integrated to handle accessibility and logic, while strictly preserving the custom Tailwind brand aesthetics.
*   **Buttons & Inputs:**
    *   Native buttons have been replaced by Shadcn `<Button>` variants (`default`, `outline`, `ghost`).
    *   Forms use Shadcn `<Input>`.
    *   Badges and specification tags use Shadcn `<Badge>` or custom inline-flex pill spans for dense data representation.
*   **Modals & Dialogs:**
    *   Sliding drawers (Compare Drawer, Mobile Nav) use Shadcn's `<Sheet>` component, providing out-of-the-box keyboard navigation, screen-reader support, and backdrop blurring.
    *   The **Compare Drawer** is decoupled from the Navbar and triggered via a floating widget (`bottom-6 right-6`), providing global access to device comparisons without cluttering the main navigation.
*   **Cards & Lists:**
    *   `ProductCard` and `BlogCard` are built using Shadcn's `<Card>` and `<CardContent>`.
    *   They utilize flex and grid layouts internally to cleanly separate imagery, titles, and technical specifications.
*   **Search Interface:**
    *   The universal search component supports scope filtering (via `Badge` pills) to toggle between "All", "Devices", and "Blogs", instantly restricting autocomplete dropdown results.

## 4. User Experience & Flows
*   **Micro-animations & Transitions:**
    *   **Hover states:** Deeply integrated color transitions (`transition-colors duration-300`) ensure hover effects feel fluid rather than jarring.
    *   **Scaling:** Interactive elements like cards and buttons feature a slight zoom on hover (`hover:scale-[1.01]`) and a physical press down effect on click (`active:scale-95`).
*   **Accessibility & Contrast:**
    *   Strict Light/Dark parity. Special care was taken to invert specific text colors (e.g. `text-brand-600` in light mode, `text-brand-400` in dark mode) to ensure AAA readability scores across all UI components, badges, and footer links.
