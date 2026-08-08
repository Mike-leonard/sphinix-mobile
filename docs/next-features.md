# Sphinix Mobile - Feature Roadmap & Completed Tasks

This document outlines completed UX/stability enhancements, planned feature pipelines, remaining tasks, and future AI enhancements for **Sphinix Mobile**.

---

## ✅ Recently Completed Tasks

### 1. ⚡ 1-to-1 Shimmer Loading Skeletons (`loading.js` & `skeleton.jsx`)
- **Implemented**: Created matching shimmer loading skeletons across all public and admin routes:
  - `app/(main)/loading.js`: Homepage 1-to-1 shimmer skeleton (hero carousel, 4 product cards, view all button, 5 blog cards, read more button, right sidebar).
  - `app/(main)/phones/loading.js`: Smartphone catalog skeleton dynamically reading user's saved `viewMode` cookie for Grid vs List shimmer.
  - `app/(main)/phones/[brandSlug]/[deviceSlug]/loading.js`: Device details skeleton (gallery, quick info, spec tabs, related devices).
  - `app/(main)/blogs/loading.js`: Blogs list skeleton (6 horizontal cards, pagination, right sidebar).
  - `app/(main)/blogs/[blogSlug]/loading.js`: Article detail skeleton (hero, author meta, content paragraphs, related articles).
  - `app/(main)/comparisons/loading.js`: Comparison page skeleton (sticky header comparison cards, spec table).
  - `app/dashboard/loading.js`: Admin dashboard skeleton (4 metric cards, analytics chart/table).

### 2. 🛡️ React Route Error Boundaries & Custom 404 Page
- **Implemented**:
  - `app/error.js`: Global public site Error Boundary with "Try Again" & "Go Home" buttons while keeping Navbar and Footer intact.
  - `app/dashboard/error.js`: Admin Dashboard Error Boundary with "Reload View" & "Dashboard Overview" buttons while keeping Admin Sidebar intact.
  - `app/not-found.js`: Custom theme-aware 404 page featuring brand gradient header, inline search input, navigation buttons, and popular brand filter pills.

### 3. 📊 Interactive Analytics Dashboard & Origin Sanitization
- **Implemented**:
  - `SiteKitVisitorsChart.jsx`: Added stateful interactive sub-tabs (**Channels**, **Locations**, **Devices**) with dynamic pie chart and legend updates.
  - `app/api/auth/callback/route.js`: Sanitized OAuth origin to prevent `0.0.0.0:3000` redirect error on live production domains (`NEXT_PUBLIC_BASE_URL`).

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

## 🚀 Future Upcoming Tasks & AI Enhancements

### 4. 🤖 Multi-Device AI Batch Creator
- **Objective**: Drastically speed up catalog creation by generating complete spec datasheets for multiple devices at once using AI.
- **Workflow & UI**:
  - **Batch Input Dialog**: Admins paste or type a list of phone names (e.g. line-separated or comma-separated: `Samsung Galaxy S25 Ultra, iPhone 17 Pro, Google Pixel 9a`).
  - **Parallel AI Processing**: Trigger Gemini AI to generate complete specifications (chipset, camera, display, battery, RAM/storage, price, summary description) for each phone.
  - **Automatic Draft Creation**: Automatically persist all generated devices into PostgreSQL with `status = "draft"`.
  - **Progress Monitor**: Display a live batch progress bar (e.g. `Generated 2 of 5 devices...`).

### 5. 🔍 Advanced AI Comparison Summarizer
- **Objective**: Provide automated AI side-by-side comparison summaries highlighting key differences between two or more phones in the comparison drawer (`/compare`).

---

## 📊 Summary Table of Tasks

| Feature | Target Area | Status | Priority |
| :--- | :--- | :--- | :--- |
| **Shimmer Skeletons & Error Boundaries** | App-wide (`loading.js`, `error.js`, `not-found.js`) | ✅ Completed | High |
| **Interactive Visitors Analytics Widget** | Dashboard (`/dashboard`) | ✅ Completed | High |
| **Device User Reviews & Comments** | Public Phone Pages & Admin | Pending | High |
| **Blog Post Comments** | Public Blog Pages & Admin | Pending | High |
| **Dashboard Bulk Actions (Multi-Select)** | Admin (`/dashboard/phones`, `/dashboard/blogs`) | Pending | High |
| **Multi-Device AI Batch Generator** | Admin (`/dashboard/phones/new`) | Future | Medium |
| **AI Side-by-Side Comparison Generator** | Comparison Drawer (`/compare`) | Future | Low |
