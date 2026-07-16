import React from 'react';
import {
  CheckCircle2, XCircle,
  Smartphone, Palette, Antenna, Globe, Mail,
  Battery, LayoutTemplate, Cpu, Monitor, Film, Camera, List,
  Wifi, ScanFace, Headphones, Package, Sparkles
} from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';
import { useSettings } from '@/context/SettingsContext';

const BoolIcon = ({ value }) => value
  ? <CheckCircle2 className="w-5 h-5 fill-green-500 text-white border-none mx-auto" />
  : <XCircle className="w-5 h-5 fill-red-500 text-white border-none mx-auto" />;

const getIconForGroup = (groupName) => {
  const nameLower = groupName.toLowerCase();
  if (nameLower.includes('general')) return Smartphone;
  if (nameLower.includes('design')) return Palette;
  if (nameLower.includes('network')) return Antenna;
  if (nameLower.includes('data')) return Globe;
  if (nameLower.includes('messag')) return Mail;
  if (nameLower.includes('battery')) return Battery;
  if (nameLower.includes('software')) return LayoutTemplate;
  if (nameLower.includes('hardware')) return Cpu;
  if (nameLower.includes('display')) return Monitor;
  if (nameLower.includes('media')) return Film;
  if (nameLower.includes('camera')) return Camera;
  if (nameLower.includes('connect')) return Wifi;
  if (nameLower.includes('sensor')) return ScanFace;
  if (nameLower.includes('audio')) return Headphones;
  if (nameLower.includes('box')) return Package;
  if (nameLower.includes('ai')) return Sparkles;
  return List;
};

const formatTitle = (key) => {
  if (key.endsWith('Specs')) {
    const base = key.replace('Specs', '');
    return base.charAt(0).toUpperCase() + base.slice(1);
  }
  return key;
};

export default function ComparisonBody({ compareList, gridColsClass }) {
  const settings = useSettings();
  const freq = settings?.advertisements?.injectionFrequency?.comparisons || 3;

  // Get unique dynamic spec groups from all devices
  const specGroupsSet = new Set();
  compareList.forEach(device => {
    Object.entries(device.specs || {}).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        specGroupsSet.add(key);
      }
    });
  });
  const specGroups = Array.from(specGroupsSet).sort((a, b) => {
    const isABox = a.toLowerCase().includes('box');
    const isBBox = b.toLowerCase().includes('box');
    if (isABox && !isBBox) return 1;
    if (!isABox && isBBox) return -1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-6">
      {specGroups.map((groupKey, index) => {
        const title = formatTitle(groupKey);
        const Icon = getIconForGroup(title);

        // Get all unique labels for this category across all devices in compareList
        const labelsMap = new Map();
        compareList.forEach(device => {
          const specArray = device.specs?.[groupKey] || [];
          specArray.forEach(s => {
            labelsMap.set(s.label, true);
          });
        });
        const labels = Array.from(labelsMap.keys());

        if (labels.length === 0) return null;

        return (
          <React.Fragment key={groupKey}>
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* Category Header */}
              <div className="bg-slate-50 dark:bg-slate-800/40 px-4 md:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <Icon className="w-5 h-5 text-brand-500" />
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">{title}</h4>
              </div>

              {/* Rows for each label */}
              <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/50">
                {labels.map((label) => (
                  <div key={label} className={`grid ${gridColsClass} divide-x divide-slate-100 dark:divide-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors`}>
                    {/* Label Column */}
                    <div className="p-4 flex items-center text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {label}
                    </div>

                    {/* Values Columns */}
                    {compareList.map((device) => {
                      const specArray = device.specs?.[groupKey] || [];
                      const specItem = specArray.find(s => s.label === label);
                      const val = specItem?.value;

                      let displayVal = val;
                      if (val === undefined || val === null || val === '') {
                        displayVal = <span className="text-slate-300 dark:text-slate-600">-</span>;
                      } else if (typeof val === 'boolean') {
                        displayVal = <BoolIcon value={val} />;
                      } else if (typeof val === 'string') {
                        const lowerVal = val.toLowerCase().trim();
                        if (lowerVal === 'yes') {
                          displayVal = <BoolIcon value={true} />;
                        } else if (lowerVal === 'no') {
                          displayVal = <BoolIcon value={false} />;
                        }
                      }

                      return (
                        <div key={device.id} className="p-4 flex items-center justify-center text-center text-sm text-slate-900 dark:text-slate-200">
                          {displayVal}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Inject Ads after the frequency threshold */}
            {index > 0 && index % freq === 0 && (
              <div className="w-full">
                <AdBanner type="horizontal" placement="comparisonsBanner" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
