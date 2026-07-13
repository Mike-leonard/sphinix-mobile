'use client';

import React, { useState } from 'react';
import { List, Plus, Trash2, GripVertical } from 'lucide-react';

const SPEC_CATEGORIES = [
  { id: 'generalSpecs', label: 'General' },
  { id: 'designSpecs', label: 'Design' },
  { id: 'networkSpecs', label: 'Network' },
  { id: 'dataSpecs', label: 'Data' },
  { id: 'messagingSpecs', label: 'Messaging' },
  { id: 'batterySpecs', label: 'Battery' },
  { id: 'softwareSpecs', label: 'Software' },
  { id: 'hardwareSpecs', label: 'Hardware' },
  { id: 'displaySpecs', label: 'Display' },
  { id: 'mediaSpecs', label: 'Media' },
  { id: 'cameraSpecs', label: 'Camera Detailed' }
];

export default function DeviceDetailedSpecs({ specs, onChange }) {
  const [activeCategory, setActiveCategory] = useState('generalSpecs');

  const activeSpecsList = specs?.[activeCategory] || [];

  const handleAddSpec = () => {
    onChange({
      ...specs,
      [activeCategory]: [...activeSpecsList, { label: '', value: '' }]
    });
  };

  const handleUpdateSpec = (index, field, newValue) => {
    const updatedList = [...activeSpecsList];
    updatedList[index] = { ...updatedList[index], [field]: newValue };
    onChange({
      ...specs,
      [activeCategory]: updatedList
    });
  };

  const handleRemoveSpec = (index) => {
    const updatedList = activeSpecsList.filter((_, i) => i !== index);
    onChange({
      ...specs,
      [activeCategory]: updatedList
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
        <List className="h-5 w-5 text-indigo-500" />
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Detailed Specifications</h2>
          <p className="text-sm text-slate-500">Manage the comprehensive spec sheet grouped by categories.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-full">
        {/* Categories Sidebar */}
        <div className="w-full md:w-48 lg:w-56 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto gap-1">
          {SPEC_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
              {specs?.[cat.id]?.length > 0 && (
                <span className="ml-2 text-xs opacity-60">({specs[cat.id].length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Specs Editor */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              {SPEC_CATEGORIES.find(c => c.id === activeCategory)?.label} Specifications
            </h3>
            <button
              onClick={handleAddSpec}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              <Plus className="h-4 w-4" />
              Add Row
            </button>
          </div>

          <div className="space-y-3">
            {activeSpecsList.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No specifications in this category yet.
              </div>
            ) : (
              activeSpecsList.map((spec, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="mt-2.5 text-slate-300 dark:text-slate-600 cursor-move">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                    <input
                      type="text"
                      placeholder="Label (e.g. Dimensions)"
                      value={spec.label}
                      onChange={(e) => handleUpdateSpec(index, 'label', e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <div className="sm:col-span-2">
                      <textarea
                        rows={1}
                        placeholder="Value (e.g. 163 x 73.9 x 8.6 mm)"
                        value={String(spec.value)}
                        onChange={(e) => handleUpdateSpec(index, 'value', e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y min-h-[38px]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveSpec(index)}
                    className="mt-2 text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Remove Spec"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
