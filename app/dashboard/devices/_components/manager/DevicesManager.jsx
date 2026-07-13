'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { deleteDevice, trashDevice, restoreDevice } from '@/actions/devices';

import DevicesToolbar from './DevicesToolbar';
import DevicesTable from './DevicesTable';
import DevicesPagination from './DevicesPagination';
import DevicesConfirmModal from './DevicesConfirmModal';

export default function DevicesManager({ initialDevices }) {
  const [devices, setDevices] = useState(initialDevices);
  const [viewMode, setViewMode] = useState('active');
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [activeRowId, setActiveRowId] = useState(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: '',
    deviceId: null,
    title: '',
    message: ''
  });

  const brands = useMemo(() => {
    const b = new Set(devices.filter(d => d.status !== 'trash').map(d => d.brand));
    return ['All', ...Array.from(b)].filter(Boolean);
  }, [devices]);

  const [isPending, startTransition] = useTransition();

  const promptTrash = (id) => {
    setModalConfig({
      isOpen: true,
      type: 'trash',
      deviceId: id,
      title: 'Move to Trash',
      message: 'Are you sure you want to move this device to the trash?'
    });
  };

  const promptDelete = (id) => {
    setModalConfig({
      isOpen: true,
      type: 'delete',
      deviceId: id,
      title: 'Delete Device',
      message: 'Are you sure you want to permanently delete this device? This action cannot be undone.'
    });
  };

  const handleConfirm = async () => {
    const { type, deviceId } = modalConfig;
    if (!deviceId) return;

    startTransition(async () => {
      if (type === 'trash') {
        const res = await trashDevice(deviceId);
        if (res.success) {
          setDevices(devices.map(d => d.id === deviceId ? { ...d, status: 'trash' } : d));
          setModalConfig({ ...modalConfig, isOpen: false });
        } else {
          alert(res.error || 'Failed to trash device');
        }
      } else if (type === 'delete') {
        const res = await deleteDevice(deviceId);
        if (res.success) {
          setDevices(devices.filter(d => d.id !== deviceId));
          setModalConfig({ ...modalConfig, isOpen: false });
        } else {
          alert(res.error || 'Failed to delete device');
        }
      }
    });
  };

  const handleRestore = async (id) => {
    startTransition(async () => {
      const res = await restoreDevice(id);
      if (res.success) {
        setDevices(devices.map(d => d.id === id ? { ...d, status: 'draft' } : d));
      } else {
        alert(res.error || 'Failed to restore device');
      }
    });
  };

  const filteredAndSortedDevices = useMemo(() => {
    let result = [...devices];
    
    if (viewMode === 'active') {
      result = result.filter(d => d.status !== 'trash');
    } else {
      result = result.filter(d => d.status === 'trash');
    }
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.brand.toLowerCase().includes(q) ||
        (d.specs?.chipset || '').toLowerCase().includes(q)
      );
    }

    if (selectedBrand !== 'All') {
      result = result.filter(d => d.brand === selectedBrand);
    }
    
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'brand') {
        comparison = (a.brand || '').localeCompare(b.brand || '');
      } else if (sortField === 'price') {
        const priceA = parseFloat((a.price || '').replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat((b.price || '').replace(/[^0-9.]/g, '')) || 0;
        comparison = priceA - priceB;
      } else if (sortField === 'status') {
        comparison = (a.status || 'draft').localeCompare(b.status || 'draft');
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [devices, search, selectedBrand, sortField, sortOrder, viewMode]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredAndSortedDevices.length / itemsPerPage);
  const paginatedDevices = filteredAndSortedDevices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <DevicesToolbar 
        search={search}
        setSearch={setSearch}
        setCurrentPage={setCurrentPage}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        brands={brands}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <DevicesTable 
        paginatedDevices={paginatedDevices}
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        activeRowId={activeRowId}
        setActiveRowId={setActiveRowId}
        isPending={isPending}
        viewMode={viewMode}
        promptTrash={promptTrash}
        handleRestore={handleRestore}
        promptDelete={promptDelete}
      />

      <DevicesPagination 
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <DevicesConfirmModal 
        modalConfig={modalConfig}
        setModalConfig={setModalConfig}
        handleConfirm={handleConfirm}
        isPending={isPending}
      />
    </div>
  );
}
