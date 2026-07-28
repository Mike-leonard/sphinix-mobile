'use client';

import React, { useState } from 'react';
import {
  createAffiliateCountry,
  updateAffiliateCountry,
  deleteAffiliateCountry
} from '@/actions/affiliate-countries';

import AffiliateCountryForm from './AffiliateCountryForm';
import AffiliateCountryList from './AffiliateCountryList';

export default function AffiliateCountryManager({ initialCountries = [] }) {
  const [countries, setCountries] = useState(initialCountries);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    flag: '🌐',
    currencySymbol: '$',
    currencyCode: 'USD',
    isDefault: false,
    enabled: true,
    stores: ['Amazon', 'Best Buy', 'Walmart', 'eBay']
  });
  const [newStoreInput, setNewStoreInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      setMessage('Country Name and ISO Code are required.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (editingId) {
        const res = await updateAffiliateCountry(editingId, formData);
        if (res.success) {
          setMessage('Country updated successfully!');
          setCountries(
            countries.map((c) =>
              c.id === editingId ? { ...c, ...formData } : formData.isDefault ? { ...c, isDefault: false } : c
            )
          );
          setEditingId(null);
          resetForm();
        } else {
          setMessage(res.error || 'Failed to update country.');
        }
      } else {
        const res = await createAffiliateCountry(formData);
        if (res.success) {
          setMessage('Country added successfully!');
          window.location.reload();
        } else {
          setMessage(res.error || 'Failed to add country.');
        }
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      flag: '🌐',
      currencySymbol: '$',
      currencyCode: 'USD',
      isDefault: false,
      enabled: true,
      stores: ['Amazon', 'Best Buy', 'Walmart', 'eBay']
    });
    setNewStoreInput('');
    setEditingId(null);
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    const storeList = Array.isArray(c.stores)
      ? c.stores.map((s) => (typeof s === 'string' ? s : s.name || s.id))
      : ['Amazon', 'Best Buy', 'Walmart', 'eBay'];

    setFormData({
      name: c.name,
      code: c.code,
      flag: c.flag,
      currencySymbol: c.currencySymbol,
      currencyCode: c.currencyCode,
      isDefault: c.isDefault,
      enabled: c.enabled,
      stores: storeList
    });
  };

  const handleToggleEnabled = async (country) => {
    try {
      const updatedEnabled = !country.enabled;
      const res = await updateAffiliateCountry(country.id, { enabled: updatedEnabled });
      if (res.success) {
        setCountries(countries.map((c) => (c.id === country.id ? { ...c, enabled: updatedEnabled } : c)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetDefault = async (country) => {
    try {
      const res = await updateAffiliateCountry(country.id, { isDefault: true });
      if (res.success) {
        setCountries(countries.map((c) => ({ ...c, isDefault: c.id === country.id })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this country entry?')) return;
    try {
      const res = await deleteAffiliateCountry(id);
      if (res.success) {
        setCountries(countries.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <AffiliateCountryForm
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        newStoreInput={newStoreInput}
        setNewStoreInput={setNewStoreInput}
        loading={loading}
        message={message}
        onSubmit={handleSubmit}
        onReset={resetForm}
      />
      <AffiliateCountryList
        countries={countries}
        onToggleEnabled={handleToggleEnabled}
        onSetDefault={handleSetDefault}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
