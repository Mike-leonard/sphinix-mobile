import React from 'react';

export default function DeviceSpecsTable({ specs }) {
  return (
    <div className="mt-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Technical Specifications</h2>
      </div>
      <div className="p-0">
        <table className="w-full text-left text-sm">
          <tbody>
            {Object.entries(specs).map(([key, value], index) => (
              <tr 
                key={key} 
                className={`border-b border-slate-100 dark:border-slate-800/60 last:border-0 ${index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-900/50'}`}
              >
                <th className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-300 w-1/3 capitalize">
                  {key}
                </th>
                <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                  {value}
                </td>
              </tr>
            ))}
            {/* Generic filler specs for design fullness */}
            <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900">
              <th className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-300 w-1/3">OS</th>
              <td className="py-4 px-6 text-slate-600 dark:text-slate-400">Latest Operating System</td>
            </tr>
            <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50">
              <th className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-300 w-1/3">Connectivity</th>
              <td className="py-4 px-6 text-slate-600 dark:text-slate-400">5G, Wi-Fi 7, Bluetooth 5.4, NFC</td>
            </tr>
            <tr className="bg-white dark:bg-slate-900">
              <th className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-300 w-1/3">Water Resistance</th>
              <td className="py-4 px-6 text-slate-600 dark:text-slate-400">IP68 dust/water resistant</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
