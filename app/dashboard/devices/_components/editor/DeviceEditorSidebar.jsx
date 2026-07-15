import React from 'react';
import { Sparkles, Wand2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DeviceEditorSidebar({ formData, setFormData }) {
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
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Community</h2>
        </div>
        
        <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Allow User Reviews
                </label>
                <p className="text-xs text-slate-500 mt-1">Enable public comments and ratings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData?.allowReviews !== false}
                  onChange={(e) => setFormData && setFormData({ ...formData, allowReviews: e.target.checked })}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-600"></div>
              </label>
            </div>
        </div>
      </div>
    </div>
  );
}
