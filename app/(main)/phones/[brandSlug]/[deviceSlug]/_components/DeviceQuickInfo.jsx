'use client';

import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import DeviceQuickInfoHeader from './quick-info/DeviceQuickInfoHeader';
import AffiliateLinks from './quick-info/AffiliateLinks';
import DeviceSpecBlock from './quick-info/DeviceSpecBlock';

const DEFAULT_QUICK_SPECS = [
  { slug: 'camera', name: 'Camera' },
  { slug: 'screen', name: 'Display' },
  { slug: 'ram', name: 'RAM' },
  { slug: 'storage', name: 'Storage' }
];

export default function DeviceQuickInfo({ device, quickSpecs, allAttributes = [] }) {
  const { compareList = [], handleToggleCompare = () => {} } = useCompare() || {};

  const isComparing = compareList.some((item) => item.id === device?.id);

  const ICON_MAP = {
    chipset: 'Cpu',
    camera: 'Camera',
    screen: 'Monitor',
    ram: 'MemoryStick',
    storage: 'HardDrive',
    os: 'Settings',
    battery: 'BatteryMedium'
  };

  // Determine specs to render: passed quickSpecs > filtered allAttributes > default fallback
  let specsToRender = [];
  if (Array.isArray(quickSpecs) && quickSpecs.length > 0) {
    specsToRender = quickSpecs;
  } else if (Array.isArray(allAttributes) && allAttributes.length > 0) {
    specsToRender = allAttributes.filter(
      (a) => a.groupIds?.includes('Quick Specifications') || a.groupId === 'Quick Specifications'
    );
  }

  if (!specsToRender || specsToRender.length === 0) {
    specsToRender = DEFAULT_QUICK_SPECS;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <DeviceQuickInfoHeader device={device} />
        <AffiliateLinks affiliates={device?.affiliates} />

        {/* Compare Checkbox */}
        <label className="inline-flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={isComparing}
            onChange={() => handleToggleCompare(device)}
            className="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
          />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            Add to Compare
          </span>
        </label>
      </div>

      {/* Specs Stacked Blocks */}
      <div className="space-y-2 flex-1">
        {specsToRender.map((spec) => {
          const iconName = ICON_MAP[spec.slug] || 'Zap';
          const IconComponent = Icons[iconName] || Icons.Zap;
          const val = device?.specs?.[spec.slug] || 'Not specified';
          return (
            <DeviceSpecBlock
              key={spec.slug}
              icon={IconComponent}
              label={spec.name}
              value={val}
            />
          );
        })}
      </div>
    </div>
  );
}
