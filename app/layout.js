import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { getSettings } from "@/actions/settings";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: 'swap',
});

export async function generateMetadata() {
  const settings = await getSettings();
  
  return {
    title: {
      default: settings.seo.home.title,
      template: "%s | " + settings.seo.home.title.split(' |')[0],
    },
    description: settings.seo.home.description,
    keywords: ["smartphone reviews", "mobile specifications", "phone comparisons", "tech blog", "latest phones", "Sphinix Mobile"],
    openGraph: {
      title: settings.seo.home.ogTitle || settings.seo.home.title,
      description: settings.seo.home.ogDescription || settings.seo.home.description,
      images: settings.seo.home.ogImage ? [{ url: settings.seo.home.ogImage }] : [],
      type: "website",
    },
    icons: {
      icon: settings.seo.home.favicon || "/favicon.ico"
    }
  };
}

export default async function RootLayout({ children, modal }) {
  const settings = await getSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-size-h1: ${settings.typography.h1Size};
              --font-size-h2: ${settings.typography.h2Size};
              --font-size-h3: ${settings.typography.h3Size};
              --font-size-p: ${settings.typography.pSize};
              --font-size-nav: ${settings.typography.navSize};
              --font-size-btn: ${settings.typography.buttonSize};
              --color-brand-dynamic: ${settings.appearance.primaryColor};
            }
          `
        }} />
      </head>
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
