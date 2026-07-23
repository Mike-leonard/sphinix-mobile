import React from 'react';
import AdvancedFilters from '@/components/AdvancedFilters';
import Pagination from '@/components/Pagination';
import RightSidebar from '@/components/sidebar/RightSidebar';
import SortingControl from './_components/SortingControl';
import DeviceGrid from './_components/DeviceGrid';
import { getDeviceFilters } from '@/actions/device-filters';
import { publishedDevices, publishedDevicesCount } from '@/actions/devices';
import { getDeviceBrands } from '@/actions/device-brands';
import { getSettings } from '@/actions/settings';

export default async function DevicesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || "1", 10);
  const selectedBrand = resolvedSearchParams?.brand || "All";
  const searchQuery = resolvedSearchParams?.q || "";

  // Extract active filter search params (e.g. filter_price, filter_ram, filter_battery)
  const activeFilters = {};
  if (resolvedSearchParams) {
    Object.keys(resolvedSearchParams).forEach(key => {
      if (key.startsWith('filter_')) {
        let filterId = key;
        if (filterId.startsWith('filter_filter_')) {
          filterId = filterId.replace('filter_filter_', 'filter_');
        }
        const val = resolvedSearchParams[key];
        if (val) {
          activeFilters[filterId] = String(val).split(',').filter(Boolean);
        }
      }
    });
  }

  // 1. Fetch settings to determine ITEMS_PER_PAGE
  const settings = await getSettings();
  const ITEMS_PER_PAGE = settings?.appearance?.devices?.deviceLimit || 9;
  const offset = Math.max(0, (page - 1) * ITEMS_PER_PAGE);

  // 2. Fetch published devices, total count, filters & brand list from PostgreSQL in parallel
  const [devices, totalDevicesCount, filtersData, dbBrands] = await Promise.all([
    publishedDevices({ limit: ITEMS_PER_PAGE, offset, query: searchQuery, brand: selectedBrand, filters: activeFilters }),
    publishedDevicesCount({ query: searchQuery, brand: selectedBrand, filters: activeFilters }),
    getDeviceFilters(),
    getDeviceBrands()
  ]);

  const BRANDS = ["All", ...(dbBrands || [])];

  // 3. Calculate total pages & current page
  const totalPages = Math.ceil(totalDevicesCount / ITEMS_PER_PAGE) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

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
    </div>
  );
}
