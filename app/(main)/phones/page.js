import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import ProductCard from '@/app/(main)/_components/_cards/ProductCard';
import DeviceListCard from '@/app/(main)/phones/_components/DeviceListCard';
import AdvancedFilters from '@/components/AdvancedFilters';
import Pagination from '@/components/Pagination';
import RightSidebar from '@/components/sidebar/RightSidebar';
import CompareDrawer from '@/components/CompareDrawer';
import MOCK_PRODUCTS from '@/data/products.json';
import SortingControl from './_components/SortingControl';
import MobileFiltersSheet from './_components/MobileFiltersSheet';
import DeviceGrid from './_components/DeviceGrid';
import { getDeviceFilters } from '@/actions/device-filters';
import { publishedDevices, publishedDevicesCount } from '@/actions/devices';
import { getSettings } from '@/actions/settings';

const BRANDS = ["All", "Apple", "Samsung", "OnePlus", "Google", "LG", "Nokia", "HTC", "Sony", "Motorola", "Huawei", "Oppo"];

export default async function DevicesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || "1", 10);
  const selectedBrand = resolvedSearchParams?.brand || "All";
  const searchQuery = resolvedSearchParams?.q || "";

  // 1. Fetch settings to determine ITEMS_PER_PAGE
  const settings = await getSettings();
  const ITEMS_PER_PAGE = settings?.appearance?.devices?.deviceLimit || 3; // TODO: change
  const offset = Math.max(0, (page - 1) * ITEMS_PER_PAGE);

  // 2. Fetch published devices, total count & filters from PostgreSQL in parallel
  const [devices, totalDevicesCount, filtersData] = await Promise.all([
    publishedDevices({ limit: ITEMS_PER_PAGE, offset, query: searchQuery, brand: selectedBrand }),
    publishedDevicesCount({ query: searchQuery, brand: selectedBrand }),
    getDeviceFilters()
  ]);

  // 3. Calculate total pages & current page
  const totalPages = Math.ceil(totalDevicesCount / ITEMS_PER_PAGE) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

  // Compute dynamic brands with counts
  /* const dynamicBrands = useMemo(() => {
    const published = MOCK_PRODUCTS.filter(p => p.status === 'published');
    const counts = { "All": published.length };

    published.forEach(p => {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
      }
    });

    return BRANDS.map(name => ({
      name,
      count: counts[name] || 0
    })).filter(brand => brand.count > 0 || brand.name === "All");
  }, []); */

  /*
  // Filter Products (Legacy Client-side Filtering)
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesStatus = product.status === 'published';
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.specs.chipset.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;

      let matchesAdvanced = true;
      if (Object.keys(advancedFilters).length > 0) {
        for (const filterId of Object.keys(advancedFilters)) {
          const selectedOptions = advancedFilters[filterId];
          if (!selectedOptions || selectedOptions.length === 0) continue;

          const filterDef = filtersData.find(f => f.id === filterId);
          if (!filterDef || !filterDef.attributeSlug) continue;

          const productSpecVal = product.specs[filterDef.attributeSlug];
          if (!productSpecVal) {
            matchesAdvanced = false;
            break;
          }

          const extractNum = (str) => {
            const match = String(str).match(/[\d.]+/);
            return match ? parseFloat(match[0]) : null;
          };

          const productNum = extractNum(productSpecVal);

          const hasMatch = selectedOptions.some(opt => {
            const optStr = opt.toLowerCase();
            const valStr = String(productSpecVal).toLowerCase();

            if (valStr.replace(/\s/g, '').includes(optStr.replace(/\s/g, ''))) return true;

            if (productNum !== null) {
              if (optStr.includes('under') || optStr.includes('<')) {
                const limit = extractNum(optStr);
                if (limit && productNum < limit) return true;
              }
              if (optStr.includes('above') || optStr.includes('>')) {
                const limit = extractNum(optStr);
                if (limit && productNum > limit) return true;
              }
              if (optStr.includes('-')) {
                const parts = optStr.split('-');
                const min = extractNum(parts[0]);
                const max = extractNum(parts[1]);
                if (min !== null && max !== null && productNum >= min && productNum <= max) return true;
              }
            }

            return false;
          });

          if (!hasMatch) {
            matchesAdvanced = false;
            break;
          }
        }
      }

      return matchesStatus && matchesSearch && matchesBrand && matchesAdvanced;
    });
  }, [searchQuery, selectedBrand, advancedFilters, filtersData]);
  */

  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Content Area */}
        <div className="lg:col-span-8">

          {/* Controls Bar */}
          <SortingControl
            selectedBrand={selectedBrand}
            BRANDS={BRANDS}
            filters={filtersData}
          />

          {/* Products Grid/List */}
          <DeviceGrid
            currentProducts={devices}
            viewMode="grid"
          />

          {/* Pagination */}
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
          searchQuery={searchQuery}
          selectedBrand={selectedBrand}
          isDevicesRoute={true}
          advancedFiltersComponent={
            <AdvancedFilters
              filters={filtersData}
              isOpen={true}
              className="!mb-0"
            />
          }
        />

      </div>

      {/* FLOATING COMPARE DRAWER */}
      <CompareDrawer />
    </div>
  );
}
