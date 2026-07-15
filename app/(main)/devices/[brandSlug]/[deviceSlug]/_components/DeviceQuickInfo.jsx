'use client';

import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { getDeviceAttributes } from '@/actions/device-attributes';
import DeviceQuickInfoHeader from './quick-info/DeviceQuickInfoHeader';
import AffiliateLinks from './quick-info/AffiliateLinks';
import DeviceSpecBlock from './quick-info/DeviceSpecBlock';

export default function DeviceQuickInfo({ device }) {
  const { compareList, handleToggleCompare } = useCompare();
  const [quickSpecs, setQuickSpecs] = useState([]);
  useEffect(() => {
    getDeviceAttributes().then(attrs => {
      const filtered = attrs.filter(a => a.groupIds?.includes('Quick Specifications') || a.groupId === 'Quick Specifications');
      setQuickSpecs(filtered);
    });
  }, []);

  const isComparing = compareList.some(item => item.id === device.id);

  const ICON_MAP = {
    chipset: 'Cpu',
    camera: 'Camera',
    screen: 'Monitor',
    ram: 'MemoryStick',
    storage: 'HardDrive',
    os: 'Settings',
    battery: 'BatteryMedium'
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <DeviceQuickInfoHeader device={device} />
        <AffiliateLinks affiliates={device.affiliates} />
        
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
        {quickSpecs.map((spec) => {
          const iconName = ICON_MAP[spec.slug] || 'Zap';
          const IconComponent = Icons[iconName] || Icons.Zap;
          return (
            <DeviceSpecBlock 
              key={spec.slug} 
              icon={IconComponent} 
              label={spec.name} 
              value={device.specs?.[spec.slug] || "Not specified"} 
            />
          );
        })}
      </div>
    </div>
  );
}
