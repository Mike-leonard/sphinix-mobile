import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { getSettings } from "@/actions/settings";
import { SettingsProvider } from "@/context/SettingsContext";
import { GoogleAnalytics } from '@next/third-parties/google';
import { DynamicStyles } from "@/components/DynamicStyles";
import { StructuredData } from "@/components/StructuredData";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: 'swap',
});

export async function generateMetadata() {
  const settings = await getSettings();
  
  const metadata = {
    title: {
      default: settings.seo.home.title,
      template: "%s | " + settings.seo.home.title.split(' |')[0],
    },
    description: settings.seo.home.description,
    keywords: settings.seo.home.keywords?.split(',').map(k => k.trim()) || ["smartphone reviews", "mobile specifications", "phone comparisons", "tech blog", "latest phones", "Sphinix Mobile"],
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

  if (settings.analytics?.googleSearchConsoleId) {
    metadata.verification = {
      google: settings.analytics.googleSearchConsoleId,
    };
  }

  return metadata;
}

export default async function RootLayout({ children, modal }) {
  const settings = await getSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <DynamicStyles settings={settings} />
        <StructuredData settings={settings} />
      </head>
      <body 
        className={`${plusJakartaSans.variable} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased selection:bg-brand-500/30 selection:text-brand-900 dark:selection:text-brand-100 flex flex-col`}
        suppressHydrationWarning
      >
        {settings.analytics?.googleAnalyticsId && (
          <GoogleAnalytics gaId={settings.analytics.googleAnalyticsId} />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme={settings.appearance?.theme || "system"}
          forcedTheme={settings.appearance?.theme && settings.appearance.theme !== "system" ? settings.appearance.theme : undefined}
        >
          <SettingsProvider settings={settings}>
              {/* Renders either the (main) layout or the (auth) layout */}
              {children} 
              
              {/* Renders the intercepting login/register modal if active */}
              {modal}
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
