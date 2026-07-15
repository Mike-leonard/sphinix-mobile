'use client';

import React from 'react';
import Link from 'next/link';
import { MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown, Smartphone } from 'lucide-react';
import { cn, generateBrandSlug } from '@/lib/utils';

export default function DevicesTable({
  paginatedDevices,
  handleSort,
  sortField,
  sortOrder,
  activeRowId,
  setActiveRowId,
  isPending,
  viewMode,
  promptTrash,
  handleRestore,
  promptDelete
}) {
  const SortIcon = ({ field }) => (
    <ArrowUpDown 
      className={cn(
        "h-3 w-3 ml-1 inline-block transition-colors cursor-pointer hover:text-slate-700 dark:hover:text-slate-300",
        sortField === field ? "text-brand-500" : "text-slate-400"
      )} 
      onClick={() => handleSort(field)}
    />
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium w-16">Image</th>
              <th className="px-6 py-4 font-medium">Device <SortIcon field="name" /></th>
              <th className="px-6 py-4 font-medium">Brand <SortIcon field="brand" /></th>
              <th className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors select-none" onClick={() => handleSort('status')}>
                <div className="flex items-center">Status <SortIcon field="status" /></div>
              </th>
              <th className="px-6 py-4 font-medium">Price <SortIcon field="price" /></th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {paginatedDevices.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  <Smartphone className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                  <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">No devices found</p>
                  <p>Try adjusting your search or brand filters.</p>
                </td>
              </tr>
            ) : (
              paginatedDevices.map((device) => (
                <tr 
                  key={device.id} 
                  className={cn(
                    "group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50",
                    isPending ? "opacity-60 pointer-events-none" : ""
                  )}
                  onMouseEnter={() => setActiveRowId(device.id)}
                  onMouseLeave={() => setActiveRowId(null)}
                >
                  <td className="px-6 py-4">
                    <div className={cn("w-10 h-12 rounded bg-gradient-to-br flex items-center justify-center", device.imageColor || 'from-slate-600 to-zinc-800')}>
                      <Smartphone className="h-5 w-5 text-white/80" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <Link 
                        href={`/dashboard/devices/${device.id}/edit`} 
                        className={`font-medium transition-colors ${
                          device.status === 'draft'
                            ? 'text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300'
                            : 'text-slate-900 dark:text-white hover:text-brand-600'
                        }`}
                      >
                        {device.name}
                      </Link>
                      <span className="text-xs text-slate-500 truncate max-w-xs" title={device.specs?.chipset}>
                        {device.specs?.chipset || 'No chipset info'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {device.brand}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {device.status === 'published' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                        Published
                      </span>
                    ) : device.status === 'trash' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                        Trash
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {device.price}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      {viewMode === 'active' ? (
                        <>
                          {device.status === 'published' && (
                            <Link 
                              href={`/devices/${generateBrandSlug(device.brand || 'unknown')}/${device.id}`}
                              target="_blank"
                              className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                              title="View Public Page"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          )}
                          
                          <Link 
                            href={`/dashboard/devices/${device.id}/edit`}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit Device"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          
                          <button 
                            onClick={() => promptTrash(device.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Move to Trash"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleRestore(device.id)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                            title="Restore"
                          >
                            Restore
                          </button>
                          
                          <button 
                            onClick={() => promptDelete(device.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                            title="Delete Permanently"
                          >
                            Delete Forever
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
