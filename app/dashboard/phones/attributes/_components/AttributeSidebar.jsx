import React from 'react';
import { Tag, GripVertical } from 'lucide-react';

export default function AttributeSidebar({
  orderedGroups,
  groupedAttributes,
  activeGroupId,
  setActiveGroupId,
  draggedGroup,
  setDraggedGroup,
  handleDragStart,
  handleDragOver,
  handleDrop
}) {
  return (
    <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
      <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/50 p-4 rounded-2xl">
        <h4 className="text-sm font-semibold text-brand-800 dark:text-brand-300 mb-1 flex items-center gap-2">
          <GripVertical className="w-4 h-4" /> Global Layout Order
        </h4>
        <p className="text-xs text-brand-600/80 dark:text-brand-400/80 leading-relaxed">
          Drag and drop these groups to reorder them.
        </p>
      </div>
      
      <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 hide-scrollbar" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        {orderedGroups.map(group => {
          const groupAttrs = groupedAttributes[group] || [];
          const isActive = activeGroupId === group;
          return (
            <button 
              key={`nav-${group}`}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, group)}
              onDragOver={(e) => handleDragOver(e, group)}
              onDragEnd={() => setDraggedGroup(null)}
              onClick={() => setActiveGroupId(group)}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl whitespace-nowrap lg:whitespace-normal transition-all text-sm font-semibold border cursor-pointer ${
                draggedGroup === group ? 'opacity-50 border-dashed' : ''
              } ${
                isActive 
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 border-brand-500' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 pointer-events-none">
                <GripVertical className={`w-4 h-4 cursor-grab ${isActive ? 'text-brand-300' : 'text-slate-300'}`} />
                <Tag className={`w-4 h-4 ${isActive ? 'text-brand-200' : 'text-slate-400'}`} />
                {group}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ml-3 pointer-events-none ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {groupAttrs.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
