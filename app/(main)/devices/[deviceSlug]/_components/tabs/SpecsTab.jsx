import React from 'react';
import SpecCard from './SpecCard';
import {
  Smartphone, Palette, Antenna, Globe, Mail,
  Battery, LayoutTemplate, Cpu, Monitor, Film, Camera
} from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';
import InFeedAd from '@/components/ads/InFeedAd';

export default function SpecsTab({ device }) {
  const {
    generalSpecs = [],
    designSpecs = [],
    networkSpecs = [],
    dataSpecs = [],
    messagingSpecs = [],
    batterySpecs = [],
    softwareSpecs = [],
    hardwareSpecs = [],
    displaySpecs = [],
    mediaSpecs = [],
    cameraSpecs = []
  } = device.specs || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
        {device.name} - Specs
      </h2>

      {generalSpecs.length > 0 && <SpecCard title="General" icon={Smartphone} specs={generalSpecs} />}
      {designSpecs.length > 0 && <SpecCard title="Design" icon={Palette} specs={designSpecs} />}
      {networkSpecs.length > 0 && <SpecCard title="Network" icon={Antenna} specs={networkSpecs} />}
      <InFeedAd />
      {dataSpecs.length > 0 && <SpecCard title="Data" icon={Globe} specs={dataSpecs} />}
      {messagingSpecs.length > 0 && <SpecCard title="Messaging" icon={Mail} specs={messagingSpecs} />}
      {batterySpecs.length > 0 && <SpecCard title="Battery" icon={Battery} specs={batterySpecs} />}
      {softwareSpecs.length > 0 && <SpecCard title="Software" icon={LayoutTemplate} specs={softwareSpecs} />}
      {hardwareSpecs.length > 0 && <SpecCard title="Hardware" icon={Cpu} specs={hardwareSpecs} />}
      <InFeedAd />
      {displaySpecs.length > 0 && <SpecCard title="Display" icon={Monitor} specs={displaySpecs} />}
      {mediaSpecs.length > 0 && <SpecCard title="Media" icon={Film} specs={mediaSpecs} />}
      {cameraSpecs.length > 0 && <SpecCard title="Camera" icon={Camera} specs={cameraSpecs} />}
    </div>
  );
}
