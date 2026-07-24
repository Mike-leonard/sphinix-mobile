# Application User Guide & User Flows

Welcome to **Sphinix Mobile**, an advanced smartphone catalog, tech review platform, and content management system built with Next.js, React Server Components, Tailwind CSS, and PostgreSQL via Prisma ORM.

This document provides a comprehensive guide detailing all **Public Visitor User Flows** and **Administrator Dashboard Workflows**.

---

## 📋 Table of Contents
1. [Public Visitor Guide](#1-public-visitor-guide)
   - [1.1 Homepage Navigation & Overview](#11-homepage-navigation--overview)
   - [1.2 Smartphone Catalog & Advanced Search](#12-smartphone-catalog--advanced-search)
   - [1.3 Side-by-Side Device Comparison Tool](#13-side-by-side-device-comparison-tool)
   - [1.4 Device Specification Details](#14-device-specification-details)
   - [1.5 Tech Blog & Articles](#15-tech-blog--articles)
   - [1.6 Theme Customization (Light / Dark Mode)](#16-theme-customization-light--dark-mode)
2. [Administrator Dashboard Guide](#2-administrator-dashboard-guide)
   - [2.1 Authentication & Dashboard Overview](#21-authentication--dashboard-overview)
   - [2.2 Smartphone Management](#22-smartphone-management)
   - [2.3 Dynamic Attributes, Groups, Brands & Filters](#23-dynamic-attributes-groups-brands--filters)
   - [2.4 Tech Articles & Category Management](#24-tech-articles--category-management)
   - [2.5 AI Assistant Workflows](#25-ai-assistant-workflows)
   - [2.6 Global Site Settings Configuration](#26-global-site-settings-configuration)

---

## 1. Public Visitor Guide

### 1.1 Homepage Navigation & Overview
- **Header Bar:** Contains quick links to `/phones`, `/blogs`, `/comparisons`, global search input, light/dark theme toggle, and authentication options.
- **Hero Carousel:** Showcases featured smartphones with direct specification teasers and quick link action buttons.
- **Latest Products Grid:** Displays recent smartphone additions with spec badges (governed dynamically by Dashboard Appearance settings).
- **Latest News & Tech Articles:** Features trending blog posts with category tags and reading time estimates.

---

### 1.2 Smartphone Catalog & Advanced Search (`/phones`)
- **Global Search:** Type any smartphone name or brand into the search input to dynamically filter items.
- **Brand Selection:** Filter smartphones by brand (Apple, Samsung, Xiaomi, OnePlus, Google, etc.).
- **Sidebar Specification Filters:** Filter products by custom technical attributes (Price ranges, RAM, Battery capacity, Display type, OS).
- **Sorting & View Modes:** Toggle between Grid View and List View formats.

---

### 1.3 Side-by-Side Device Comparison Tool (`/comparisons`)
1. **Adding Devices to Compare:** Click the **"Compare"** button on any smartphone card.
2. **Compare Drawer:** An interactive bottom drawer opens, displaying selected devices.
3. **Compare Execution:** Click **"Compare Now"** to open `/comparisons` for a detailed side-by-side spec evaluation.
4. **Highlights & Differences:** Displays side-by-side comparison tables highlighting spec advantages (screen size, chipset, camera megapixels, battery mAh, expert rating scores).

---

### 1.4 Device Specification Details (`/phones/[brandSlug]/[deviceSlug]`)
- **Quick Info Header:** Device launch image, price, key specs, and buy links.
- **Interactive Tabs:**
  - **Overview:** Engaging HTML summary of the device.
  - **Detailed Specs:** Grouped specs (Display, Platform, Camera, Battery, Connectivity).
  - **Expert Ratings:** Ratings breakdown across Design, Display, Performance, Camera, and Battery.

---

### 1.5 Tech Blog & Articles (`/blogs`)
- Browse published articles categorized by topic.
- Deep technical breakdown articles with rich media and formatted code snippets.
- Interactive comments section (if enabled in settings).

---

### 1.6 Theme Customization (Light / Dark Mode)
- Click the **Sun / Moon** icon in the navbar to switch themes.
- Light mode offers clean background surfaces (`#ffffff` / `#f8fafc`).
- Dark mode utilizes deep navy surfaces (`#090d16` / `#0f172a`) with high-contrast text (`text-slate-900 dark:text-white`).

---

## 2. Administrator Dashboard Guide

Access the admin suite at `/dashboard` (authentication required).

### 2.1 Authentication & Dashboard Overview
- **Login:** Sign in at `/login` with administrative credentials.
- **Analytics Metrics:** View live 28-day active users, page views, search clicks, and impressions synced via Google Analytics 4 & Google Search Console.
- **Publishing Trends:** Monitor monthly phone and blog publishing activity.

---

### 2.2 Smartphone Management (`/dashboard/phones`)
- **Viewing Catalog:** Search, filter, and manage published devices.
- **Adding a New Device:** Click **"Add Device"** (`/dashboard/phones/new`).
- **AI Spec Auto-Filler:**
  - Enter brand and device name (e.g. `Samsung Galaxy S24 Ultra`), then click **"AI Generate Specs"**.
  - Or paste a URL (e.g. GSMArena product page) into **"Extract Specs from URL"** to automatically scrape and populate price, description, quick specs, and detailed specifications.
- **Editing Device:** Modify specifications, images, pricing, and expert ratings.

---

### 2.3 Dynamic Attributes, Groups, Brands & Filters
- **Attributes (`/dashboard/phones/attributes`):** Define dynamic technical specification keys (e.g. `Processor`, `Battery Capacity`).
- **Groups (`/dashboard/phones/groups`):** Organize attributes into logical sections (`Display`, `Platform`, `Camera`, `Battery`).
- **Brands (`/dashboard/phones/brands`):** Manage manufacturer listings and logos.
- **Filters (`/dashboard/phones/filters`):** Configure which attributes appear in the `/phones` page sidebar filter widget. Drag-and-drop to reorder.
- **Rating Bars (`/dashboard/phones/rating-bars`):** Define custom scoring criteria for device expert ratings.

---

### 2.4 Tech Articles & Category Management (`/dashboard/blogs`)
- **Articles Manager:** View all posts, filter by status (**Published**, **Draft**, **Trash**).
- **Creating an Article (`/dashboard/blogs/new`):**
  - Use the **Tiptap WYSIWYG Editor** to format text, headings, lists, and images.
  - Generate full articles with AI using **"Generate with AI"** from a title or external URL.
- **Category Manager (`/dashboard/blogs/categories`):** Add, rename, or delete categories. Renaming or deleting automatically updates linked articles safely.

---

### 2.5 AI Assistant Workflows
- **AI Provider Support:** Choose between **Gemini**, **OpenAI**, **Anthropic**, **OpenRouter**, **Kilo**, or **Ollama** (local AI).
- **Auto SEO Metadata:** Click **"Generate SEO with AI"** in blog or phone editors to automatically craft meta titles, descriptions, and keywords.
- **System Prompts:** Customize default writing persona and guidelines in **Dashboard → Settings → AI Configuration**.

---

### 2.6 Global Site Settings Configuration (`/dashboard/settings`)
All administrative settings are saved directly to PostgreSQL (`SiteSettings` model) with instant Next.js `unstable_cache` revalidation (`revalidateTag('site-settings')`):

1. **SEO & Metadata (`/dashboard/settings/seo-metadata`):** Configure global titles, meta descriptions, OpenGraph social images, and structured JSON-LD schemas.
2. **Typography (`/dashboard/settings/typography`):** Customize dynamic font sizes for H1-H3 headings, card titles, paragraphs, and buttons.
3. **Appearance (`/dashboard/settings/appearance`):** Set default theme mode, primary brand colors, and **Layout Limits** (items per page for `/phones` and `/blogs`, card spec badge count).
4. **Analytics (`/dashboard/settings/analytics`):** Set GA4 Property ID, Search Console site URL, and toggle visitor tracking.
5. **Advertisements (`/dashboard/settings/advertisements`):** Configure Google AdSense publisher IDs, ad placement toggles, and in-feed ad injection frequency.
6. **AI Configuration (`/dashboard/settings/ai-configuration`):** Select active AI provider, model names, API keys, and custom prompts.
7. **Security, Maintenance, Media & Localization:** Manage rate limits, maintenance mode toggles, image optimization, language/timezone defaults, and backup exports.
