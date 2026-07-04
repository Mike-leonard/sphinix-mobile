import React from 'react';
import {
  CheckCircle2, XCircle,
  Smartphone, Palette, Antenna, Globe, Mail,
  Battery, LayoutTemplate, Cpu, Monitor, Film, Camera
} from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';

const BoolIcon = ({ value }) => value
  ? <CheckCircle2 className="w-5 h-5 fill-green-500 text-white border-none mx-auto" />
  : <XCircle className="w-5 h-5 fill-red-500 text-white border-none mx-auto" />;

// Categories mapped to their icons and keys
const categories = [
  { key: 'generalSpecs', title: 'General', icon: Smartphone },
  { key: 'designSpecs', title: 'Design', icon: Palette },
  { key: 'networkSpecs', title: 'Network', icon: Antenna },
  { key: 'dataSpecs', title: 'Data', icon: Globe },
  { key: 'messagingSpecs', title: 'Messaging', icon: Mail },
  { key: 'batterySpecs', title: 'Battery', icon: Battery },
  { key: 'softwareSpecs', title: 'Software', icon: LayoutTemplate },
  { key: 'hardwareSpecs', title: 'Hardware', icon: Cpu },
  { key: 'displaySpecs', title: 'Display', icon: Monitor },
  { key: 'mediaSpecs', title: 'Media', icon: Film },
  { key: 'cameraSpecs', title: 'Camera', icon: Camera },
];

export default function ComparisonBody({ compareList, gridColsClass }) {
  return (
    <div className="flex flex-col gap-6">
      {categories.map((category, index) => {
        // Get all unique labels for this category across all devices in compareList
        const labelsMap = new Map();
        compareList.forEach(device => {
          const specArray = device.specs?.[category.key] || [];
          specArray.forEach(s => {
            labelsMap.set(s.label, true);
          });
        });
        const labels = Array.from(labelsMap.keys());

        if (labels.length === 0) return null;

        const Icon = category.icon;

        return (
          <React.Fragment key={category.key}>
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* Category Header */}
              <div className="bg-slate-50 dark:bg-slate-800/40 px-4 md:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <Icon className="w-5 h-5 text-brand-500" />
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">{category.title}</h4>
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
                      const specArray = device.specs?.[category.key] || [];
                      const specItem = specArray.find(s => s.label === label);
                      const val = specItem?.value;

                      let displayVal = val;
                      if (val === undefined || val === null) {
                        displayVal = <span className="text-slate-300 dark:text-slate-600">-</span>;
                      } else if (typeof val === 'boolean') {
                        displayVal = <BoolIcon value={val} />;
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

            {/* Inject Ads after the 4th and 8th categories */}
            {(index === 2 || index === 5 || index === 8) && (
              <div className="w-full">
                <AdBanner type="horizontal" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
