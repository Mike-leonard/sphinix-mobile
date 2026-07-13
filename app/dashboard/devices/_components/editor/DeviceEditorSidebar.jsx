import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DeviceEditorSidebar() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Tools</h2>
        </div>
        
        <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Generate from URL
              </label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="https://example.com/specs"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl">
                  <Wand2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Paste a link to any device specs page and AI will auto-fill the fields.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
