import React from 'react';

export default function AiToggleSection({ aiConfig, setAiConfig }) {
  return (
    <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
      <div className="relative flex items-center">
        <input 
          type="checkbox" 
          checked={aiConfig.enableAiFeatures} 
          onChange={e => setAiConfig({ ...aiConfig, enableAiFeatures: e.target.checked })} 
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
      </div>
      <div>
        <div className="font-semibold text-slate-900 dark:text-white text-sm">Enable AI Generation</div>
        <div className="text-xs text-slate-500">Allow the use of AI tools in the blog editor.</div>
      </div>
    </label>
  );
}
