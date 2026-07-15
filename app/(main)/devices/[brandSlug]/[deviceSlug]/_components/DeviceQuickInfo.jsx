import React from 'react';
import { Cpu, Server, HardDrive, Monitor, Camera, Settings } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import DeviceQuickInfoHeader from './quick-info/DeviceQuickInfoHeader';
import AffiliateLinks from './quick-info/AffiliateLinks';
import DeviceSpecBlock from './quick-info/DeviceSpecBlock';

export default function DeviceQuickInfo({ device }) {
  const { compareList, handleToggleCompare } = useCompare();
  const isComparing = compareList.some(item => item.id === device.id);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <DeviceQuickInfoHeader device={device} />
        <AffiliateLinks />
        
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
        <DeviceSpecBlock icon={Cpu} label="CPU" value={device.specs.chipset} />
        <DeviceSpecBlock icon={Server} label="RAM" value={device.specs.ram} />
        <DeviceSpecBlock icon={HardDrive} label="Storage" value={device.specs.storage} />
        <DeviceSpecBlock icon={Monitor} label="Display" value={device.specs.screen} />
        <DeviceSpecBlock icon={Camera} label="Camera" value={device.specs.camera} />
        <DeviceSpecBlock icon={Settings} label="OS" value="Latest Version" />
      </div>
    </div>
  );
}
