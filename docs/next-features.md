# Sphinix Mobile - Feature Roadmap & Completed Tasks

This document outlines completed UX/stability enhancements, planned feature pipelines, remaining tasks, and future AI enhancements for **Sphinix Mobile**.

---

## ✅ Recently Completed Tasks

### 1. 📦 Device Details Exportation & Importation (JSON Export/Import)
- **Implemented**: Added native JSON portability directly to the single device editor action bar (`DeviceEditor.jsx`):
  - **Export JSON**: One-click download of `<device-slug>-specs.json` preserving all device values entered on the website (name, brand, price, statuses, review toggles, description overview, 4-angle gallery images, SEO alt texts, quick specs, detailed spec groups, international affiliates, expert ratings, and SEO tags).
  - **Import JSON**: File upload capability with unsaved-changes confirmation prompt and schema normalization supporting Sphinx JSON exports and external/AI spec formats (`quickSpecs`, `detailedSpecs`).
  - **Action Bar Ergonomics**: Integrated styled buttons with a floating Action Toast feedback notification.

### 2. ☁️ Cloudflare R2 Direct Server Media Storage & Importer Modal
- **Implemented**:
  - Integrated AWS SDK S3Client (`@aws-sdk/client-s3`) configured with Cloudflare R2 (`lib/r2-client.js`).
  - Implemented server actions (`actions/media-actions.js`): `uploadMediaToR2`, `listR2MediaFiles`, and `deleteMediaFromR2`.
  - Built `R2MediaImporterModal.jsx` in the device gallery section: provides drag & drop cloud file uploads, bucket browsing, and one-click angle slotting (`Front View`, `Back View`, `Camera`, `Side Profile`) with automated SEO alt text suggestion.

### 3. 🔍 Live Spec Web Search & Cross-Validation Auditor
- **Implemented**:
  - `SpecFinderModal.jsx`: Admin modal to search live specifications on the web for a single attribute via Jina search (`https://s.jina.ai/`), eliminating AI hallucinations.
  - `DeviceSpecValidatorModal.jsx`: Cross-Validation & Accuracy Auditor that compares generated device specs against live web search ground truth, highlighting discrepancies and letting admins apply validated specs with one click.
  - Query Optimizer (`lib/ai/device-query-optimizer.js`): Formulates targeted search terms for hardware attributes.

### 4. 🎨 Neutral Card Themes & Cookie Consent GDPR Banner
- **Implemented**:
  - Pruned legacy `imageColor` / gradient theme picker across database, admin editor, and frontend cards in favor of unified neutral gradients (`from-slate-100 to-slate-200/50` in light mode, `from-slate-800/80 to-slate-900/80` in dark mode).
  - Added `CookieConsent.jsx` and `AnalyticsWrapper.jsx` to gate Google Analytics and Search Console tracking until visitor consent is granted.
  - Aligned QuickSpecs terms in `DeviceSpecBlock.jsx` with vertical start alignment (`items-start`), preventing awkward text wrapping.

### 5. ⚡ 1-to-1 Shimmer Loading Skeletons (`loading.js` & `skeleton.jsx`)
- **Implemented**: Created matching shimmer loading skeletons across all public and admin routes:
  - `app/(main)/loading.js`: Homepage 1-to-1 shimmer skeleton (hero carousel, 4 product cards, view all button, 5 blog cards, read more button, right sidebar).
  - `app/(main)/phones/loading.js`: Smartphone catalog skeleton dynamically reading user's saved `viewMode` cookie for Grid vs List shimmer.
  - `app/(main)/phones/[brandSlug]/[deviceSlug]/loading.js`: Device details skeleton (gallery, quick info, spec tabs, related devices).
  - `app/(main)/blogs/loading.js`: Blogs list skeleton (6 horizontal cards, pagination, right sidebar).
  - `app/(main)/blogs/[blogSlug]/loading.js`: Article detail skeleton (hero, author meta, content paragraphs, related articles).
  - `app/(main)/comparisons/loading.js`: Comparison page skeleton (sticky header comparison cards, spec table).
  - `app/dashboard/loading.js`: Admin dashboard skeleton (4 metric cards, analytics chart/table).

### 6. 🛡️ React Route Error Boundaries & Custom 404 Page
- **Implemented**:
  - `app/error.js`: Global public site Error Boundary with "Try Again" & "Go Home" buttons while keeping Navbar and Footer intact.
  - `app/dashboard/error.js`: Admin Dashboard Error Boundary with "Reload View" & "Dashboard Overview" buttons while keeping Admin Sidebar intact.
  - `app/not-found.js`: Custom theme-aware 404 page featuring brand gradient header, inline search input, navigation buttons, and popular brand filter pills.

### 7. 📊 Interactive Analytics Dashboard & Dynamic Publishing Trends Chart
- **Implemented**:
  - `PublishTrendsChart.jsx`: Dynamic publishing trends chart parsing `createdAt` timestamps for published items. Features an interactive timeframe dropdown (**Last 6 Months**, **Last 12 Months**, **This Year**, **By Year**) and MoM percentage trend badges.
  - `SiteKitVisitorsChart.jsx`: Added stateful interactive sub-tabs (**Channels**, **Locations**, **Devices**) with dynamic pie chart and legend updates.
  - `app/api/auth/callback/route.js`: Sanitized OAuth origin to prevent `0.0.0.0:3000` redirect error on live production domains (`NEXT_PUBLIC_BASE_URL`).

### 8. 🔄 Item Duplication, Interactive Status Toggling & Auto Slug Migration
- **Implemented**:
  - **Blog & Phone Duplication**: Added `duplicateBlog(id)` and `duplicateDevice(id)` server actions to clone posts/phones into `Draft` status titled `"[Original Title] (Copy)"` with clean unique slugs.
  - **Interactive Status Badge Toggling**: Status badges (`Draft` $\leftrightarrow$ `Published`) in table rows act as direct click toggles.
  - **Status Protection Guard**: Disabled trashing published blogs and devices (`opacity-50 cursor-not-allowed`) until transitioned to `Draft` state first.
  - **Permanent Primary Key Slugs**: Device slug/IDs remain permanent even when device titles are changed later.

---

## 📌 Current Remaining Tasks

### 1. 💬 Device Reviews & User Comments
- **Objective**: Allow users to leave ratings, structured reviews, and discussion comments on individual device pages.
- **Key Deliverables**:
  - **Prisma Schema Update**: Add `DeviceReview` and `DeviceComment` models linked to `Device` and `User`.
  - **Frontend Widget**: Interactive review box with star rating sliders/selectors and user review list on `/phones/[brandSlug]/[deviceSlug]`.
  - **Admin Moderation**: Dashboard route under `/dashboard/reviews` to approve, flag, or delete user-submitted reviews.

### 2. 📝 Blog Article Comments
- **Objective**: Enable interactive user comments on published blog articles to boost engagement.
- **Key Deliverables**:
  - **Prisma Schema Update**: Add `BlogComment` model with nested reply support (parent-child comment threads).
  - **Blog Post Component**: Comments list & submit form below blog posts (`/blogs/[slug]`).
  - **Dashboard Management**: Moderate blog comments under `/dashboard/blogs/comments`.

### 3. 🔳 Dashboard Multi-Select & Bulk Actions
- **Objective**: Improve admin workflow efficiency by enabling batch operations on devices and blog posts.
- **Key Deliverables**:
  - **Batch Selection UI**: Multi-select checkboxes in `/dashboard/phones` and `/dashboard/blogs` tables with a floating batch action bar ("Select All", "Deselect All", selected count badge).
  - **Bulk Actions**:
    - **Bulk Delete**: Remove multiple selected items simultaneously with confirmation modal.
    - **Bulk Status Toggle**: Batch switch selected items between `Draft` and `Published`.
    - **Bulk Group/Category Assignment**: Assign selected devices/blogs to specific categories or device groups in one click.

---

## 🚀 Future Upcoming Tasks & Integrations

### 4. 📲 Standalone Social Media Publisher Microservice
- **Objective**: Cross-platform content syndication (Pinterest, X/Twitter, Facebook, Instagram, Threads, YouTube) decoupled from the main catalog app. References live Sphinix device/blog URLs and Cloudflare R2 media assets.

### 5. 🤖 Multi-Device AI Batch Creator
- **Objective**: Drastically speed up catalog creation by generating complete spec datasheets for multiple devices at once using AI.

### 6. 🔍 Advanced AI Comparison Summarizer
- **Objective**: Provide automated AI side-by-side comparison summaries highlighting key differences between two or more phones in the comparison drawer (`/compare`).

---

## 📊 Summary Table of Tasks

| Feature | Target Area | Status | Priority |
| :--- | :--- | :--- | :--- |
| **Device Details Export & Import (JSON)** | Device Editor (`DeviceEditor.jsx`) | ✅ Completed | High |
| **Cloudflare R2 Media Importer Modal** | Device Gallery (`DeviceGalleryInputs.jsx`) | ✅ Completed | High |
| **Spec Web Search & Cross-Validation Auditor** | Phone Editor Modals (`SpecFinder`, `Validator`) | ✅ Completed | High |
| **Neutral Card Themes & Cookie Consent** | Public Site & Layout | ✅ Completed | High |
| **Shimmer Skeletons & Error Boundaries** | App-wide (`loading.js`, `error.js`, `not-found.js`) | ✅ Completed | High |
| **Duplication, Status Protection & Auto Slug Migration** | Admin (`/dashboard/phones`, `/dashboard/blogs`) | ✅ Completed | High |
| **Device User Reviews & Comments** | Public Phone Pages & Admin | Pending | High |
| **Blog Post Comments** | Public Blog Pages & Admin | Pending | High |
| **Dashboard Bulk Actions (Multi-Select)** | Admin (`/dashboard/phones`, `/dashboard/blogs`) | Pending | High |
| **Standalone Social Media Publisher** | External Microservice | Future | Medium |
| **Multi-Device AI Batch Generator** | Admin (`/dashboard/phones/new`) | Future | Medium |
| **AI Side-by-Side Comparison Generator** | Comparison Drawer (`/compare`) | Future | Low |
