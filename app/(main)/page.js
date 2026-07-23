import HeroCarousel from '@/app/(main)/_components/HeroCarousel';
import AdBanner from '@/components/ads/AdBanner';
import ProductSection from './_components/_sections/ProductSection';
import BlogSection from './_components/_sections/BlogSection';
import RightSidebar from '@/components/sidebar/RightSidebar';
import { getSettings } from '@/actions/settings';

export default async function Home() {

  const settings = await getSettings();
  const homeLimits = settings?.appearance?.home || { deviceLimit: 8, blogLimit: 3 };

  return (
    <div className="text-slate-800 dark:text-slate-100">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Hero slider, Products Grid, Blogs */}
          <div className="lg:col-span-8 space-y-12">

            {/* TOP LEADERBOARD AD */}
            <AdBanner type="horizontal" placement="homePageBanner" className="hidden sm:flex" />

            <HeroCarousel />

            {/* LATEST PRODUCTS SECTION */}
            <ProductSection
              limit={homeLimits.deviceLimit}
              isHomePage={true}
            />

            {/* IN-FEED AD BANNER */}
            <AdBanner type="horizontal" placement="homePageBanner" />

            {/* LATEST NEWS / BLOG SECTION */}
            <BlogSection limit={homeLimits.blogLimit} />

          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <RightSidebar
            isHomeRoute={true}
          />

        </div>
      </div>
    </div>
  );
}
