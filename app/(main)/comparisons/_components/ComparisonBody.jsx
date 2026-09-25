'use client';

import React from 'react';
import {
  CheckCircle2, XCircle,
  Smartphone, Palette, Antenna, Globe, Mail,
  Battery, LayoutTemplate, Cpu, Monitor, Film, Camera, List,
  Wifi, ScanFace, Headphones, Package, Sparkles
} from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';
import { useSettings } from '@/context/SettingsContext';
import { getGroupAttributeValue, slugToLabel, cleanSpecValue } from '@/lib/devices/spec-normalizer';

const BoolIcon = ({ value }) => value
  ? <CheckCircle2 className="w-5 h-5 fill-green-500 text-white border-none mx-auto" />
  : <XCircle className="w-5 h-5 fill-red-500 text-white border-none mx-auto" />;

const getIconForGroup = (groupName) => {
  const nameLower = (groupName || '').toLowerCase();
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
  return slugToLabel(key);
};

const DEFAULT_DEVICE_GROUPS = [
  "General",
  "Design",
  "Network",
  "Display",
  "Hardware",
  "Camera",
  "Connectivity",
  "Battery",
  "Audio",
  "Multimedia",
  "Software",
  "Sensors",
  "In The Box"
];

const NON_SPEC_KEYS = new Set([
  'images', 'imageAlts', 'affiliates', 'expertRatings',
  'seo', 'quickSpecs', 'description', 'gallery', 'deviceGallery'
]);

export default function ComparisonBody({ compareList, gridColsClass }) {
  const settings = useSettings();
  const freq = settings?.advertisements?.injectionFrequency?.comparisons || 3;
  const [deviceGroups, setDeviceGroups] = React.useState(DEFAULT_DEVICE_GROUPS);

  React.useEffect(() => {
    let isCancelled = false;
    import('@/actions/device-groups').then(m => m.getDeviceGroups().then(groups => {
      if (!isCancelled && groups && Array.isArray(groups) && groups.length > 0) {
        setDeviceGroups(groups);
      }
    }));
    return () => { isCancelled = true; };
  }, []);

  // Get unique dynamic spec groups from all devices (supporting both arrays and key-value objects)
  const specGroupsMap = new Map(); // groupKeyLower -> original groupKey
  compareList.forEach(device => {
    Object.entries(device.specs || {}).forEach(([key, value]) => {
      if (NON_SPEC_KEYS.has(key) || !value) return;

      const isArrayWithSpecs = Array.isArray(value) && value.length > 0 &&
        value.some(item => item && typeof item === 'object' && ('label' in item || 'value' in item || 'slug' in item));

      const isObjectWithSpecs = !Array.isArray(value) && typeof value === 'object' && Object.keys(value).length > 0;

      if (isArrayWithSpecs || isObjectWithSpecs) {
        const lower = key.toLowerCase();
        if (!specGroupsMap.has(lower)) {
          specGroupsMap.set(lower, key);
        }
      }
    });
  });

  const specGroups = Array.from(specGroupsMap.values()).sort((a, b) => {
    if (deviceGroups && deviceGroups.length > 0) {
      const indexA = deviceGroups.findIndex(g => g.toLowerCase() === a.toLowerCase());
      const indexB = deviceGroups.findIndex(g => g.toLowerCase() === b.toLowerCase());
      const valA = indexA === -1 ? 999 : indexA;
      const valB = indexB === -1 ? 999 : indexB;
      if (valA !== valB) return valA - valB;
    }

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

        // Collect all unique attribute rows (canonical slug + label) for this group across all devices
        const attrRowsMap = new Map(); // canonicalSlug -> { slug, label }

        compareList.forEach(device => {
          const specs = device.specs || {};
          // Find matching group data (case-insensitive)
          let groupData = specs[groupKey];
          if (!groupData) {
            const targetLower = groupKey.toLowerCase();
            for (const [k, v] of Object.entries(specs)) {
              if (k.toLowerCase() === targetLower) {
                groupData = v;
                break;
              }
            }
          }

          if (Array.isArray(groupData)) {
            // Legacy Array format
            groupData.forEach(item => {
              if (!item || typeof item !== 'object') return;
              const val = cleanSpecValue(item.value);
              if (val === null) return;

              const slug = item.slug ? String(item.slug).trim() : (item.label ? item.label.toLowerCase().replace(/\s+/g, '-') : '');
              const label = item.label || slugToLabel(slug);
              if (slug && !attrRowsMap.has(slug)) {
                attrRowsMap.set(slug, { slug, label });
              }
            });
          } else if (groupData && typeof groupData === 'object') {
            // Modern Object format: { "main-lens": "200 MP..." }
            Object.entries(groupData).forEach(([slug, rawVal]) => {
              const val = cleanSpecValue(rawVal);
              if (val === null) return;

              const cleanSlug = String(slug).trim();
              if (cleanSlug && !attrRowsMap.has(cleanSlug)) {
                attrRowsMap.set(cleanSlug, { slug: cleanSlug, label: slugToLabel(cleanSlug) });
              }
            });
          }
        });

        const rows = Array.from(attrRowsMap.values());
        if (rows.length === 0) return null;

        return (
          <React.Fragment key={groupKey}>
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* Category Header */}
              <div className="bg-slate-50 dark:bg-slate-800/40 px-4 md:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <Icon className="w-5 h-5 text-brand-500" />
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">{title}</h4>
              </div>

              {/* Rows for each attribute */}
              <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/50">
                {rows.map(({ slug, label }) => (
                  <div key={slug} className={`grid ${gridColsClass} divide-x divide-slate-100 dark:divide-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors`}>
                    {/* Label Column */}
                    <div className="p-4 flex items-center text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {label}
                    </div>

                    {/* Values Columns */}
                    {compareList.map((device) => {
                      const val = getGroupAttributeValue(device.specs, groupKey, slug) 
                        ?? getGroupAttributeValue(device.specs, groupKey, label);

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

            {/* In-feed Ad Banner */}
            {index % freq === 0 && (
              <div className="my-2">
                <AdBanner placement="comparisonInFeedBanner" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
