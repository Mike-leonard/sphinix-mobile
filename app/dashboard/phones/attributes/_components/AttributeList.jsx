import React from 'react';
import { Button } from '@/components/ui/button';
import { Tag, Edit2, Trash2, Check, X, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';

export default function AttributeList({
  attributes,
  groupedAttributes,
  activeGroupId,
  availableGroups,
  editingAttributeId,
  setEditingAttributeId,
  editValue,
  setEditValue,
  editSlug,
  setEditSlug,
  editGroupIds,
  setEditGroupIds,
  expandedRowId,
  setExpandedRowId,
  newTermValues,
  setNewTermValues,
  isPending,
  draggedAttribute,
  setDraggedAttribute,
  handleAttributeDragStart,
  handleAttributeDragOver,
  handleAttributeDrop,
  handleSaveEdit,
  confirmDeleteAttribute,
  handleAddTerm,
  handleRemoveTerm,
  toggleRow,
  setShowAddForm
}) {
  return (
    <div className="flex-1 min-w-0 space-y-6">
      {attributes.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
           <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
             <Tag className="w-8 h-8 text-slate-300 dark:text-slate-600" />
           </div>
           <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No attributes found</h3>
           <p className="text-sm text-slate-500 max-w-sm">Get started by creating your first device attribute above.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-all duration-200">
          <div className="px-6 py-5 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
                 <Tag className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest text-xs">{activeGroupId}</h3>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {(groupedAttributes[activeGroupId] || []).length} Attribute{(groupedAttributes[activeGroupId] || []).length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/50 p-2 min-h-[300px]">
            {!(groupedAttributes[activeGroupId] || []).length ? (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center text-slate-500">
                <Tag className="w-10 h-10 mb-3 opacity-20" />
                <p>No attributes in this group yet.</p>
                <button onClick={() => setShowAddForm(true)} className="text-brand-600 text-sm font-semibold mt-2 hover:underline">Add one now</button>
              </div>
            ) : (
              (groupedAttributes[activeGroupId] || []).map(attr => (
                <div 
                  key={attr.id} 
                  draggable={!editingAttributeId}
                  onDragStart={(e) => handleAttributeDragStart(e, attr)}
                  onDragOver={(e) => handleAttributeDragOver(e, attr)}
                  onDrop={(e) => handleAttributeDrop(e, attr)}
                  onDragEnd={() => setDraggedAttribute(null)}
                  className={`group/row flex flex-col p-2 rounded-2xl transition-all cursor-grab active:cursor-grabbing ${
                    draggedAttribute?.id === attr.id ? 'opacity-50 border border-dashed border-brand-500 bg-brand-50/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/25 border border-transparent'
                  }`}
                >
                  <div className="flex flex-wrap md:flex-nowrap items-center justify-between p-2 gap-4">
                    
                    <div className="flex items-center gap-4 flex-1">
                      <GripVertical className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-brand-500 transition-colors hidden md:block" />
                      <div 
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${expandedRowId === attr.id ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 group-hover/row:bg-white dark:group-hover/row:bg-slate-700 shadow-sm'}`}
                        onClick={() => toggleRow(attr.id)}
                      >
                        {expandedRowId === attr.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                      
                      {editingAttributeId === attr.id ? (
                        <div className="flex flex-wrap items-center gap-3 w-full" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-40 bg-white dark:bg-slate-950 border border-brand-500 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none shadow-sm"
                            placeholder="Name"
                            autoFocus
                          />
                          <input
                            type="text"
                            value={editSlug}
                            onChange={(e) => setEditSlug(e.target.value)}
                            className="w-40 bg-white dark:bg-slate-950 border border-brand-500 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none shadow-sm"
                            placeholder="Slug (optional)"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(attr.id);
                              if (e.key === 'Escape') setEditingAttributeId(null);
                            }}
                          />
                          <div className="flex flex-col gap-1.5 max-h-24 overflow-y-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 min-w-[160px] shadow-inner">
                            {availableGroups.map(g => (
                              <label key={`edit-group-${g}`} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={editGroupIds.includes(g)}
                                  onChange={(e) => {
                                    if (e.target.checked) setEditGroupIds([...editGroupIds, g]);
                                    else setEditGroupIds(editGroupIds.filter(id => id !== g));
                                  }}
                                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-3.5 w-3.5"
                                />
                                {g}
                              </label>
                            ))}
                          </div>
                          <button onClick={() => handleSaveEdit(attr.id)} disabled={isPending} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-colors shadow-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingAttributeId(null)} disabled={isPending} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shadow-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white text-[15px]">{attr.name}</h4>
                          <span className="text-xs text-slate-400 font-mono tracking-tight">{attr.slug}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex">
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                          {(attr.terms || []).length} Terms
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                        {editingAttributeId !== attr.id && (
                          <>
                            <button
                              onClick={() => {
                                setEditingAttributeId(attr.id);
                                setEditValue(attr.name);
                                setEditSlug(attr.slug);
                                setEditGroupIds(attr.groupIds || (attr.groupId ? [attr.groupId] : ['General']));
                              }}
                              disabled={isPending}
                              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow text-slate-400 hover:text-brand-600 hover:border-brand-200 dark:hover:border-brand-900/50 rounded-xl transition-all"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => confirmDeleteAttribute(attr.id, attr.name)}
                              disabled={isPending}
                              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow text-slate-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expandable Terms Section */}
                  {expandedRowId === attr.id && (
                    <div className="pl-14 pr-4 py-4 mt-2 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl mx-2 mb-2">
                      <h4 className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                        Terms Options
                        <span className="text-[10px] font-normal text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">Configurable options for {attr.name}</span>
                      </h4>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {(attr.terms || []).length === 0 ? (
                          <span className="text-sm text-slate-400 italic">No terms configured yet. Start adding them below.</span>
                        ) : (
                          (attr.terms || []).map(term => (
                            <span key={`term-${term}`} className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:shadow-md transition-shadow group/term">
                              {term}
                              <button 
                                onClick={() => handleRemoveTerm(attr.id, term)}
                                disabled={isPending}
                                className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors opacity-50 group-hover/term:opacity-100"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ))
                        )}
                      </div>

                      <div className="flex items-center gap-2 max-w-md bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
                        <input
                          type="text"
                          value={newTermValues[attr.id] || ''}
                          onChange={(e) => setNewTermValues({ ...newTermValues, [attr.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddTerm(attr.id);
                          }}
                          placeholder="Add a new term (e.g. 8GB, Bluetooth 5.0)"
                          disabled={isPending}
                          className="flex-1 bg-transparent border-none px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-0 placeholder-slate-400"
                        />
                        <Button
                          onClick={() => handleAddTerm(attr.id)}
                          disabled={isPending || !(newTermValues[attr.id] || '').trim()}
                          className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-5 h-9 text-sm font-medium shadow-md shadow-brand-500/20 disabled:opacity-50"
                        >
                          Add Term
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
