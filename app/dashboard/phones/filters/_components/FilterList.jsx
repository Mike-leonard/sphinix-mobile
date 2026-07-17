import React from 'react';
import { Button } from '@/components/ui/button';
import { Tag, Edit2, Trash2, Check, X, Plus, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';

export default function FilterList({
  filters,
  editingFilterId,
  setEditingFilterId,
  editTitle,
  setEditTitle,
  editAttributeSlug,
  setEditAttributeSlug,
  allAttributes,
  expandedRowId,
  setExpandedRowId,
  newOptionValues,
  setNewOptionValues,
  isPending,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleUpdateFilter,
  handleDeleteFilter,
  handleAddOption,
  handleDeleteOption
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {filters.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          No filters created yet. Click "Add New Filter" to get started.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filters.map((filter, index) => {
            const isEditing = editingFilterId === filter.id;
            const isExpanded = expandedRowId === filter.id;
            
            return (
              <div 
                key={filter.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={handleDrop}
                className={`flex flex-col transition-colors ${isExpanded ? 'bg-slate-50 dark:bg-slate-800/20' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/10'}`}
              >
                <div className="flex items-center justify-between p-4 md:p-5 group">
                  <div className="flex items-center gap-4 flex-1">
                    <button className="cursor-grab active:cursor-grabbing p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      <GripVertical className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1 flex items-center gap-4">
                      {isEditing ? (
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                          <select 
                            value={editAttributeSlug}
                            onChange={(e) => setEditAttributeSlug(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50"
                          >
                            {allAttributes.map(a => (
                              <option key={a.slug} value={a.slug}>{a.name} ({a.slug})</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-900 dark:text-white">{filter.title}</span>
                          <span className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full font-mono flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {filter.attributeSlug}
                          </span>
                          <span className="text-xs px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">
                            {filter.options?.length || 0} Options
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button onClick={(e) => handleUpdateFilter(e, filter.id)} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20 rounded-lg transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingFilterId(null)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-lg transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => {
                            setEditTitle(filter.title);
                            setEditAttributeSlug(filter.attributeSlug);
                            setEditingFilterId(filter.id);
                            if (isExpanded) setExpandedRowId(null);
                          }} 
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteFilter(filter.id)} 
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setExpandedRowId(isExpanded ? null : filter.id)} 
                          className={`p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors ${isExpanded ? 'bg-slate-200 dark:bg-slate-800' : ''}`}
                        >
                          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Options Expansion */}
                {isExpanded && !isEditing && (
                  <div className="px-6 pb-6 pt-2 ml-8 border-l-2 border-indigo-100 dark:border-indigo-900/30">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {filter.options?.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 shadow-sm group/tag">
                          <span>{opt}</span>
                          <button 
                            onClick={() => handleDeleteOption(filter.id, oIndex)}
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover/tag:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 max-w-sm">
                      <input 
                        type="text" 
                        placeholder="Add new option (e.g. 4 GB)"
                        value={newOptionValues[filter.id] || ''}
                        onChange={(e) => setNewOptionValues({...newOptionValues, [filter.id]: e.target.value})}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddOption(filter.id);
                          }
                        }}
                        className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                      <Button 
                        onClick={() => handleAddOption(filter.id)}
                        disabled={!newOptionValues[filter.id]?.trim() || isPending}
                        variant="outline"
                        size="sm"
                        className="border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Press enter to add the option.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
