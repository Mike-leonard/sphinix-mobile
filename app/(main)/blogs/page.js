import React from 'react';
import Pagination from '@/components/Pagination';
import RightSidebar from '@/components/sidebar/RightSidebar';
import BlogPageHeader from './_components/BlogPageHeader';
import BlogList from './_components/BlogList';
import { publishedBlogs, publishedBlogsCount, getBlogCategoryCounts } from '@/actions/blogs';
import { getSettings } from '@/actions/settings';
import { getDevices } from '@/actions/devices';

export default async function BlogsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || "1", 10);
  const category = resolvedSearchParams?.category || "All";
  const query = resolvedSearchParams?.q || "";

  // 1. Fetch settings to determine itemsPerPage
  const settings = await getSettings();
  const itemsPerPage = settings?.appearance?.blogs?.blogLimit || 12;
  const offset = Math.max(0, (page - 1) * itemsPerPage);

  // 2. Fetch only necessary paginated blogs, total matching count, devices & category counts in parallel
  const [blogs, totalBlogsCount, devices, categoryGroups] = await Promise.all([
    publishedBlogs({ limit: itemsPerPage, offset, query, category }),
    publishedBlogsCount({ query, category }),
    getDevices(),
    getBlogCategoryCounts()
  ]);

  // 3. Server-side pagination calculation
  const totalPages = Math.ceil(totalBlogsCount / itemsPerPage) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

  // 4. Compute Sidebar Categories Data
  let totalAllCategoryCount = 0;
  const categoryCounts = {};
  (categoryGroups || []).forEach(g => {
    if (g.category) {
      categoryCounts[g.category] = g._count.id;
      totalAllCategoryCount += g._count.id;
    }
  });

  const categories = [
    { name: "All", count: totalAllCategoryCount },
    ...Object.entries(categoryCounts).map(([name, count]) => ({ name, count }))
  ];

  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col min-h-0">
          <BlogPageHeader totalCount={totalBlogsCount} />

          <BlogList currentBlogs={blogs} />

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <RightSidebar
          blogs={blogs}
          categories={categories}
          selectedCategory={category}
          searchQuery={query}
          isBlogsRoute={true}
          newArrivals={[]}
          topRated={[]}
          brands={[]}
        />
      </div>
    </div>
  );
}
