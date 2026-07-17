'use client';

import React, { useState, useTransition } from 'react';
import { Tag, Edit2, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { createDeviceBrand, deleteDeviceBrand, updateDeviceBrand } from '@/actions/device-brands';
import { Button } from '@/components/ui/button';

import BrandForm from './BrandForm';
import BrandList from './BrandList';
export default function BrandManager({ initialBrands, brandCounts = {} }) {
  const [brands, setBrands] = useState(initialBrands);
  const [sortOrder, setSortOrder] = useState('asc');
  const [newBrand, setNewBrand] = useState('');
  const [isPending, startTransition] = useTransition();
  const [editingBrand, setEditingBrand] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAddBrand = (e) => {
    e.preventDefault();
    if (!newBrand.trim()) return;

    startTransition(async () => {
      const res = await createDeviceBrand(newBrand);
      if (res.success) {
        setBrands([...brands, newBrand.trim()].sort((a, b) => a.localeCompare(b)));
        setNewBrand('');
      } else {
        alert(res.error);
      }
    });
  };

  const confirmDeleteBrand = (brandToDelete) => {
    if (confirm(`Are you sure you want to delete "${brandToDelete}"? Any devices assigned to this brand will be moved to "Other".`)) {
      startTransition(async () => {
        const res = await deleteDeviceBrand(brandToDelete);
        if (res.success) {
          setBrands(brands.filter(b => b !== brandToDelete));
        } else {
          alert(res.error);
        }
      });
    }
  };

  const handleSaveEdit = () => {
    if (!editValue.trim() || editValue.trim() === editingBrand) {
      setEditingBrand(null);
      return;
    }

    startTransition(async () => {
      const res = await updateDeviceBrand(editingBrand, editValue.trim());
      if (res.success) {
        const newBrands = brands.filter(b => b !== editingBrand);
        newBrands.push(editValue.trim());
        setBrands(newBrands.sort((a, b) => a.localeCompare(b)));
        setEditingBrand(null);
      } else {
        alert(res.error);
      }
    });
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortedBrands = [...brands].sort((a, b) => {
    return sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <BrandForm 
        newBrand={newBrand}
        setNewBrand={setNewBrand}
        isPending={isPending}
        handleAddBrand={handleAddBrand}
      />
      <BrandList 
        sortedBrands={sortedBrands}
        brandCounts={brandCounts}
        editingBrand={editingBrand}
        setEditingBrand={setEditingBrand}
        editValue={editValue}
        setEditValue={setEditValue}
        isPending={isPending}
        toggleSort={toggleSort}
        handleSaveEdit={handleSaveEdit}
        confirmDeleteBrand={confirmDeleteBrand}
      />
    </div>
  );
}
