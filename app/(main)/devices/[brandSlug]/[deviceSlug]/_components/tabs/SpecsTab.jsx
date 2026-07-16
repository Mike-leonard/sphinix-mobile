import React from 'react';
import SpecCard from './SpecCard';
import {
  Smartphone, Palette, Antenna, Globe, Mail,
  Battery, LayoutTemplate, Cpu, Monitor, Film, Camera,
  List
} from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';
import InFeedAd from '@/components/ads/InFeedAd';

export default function SpecsTab({ device, hideAds = false }) {
  const specs = device?.specs || {};

  // Find all keys that have arrays (which means they are detailed spec groups)
  const specGroups = Object.entries(specs)
    .filter(([_, value]) => Array.isArray(value) && value.length > 0);

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
      <h2  style={{fontSize: "var(--font-size-h2-default, var(--font-size-h2-default))"}} className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
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
