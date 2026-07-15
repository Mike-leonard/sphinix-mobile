'use client';
import React, { useState } from 'react';
import TabNavigation from './tabs/TabNavigation';
import SpecsTab from './tabs/SpecsTab';
import ReviewsTab from './tabs/ReviewsTab';
import DeviceDescription from './tabs/DeviceDescription';

export default function DeviceTabs({ device, hideAds = false }) {
  const [activeTab, setActiveTab] = useState('Specs');

  const tabs = ['Specs', 'Overview', 'Reviews'];

  return (
    <div className="mt-12">
      <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'Specs' && <SpecsTab device={device} hideAds={hideAds} />}

        {activeTab === 'Overview' && (
          <div className="animate-in fade-in duration-300">
            <DeviceDescription device={device} />
          </div>
        )}

        {activeTab === 'Reviews' && <ReviewsTab device={device} />}
      </div>
    </div>
  );
}
