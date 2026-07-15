'use client';

import React, { useState, useTransition } from 'react';
import { Tag, Edit2, Trash2, Check, X, Plus, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import {
  createDeviceAttribute,
  updateDeviceAttribute,
  deleteDeviceAttribute,
  addAttributeTerm,
  deleteAttributeTerm,
  reorderDeviceAttributes
} from '@/actions/device-attributes';
import { reorderDeviceGroups } from '@/actions/device-groups';
import { Button } from '@/components/ui/button';

export default function AttributeManager({ initialAttributes, availableGroups = ['General'] }) {
  const [attributes, setAttributes] = useState(initialAttributes || []);
  const [newAttribute, setNewAttribute] = useState('');
  const [newAttributeSlug, setNewAttributeSlug] = useState('');
  const [newGroupIds, setNewGroupIds] = useState([availableGroups[0] || 'General']);
  const [isPending, startTransition] = useTransition();
  const [editingAttributeId, setEditingAttributeId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editGroupIds, setEditGroupIds] = useState([]);

  // Terms Management State
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [newTermValues, setNewTermValues] = useState({});

  // Layout State
  const [showAddForm, setShowAddForm] = useState(false);
  const [orderedGroups, setOrderedGroups] = useState(availableGroups);
  const orderedGroupsRef = React.useRef(availableGroups);
  const [activeGroupId, setActiveGroupId] = useState(availableGroups[0] || 'General');

  // DnD State
  const [draggedGroup, setDraggedGroup] = useState(null);
  const [draggedAttribute, setDraggedAttribute] = useState(null);

  // Sync orderedGroups if props change (e.g. from server action)
  React.useEffect(() => {
    setOrderedGroups(availableGroups);
    orderedGroupsRef.current = availableGroups;
  }, [availableGroups]);

  const handleDragStart = (e, group) => {
    setDraggedGroup(group);
    e.dataTransfer.effectAllowed = 'move';
    // Small timeout to make the original item look distinct or empty if desired, but not strictly needed
  };

  const handleDragOver = (e, group) => {
    e.preventDefault(); // Necessary to allow dropping
    if (!draggedGroup || draggedGroup === group) return;
    
    // Optimistic UI update
    setOrderedGroups(prev => {
      const newOrder = [...prev];
      const fromIndex = newOrder.indexOf(draggedGroup);
      const toIndex = newOrder.indexOf(group);
      
      newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, draggedGroup);
      orderedGroupsRef.current = newOrder;
      return newOrder;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedGroup) return;

    startTransition(async () => {
      const res = await reorderDeviceGroups(orderedGroupsRef.current);
      if (!res.success) {
        alert(res.error);
        setOrderedGroups(availableGroups); // Revert on failure
        orderedGroupsRef.current = availableGroups;
      }
    });
    setDraggedGroup(null);
  };


  const handleAddAttribute = (e) => {
    e.preventDefault();
    if (!newAttribute.trim()) return;

    startTransition(async () => {
      const res = await createDeviceAttribute(newAttribute, newGroupIds, newAttributeSlug);
      if (res.success) {
        setAttributes([...attributes, res.attribute].sort((a, b) => a.name.localeCompare(b.name)));
        setNewAttribute('');
        setNewAttributeSlug('');
      } else {
        alert(res.error);
      }
    });
  };

  const confirmDeleteAttribute = (attrId, attrName) => {
    if (confirm(`Are you sure you want to delete the attribute "${attrName}"?`)) {
      startTransition(async () => {
        const res = await deleteDeviceAttribute(attrId);
        if (res.success) {
          setAttributes(attributes.filter(a => a.id !== attrId));
          if (expandedRowId === attrId) setExpandedRowId(null);
        } else {
          alert(res.error);
        }
      });
    }
  };

  const handleSaveEdit = (attrId) => {
    if (!editValue.trim()) {
      setEditingAttributeId(null);
      return;
    }

    startTransition(async () => {
      const res = await updateDeviceAttribute(attrId, editValue.trim(), editGroupIds, editSlug);
      if (res.success) {
        setAttributes(attributes.map(a => {
          if (a.id === attrId) {
            return { 
              ...a, 
              name: editValue.trim(), 
              slug: editSlug.trim() || editValue.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''), 
              groupIds: editGroupIds 
            };
          }
          return a;
        }).sort((a, b) => a.name.localeCompare(b.name)));
        setEditingAttributeId(null);
      } else {
        alert(res.error);
      }
    });
  };

  const handleAddTerm = (attrId) => {
    const term = newTermValues[attrId];
    if (!term || !term.trim()) return;

    startTransition(async () => {
      const res = await addAttributeTerm(attrId, term);
      if (res.success) {
        setAttributes(attributes.map(a => {
          if (a.id === attrId) {
            return { ...a, terms: [...(a.terms || []), term.trim()] };
          }
          return a;
        }));
        setNewTermValues(prev => ({ ...prev, [attrId]: '' }));
      } else {
        alert(res.error);
      }
    });
  };

  const handleRemoveTerm = (attrId, term) => {
    startTransition(async () => {
      const res = await deleteAttributeTerm(attrId, term);
      if (res.success) {
        setAttributes(attributes.map(a => {
          if (a.id === attrId) {
            return { ...a, terms: a.terms.filter(t => t !== term) };
          }
          return a;
        }));
      } else {
        alert(res.error);
      }
    });
  };

  const toggleRow = (id) => {
    setExpandedRowId(prev => prev === id ? null : id);
  };

  const groupedAttributes = availableGroups.reduce((acc, group) => {
    acc[group] = attributes.filter(a => {
      if (a.groupIds && a.groupIds.length > 0) return a.groupIds.includes(group);
      return (a.groupId || 'General') === group;
    });
    return acc;
  }, {});

  const toggleGroup = (group) => {
    setActiveGroupId(group);
  };

  const handleAttributeDragStart = (e, attr) => {
    setDraggedAttribute(attr);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleAttributeDragOver = (e, targetAttr) => {
    e.preventDefault();
  };

  const handleAttributeDrop = (e, targetAttr) => {
    e.preventDefault();
    if (!draggedAttribute || draggedAttribute.id === targetAttr.id) {
      setDraggedAttribute(null);
      return;
    }

    // Get current global attributes order
    const newAttributes = [...attributes];
    const draggedIndex = newAttributes.findIndex(a => a.id === draggedAttribute.id);
    const targetIndex = newAttributes.findIndex(a => a.id === targetAttr.id);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedAttribute(null);
      return;
    }

    // Reorder in local state
    const [removed] = newAttributes.splice(draggedIndex, 1);
    newAttributes.splice(targetIndex, 0, removed);
    
    // Update local state immediately for snappy UI
    setAttributes(newAttributes);
    setDraggedAttribute(null);

    // Save to backend
    startTransition(async () => {
      const res = await reorderDeviceAttributes(newAttributes.map(a => a.id));
      if (!res.success) {
        alert(res.error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Attributes</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'Add Attribute'}
        </Button>
      </div>

      {showAddForm && (
        <div className="w-full">
        <form onSubmit={handleAddAttribute} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={newAttribute}
                onChange={(e) => setNewAttribute(e.target.value)}
                disabled={isPending}
                placeholder="e.g., RAM"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Slug (Optional)
              </label>
              <input
                type="text"
                value={newAttributeSlug}
                onChange={(e) => setNewAttributeSlug(e.target.value)}
                disabled={isPending}
                placeholder={newAttribute.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || "e.g., ram"}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
              />
              <p className="text-xs text-slate-500 mt-2">Leave empty to auto-generate from name.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Groups
              </label>
              <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 max-h-32 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  {availableGroups.map(group => (
                    <label key={group} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newGroupIds.includes(group)}
                        onChange={(e) => {
                          if (e.target.checked) setNewGroupIds([...newGroupIds, group]);
                          else setNewGroupIds(newGroupIds.filter(g => g !== group));
                        }}
                        disabled={isPending}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      {group}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isPending || !newAttribute.trim()}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/25 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Add Attribute'}
            </Button>
          </div>
        </form>
      </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
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
      </div>
    </div>
  );
}
