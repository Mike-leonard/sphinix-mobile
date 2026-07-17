import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const BoolIcon = ({ value }) => value 
  ? <CheckCircle2 className="w-5 h-5 fill-green-500 text-white border-none" /> 
  : <XCircle className="w-5 h-5 fill-red-500 text-white border-none" />;

export function SpecRow({ label, value }) {
  if (value === undefined || value === null) return null;
  
  let displayValue = value;
  if (typeof value === 'boolean') {
    displayValue = <BoolIcon value={value} />;
  } else if (typeof value === 'string') {
    const lowerVal = value.toLowerCase().trim();
    if (lowerVal === 'yes') {
      displayValue = <BoolIcon value={true} />;
    } else if (lowerVal === 'no') {
      displayValue = <BoolIcon value={false} />;
    }
  }

  return (
    <div className="flex flex-col sm:flex-row px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <div className="sm:w-1/3 font-semibold text-slate-600 dark:text-slate-400 mb-1 sm:mb-0">
        {label}
      </div>
      <div className="sm:w-2/3 text-slate-900 dark:text-slate-200 flex items-center">
        {displayValue}
      </div>
    </div>
  );
}

export default function SpecCard({ title, icon: Icon, specs }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h3  style={{fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))"}} className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-slate-400 dark:text-slate-500" />}
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
        {specs.map((spec, index) => (
          <SpecRow key={index} label={spec.label} value={spec.value} />
        ))}
      </div>
    </div>
  );
}
