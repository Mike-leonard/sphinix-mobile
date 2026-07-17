'use client';

import React, { useState, useTransition } from 'react';
import { Settings2, Plus, X } from 'lucide-react';
import {
  saveDeviceFilters
} from '@/actions/device-filters';
import { Button } from '@/components/ui/button';
import FilterForm from './FilterForm';
import FilterList from './FilterList';

export default function FilterManager({ initialFilters = [], allAttributes = [] }) {
  const [filters, setFilters] = useState(initialFilters);
  const [isPending, startTransition] = useTransition();

  // New Filter State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAttributeSlug, setNewAttributeSlug] = useState('');

  // Edit State
  const [editingFilterId, setEditingFilterId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAttributeSlug, setEditAttributeSlug] = useState('');

  // Options State
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [newOptionValues, setNewOptionValues] = useState({});

  // DnD State
  const [draggedFilterIndex, setDraggedFilterIndex] = useState(null);
  const dragOrderedRef = React.useRef(filters);

  // Sync refs if props/state changes
  React.useEffect(() => {
    dragOrderedRef.current = filters;
  }, [filters]);

  const saveToBackend = async (newFilters) => {
    const res = await saveDeviceFilters(newFilters);
    if (!res.success) {
      alert(res.error);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedFilterIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedFilterIndex === null || draggedFilterIndex === index) return;
    
    setFilters(prev => {
      const newOrder = [...prev];
      const draggedItem = newOrder[draggedFilterIndex];
      newOrder.splice(draggedFilterIndex, 1);
      newOrder.splice(index, 0, draggedItem);
      
      dragOrderedRef.current = newOrder;
      setDraggedFilterIndex(index);
      return newOrder;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedFilterIndex === null) return;
    
    startTransition(async () => {
      await saveToBackend(dragOrderedRef.current);
    });
    setDraggedFilterIndex(null);
  };

  const handleAddFilter = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAttributeSlug) return;

    const newFilter = {
      id: `filter_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: newTitle.trim(),
      attributeSlug: newAttributeSlug,
      options: []
    };

    const newFilters = [...filters, newFilter];
    setFilters(newFilters);
    setNewTitle('');
    setNewAttributeSlug('');
    setShowAddForm(false);

    startTransition(async () => {
      await saveToBackend(newFilters);
    });
  };

  const handleUpdateFilter = (e, filterId) => {
    e.preventDefault();
    if (!editTitle.trim() || !editAttributeSlug) return;

    const newFilters = filters.map(f => {
      if (f.id === filterId) {
        return { ...f, title: editTitle.trim(), attributeSlug: editAttributeSlug };
      }
      return f;
    });

    setFilters(newFilters);
    setEditingFilterId(null);

    startTransition(async () => {
      await saveToBackend(newFilters);
    });
  };

  const handleDeleteFilter = (filterId) => {
    if (!confirm('Are you sure you want to delete this filter?')) return;
    
    const newFilters = filters.filter(f => f.id !== filterId);
    setFilters(newFilters);
    
    startTransition(async () => {
      await saveToBackend(newFilters);
    });
  };

  const handleAddOption = (filterId) => {
    const val = newOptionValues[filterId]?.trim();
    if (!val) return;

    const newFilters = filters.map(f => {
      if (f.id === filterId) {
        if (f.options.includes(val)) return f; // Prevent duplicates
        return { ...f, options: [...f.options, val] };
      }
      return f;
    });

    setFilters(newFilters);
    setNewOptionValues({ ...newOptionValues, [filterId]: '' });

    startTransition(async () => {
      await saveToBackend(newFilters);
    });
  };

  const handleDeleteOption = (filterId, optionIndex) => {
    const newFilters = filters.map(f => {
      if (f.id === filterId) {
        const newOptions = [...f.options];
        newOptions.splice(optionIndex, 1);
        return { ...f, options: newOptions };
      }
      return f;
    });

    setFilters(newFilters);

    startTransition(async () => {
      await saveToBackend(newFilters);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
            <Settings2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Filters</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage device filters shown in the sidebar</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 flex items-center gap-2"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'Add New Filter'}
        </Button>
      </div>

      {showAddForm && (
        <FilterForm 
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newAttributeSlug={newAttributeSlug}
          setNewAttributeSlug={setNewAttributeSlug}
          allAttributes={allAttributes}
          handleAddFilter={handleAddFilter}
          isPending={isPending}
        />
      )}

      <FilterList 
        filters={filters}
        editingFilterId={editingFilterId}
        setEditingFilterId={setEditingFilterId}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editAttributeSlug={editAttributeSlug}
        setEditAttributeSlug={setEditAttributeSlug}
        allAttributes={allAttributes}
        expandedRowId={expandedRowId}
        setExpandedRowId={setExpandedRowId}
        newOptionValues={newOptionValues}
        setNewOptionValues={setNewOptionValues}
        isPending={isPending}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleUpdateFilter={handleUpdateFilter}
        handleDeleteFilter={handleDeleteFilter}
        handleAddOption={handleAddOption}
        handleDeleteOption={handleDeleteOption}
      />
    </div>
  );
}
