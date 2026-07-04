import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";


const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: 'swap',
});

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

export default function RootLayout({ children, modal }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${plusJakartaSans.variable} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased selection:bg-brand-500/30 selection:text-brand-900 dark:selection:text-brand-100 flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          {/* Renders either the (main) layout or the (auth) layout */}
          {children} 
          
          {/* Renders the intercepting login/register modal if active */}
          {modal}
        </ThemeProvider>
      </body>
    </html>
  );
}
