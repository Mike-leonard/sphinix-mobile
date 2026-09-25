'use client';

import React from 'react';
import SpecCard from './SpecCard';
import {
  Smartphone, Palette, Antenna, Globe, Mail,
  Battery, LayoutTemplate, Cpu, Monitor, Film, Camera,
  List, Wifi, ScanFace, Headphones, Package, Sparkles
} from 'lucide-react';
import InFeedAd from '@/components/ads/InFeedAd';
import { normalizeDeviceSpecsForDisplay } from '@/lib/devices/spec-normalizer';

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

// Map known groups to icons, with a fallback
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

export default function SpecsTab({ device, hideAds = false, deviceGroups: propDeviceGroups, attributes = [] }) {
  const [deviceGroups, setDeviceGroups] = React.useState(propDeviceGroups || DEFAULT_DEVICE_GROUPS);

  React.useEffect(() => {
    if (propDeviceGroups && propDeviceGroups.length > 0) {
      setDeviceGroups(propDeviceGroups);
      return;
    }
    let isCancelled = false;
    import('@/actions/device-groups').then(m => m.getDeviceGroups().then(groups => {
      if (!isCancelled && groups && Array.isArray(groups) && groups.length > 0) {
        setDeviceGroups(groups);
      }
    }));
    return () => { isCancelled = true; };
  }, [propDeviceGroups]);

  const specs = device?.specs || {};

  const normalizedGroups = React.useMemo(() => {
    const rawGroups = normalizeDeviceSpecsForDisplay(specs, attributes);

    return rawGroups.sort((a, b) => {
      if (deviceGroups && deviceGroups.length > 0) {
        const indexA = deviceGroups.findIndex(g => 
          g.toLowerCase() === a.groupKey.toLowerCase() || 
          g.toLowerCase() === a.title.toLowerCase()
        );
        const indexB = deviceGroups.findIndex(g => 
          g.toLowerCase() === b.groupKey.toLowerCase() || 
          g.toLowerCase() === b.title.toLowerCase()
        );
        const valA = indexA === -1 ? 999 : indexA;
        const valB = indexB === -1 ? 999 : indexB;
        if (valA !== valB) return valA - valB;
      }
      
      const isABox = a.groupKey.toLowerCase().includes('box');
      const isBBox = b.groupKey.toLowerCase().includes('box');
      if (isABox && !isBBox) return 1;
      if (!isABox && isBBox) return -1;
      return 0;
    });
  }, [specs, attributes, deviceGroups]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <h2 style={{fontSize: "var(--font-size-h2-default, var(--font-size-h2-default))"}} className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
        {device.name} - Specs
      </h2>

      {normalizedGroups.map((group, index) => {
        const Icon = getIconForGroup(group.title);

        return (
          <React.Fragment key={group.groupKey}>
            <SpecCard title={group.title} icon={Icon} specs={group.specs} />
            {/* Insert ads periodically, similar to old layout */}
            {!hideAds && (index === 2 || index === 7) && <InFeedAd />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
