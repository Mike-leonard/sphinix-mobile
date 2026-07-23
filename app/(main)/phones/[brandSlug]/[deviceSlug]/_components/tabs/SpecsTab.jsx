import React from 'react';
import SpecCard from './SpecCard';
import {
  Smartphone, Palette, Antenna, Globe, Mail,
  Battery, LayoutTemplate, Cpu, Monitor, Film, Camera,
  List, Wifi, ScanFace, Headphones, Package, Sparkles
} from 'lucide-react';
import InFeedAd from '@/components/ads/InFeedAd';

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

export default function SpecsTab({ device, hideAds = false, deviceGroups: propDeviceGroups }) {
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

  // Find all keys that have arrays (which means they are detailed spec groups)
  const specGroups = Object.entries(specs)
    .filter(([_, value]) => Array.isArray(value) && value.length > 0)
    .sort((a, b) => {
      if (deviceGroups && deviceGroups.length > 0) {
        const indexA = deviceGroups.indexOf(a[0]);
        const indexB = deviceGroups.indexOf(b[0]);
        const valA = indexA === -1 ? 999 : indexA;
        const valB = indexB === -1 ? 999 : indexB;
        if (valA !== valB) return valA - valB;
      }
      
      const isABox = a[0].toLowerCase().includes('box');
      const isBBox = b[0].toLowerCase().includes('box');
      if (isABox && !isBBox) return 1;
      if (!isABox && isBBox) return -1;
      return 0;
    });

  // Map known groups to icons, with a fallback
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

  // Format the title if it's an old camelCase key (e.g., generalSpecs -> General)
  const formatTitle = (key) => {
    if (key.endsWith('Specs')) {
      const base = key.replace('Specs', '');
      return base.charAt(0).toUpperCase() + base.slice(1);
    }
    return key;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <h2 style={{fontSize: "var(--font-size-h2-default, var(--font-size-h2-default))"}} className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
        {device.name} - Specs
      </h2>

      {specGroups.map(([key, specArray], index) => {
        const title = formatTitle(key);
        const Icon = getIconForGroup(title);

        return (
          <React.Fragment key={key}>
            <SpecCard title={title} icon={Icon} specs={specArray} />
            {/* Insert ads periodically, similar to old layout */}
            {!hideAds && (index === 2 || index === 7) && <InFeedAd />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
