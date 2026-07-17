'use client';

import React, { useState, useTransition } from 'react';
import RatingBarForm from './RatingBarForm';
import RatingBarList from './RatingBarList';
import { createRatingBar, updateRatingBar, deleteRatingBar, reorderRatingBars } from '@/actions/rating-bars';
export default function RatingBarManager({ initialBars = [] }) {
  const [bars, setBars] = useState(initialBars);
  const [isPending, startTransition] = useTransition();
  
  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [defaultValue, setDefaultValue] = useState(3);
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', slug: '', description: '', defaultValue: 3 });

  // Drag and Drop State
  const [draggedBar, setDraggedBar] = useState(null);

  const handleDragStart = (e, bar) => {
    setDraggedBar(bar);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetBar) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetBar) => {
    e.preventDefault();
    if (!draggedBar || draggedBar.id === targetBar.id) {
      setDraggedBar(null);
      return;
    }

    const newBars = [...bars];
    const draggedIndex = newBars.findIndex(b => b.id === draggedBar.id);
    const targetIndex = newBars.findIndex(b => b.id === targetBar.id);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedBar(null);
      return;
    }

    const [removed] = newBars.splice(draggedIndex, 1);
    newBars.splice(targetIndex, 0, removed);
    
    setBars(newBars);
    setDraggedBar(null);

    startTransition(async () => {
      const res = await reorderRatingBars(newBars.map(b => b.id));
      if (!res.success) {
        alert('Failed to save order: ' + res.error);
      }
    });
  };

  const handleNameChange = (val) => {
    setName(val);
    if (!editingId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !slug) return;
    
    startTransition(async () => {
      const res = await createRatingBar({ name, slug, description, defaultValue: Number(defaultValue) });
      if (res.success) {
        setBars([...bars, res.data]);
        setName('');
        setSlug('');
        setDescription('');
        setDefaultValue(3);
      } else {
        alert(res.error);
      }
    });
  };

  const startEdit = (bar) => {
    setEditingId(bar.id);
    setEditForm({ name: bar.name, slug: bar.slug, description: bar.description || '', defaultValue: bar.defaultValue || 3 });
  };

  const handleUpdate = async () => {
    if (!editForm.name || !editForm.slug) return;
    
    startTransition(async () => {
      const res = await updateRatingBar(editingId, { ...editForm, defaultValue: Number(editForm.defaultValue) });
      if (res.success) {
        setBars(bars.map(b => b.id === editingId ? res.data : b));
        setEditingId(null);
      } else {
        alert(res.error);
      }
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this rating bar?')) return;
    
    startTransition(async () => {
      const res = await deleteRatingBar(id);
      if (res.success) {
        setBars(bars.filter(b => b.id !== id));
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <RatingBarForm 
        name={name}
        handleNameChange={handleNameChange}
        slug={slug}
        setSlug={setSlug}
        description={description}
        setDescription={setDescription}
        defaultValue={defaultValue}
        setDefaultValue={setDefaultValue}
        handleAdd={handleAdd}
        isPending={isPending}
      />
      <RatingBarList 
        bars={bars}
        editingId={editingId}
        editForm={editForm}
        setEditForm={setEditForm}
        isPending={isPending}
        draggedBar={draggedBar}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        setDraggedBar={setDraggedBar}
        startEdit={startEdit}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        setEditingId={setEditingId}
      />
    </div>
  );
}
