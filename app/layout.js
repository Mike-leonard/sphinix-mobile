import "./globals.css";



export const metadata = {
  title: {
    default: "Sphinix Mobile | In-Depth Smartphone Reviews & Tech Blog",
    template: "%s | Sphinix Mobile",
  },
  description: "Read expert, unbiased smartphone reviews, detailed mobile specifications, comparison guides, and the latest mobile technology blog posts on Sphinix Mobile.",
  keywords: ["smartphone reviews", "mobile specifications", "phone comparisons", "tech blog", "latest phones", "Sphinix Mobile"],
  openGraph: {
    title: "Sphinix Mobile | In-Depth Smartphone Reviews & Tech Blog",
    description: "Read expert, unbiased smartphone reviews, detailed mobile specifications, comparison guides, and the latest mobile technology blog posts on Sphinix Mobile.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-dark-bg text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
