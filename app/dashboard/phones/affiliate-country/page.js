import React from 'react';
import DeviceTabsRoute from '@/app/dashboard/phones/_components/manager/DeviceTabsRoute';
import { getAffiliateCountries } from '@/actions/affiliate-countries';
import AffiliateCountryManager from './_components/AffiliateCountryManager';

export const dynamic = 'force-dynamic';

export default async function AffiliateCountryPage() {
  const initialCountries = await getAffiliateCountries();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Affiliate Countries & Markets</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure target countries, currencies, and store links for phone affiliate marketing.</p>
      </div>

      <DeviceTabsRoute />

      <AffiliateCountryManager initialCountries={initialCountries} />
    </div>
  );
}
