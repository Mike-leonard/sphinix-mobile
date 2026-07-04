# Sphinix Mobile

Sphinix Mobile is a modern, responsive Next.js web application dedicated to exploring, comparing, and discovering mobile devices. It offers an intuitive interface for viewing device specifications, reading the latest tech blogs, and putting devices head-to-head in a powerful comparison tool.

## Features

- **Device Catalog**: Browse the latest smartphones with rich, visual product cards and detailed specifications.
- **Advanced Comparisons**: 
  - Compare up to 3 devices side-by-side.
  - Floating compare widget and drawer to easily manage your selected devices.
  - Clear, categorised specification tables highlighting differences.
- **Tech Blog**: Read trending articles and news about the mobile industry.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS, ensuring a seamless experience across desktop, tablet, and mobile devices.
- **Dark Mode**: Built-in dark mode support for a comfortable viewing experience in any lighting condition.
- **Modern Architecture**: Built on Next.js (App Router) with React Server Components and optimized routing.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (shadcn/ui patterns) & [Lucide Icons](https://lucide.dev/)
- **State Management**: React Context API (`CompareContext`)
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
- `components/` - Reusable UI components (Navbar, Sidebar, Widgets, Cards, etc.).
- `context/` - Global state providers (e.g., `CompareContext`).
- `__tests__/` - Unit and component tests using Vitest.
- `e2e/` - End-to-end tests using Playwright.
