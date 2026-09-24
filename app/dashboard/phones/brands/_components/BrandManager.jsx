'use client';

import React, { useState, useTransition } from 'react';
import { createDeviceBrand, deleteDeviceBrand, updateDeviceBrand } from '@/actions/device-brands';
import BrandForm from './BrandForm';
import BrandList from './BrandList';
import EditBrandModal from './EditBrandModal';

export default function BrandManager({ initialBrands = [], brandCounts = {}, userRole }) {
  const isContentWriter = userRole?.toLowerCase() === 'contentwriter';
  const [brands, setBrands] = useState(initialBrands);
  const [sortOrder, setSortOrder] = useState('asc');
  const [formData, setFormData] = useState({ name: '', h1: '', intro: '' });
  const [isPending, startTransition] = useTransition();
  const [editingBrand, setEditingBrand] = useState(null);

  const handleAddBrand = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    startTransition(async () => {
      const res = await createDeviceBrand(formData.name.trim(), {
        h1: formData.h1.trim(),
        intro: formData.intro.trim()
      });

      if (res.success) {
        const newBrandObj = res.brand || {
          id: Date.now(),
          name: formData.name.trim(),
          slug: formData.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          h1: formData.h1.trim(),
          intro: formData.intro.trim()
        };

        setBrands(prev => [...prev, newBrandObj].sort((a, b) => a.name.localeCompare(b.name)));
        setFormData({ name: '', h1: '', intro: '' });
      } else {
        alert(res.error || 'Failed to create brand');
      }
    });
  };

  const confirmDeleteBrand = (brandNameToDelete) => {
    if (confirm(`Are you sure you want to delete "${brandNameToDelete}"? Any devices assigned to this brand will be moved to "Other".`)) {
      startTransition(async () => {
        const res = await deleteDeviceBrand(brandNameToDelete);
        if (res.success) {
          setBrands(prev => prev.filter(b => b.name !== brandNameToDelete));
        } else {
          alert(res.error || 'Failed to delete brand');
        }
      });
    }
  };

  const handleSaveEdit = ({ oldName, newName, h1, intro }) => {
    startTransition(async () => {
      const res = await updateDeviceBrand(oldName, newName, { h1, intro });
      if (res.success) {
        setBrands(prev => prev.map(b => {
          if (b.name === oldName) {
            return {
              ...b,
              name: newName,
              slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              h1,
              intro
            };
          }
          return b;
        }));
        setEditingBrand(null);
      } else {
        alert(res.error || 'Failed to update brand');
      }
    });
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortedBrands = [...brands].sort((a, b) => {
    return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
  });

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <BrandForm 
          formData={formData}
          setFormData={setFormData}
          isPending={isPending}
          handleAddBrand={handleAddBrand}
        />
        <BrandList 
          sortedBrands={sortedBrands}
          brandCounts={brandCounts}
          onOpenEdit={(brand) => setEditingBrand(brand)}
          isPending={isPending}
          isContentWriter={isContentWriter}
          toggleSort={toggleSort}
          confirmDeleteBrand={confirmDeleteBrand}
        />
      </div>

      <EditBrandModal
        isOpen={Boolean(editingBrand)}
        brand={editingBrand}
        onClose={() => setEditingBrand(null)}
        onSave={handleSaveEdit}
        isPending={isPending}
      />
    </>
  );
}
