'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Loader2, Smartphone, ArrowLeft, Send, Sparkles, Wand2, Eye } from 'lucide-react';
import Link from 'next/link';
import { createDevice, updateDevice } from '@/actions/devices';
import { generateDeviceData } from '@/actions/ai';

import { Button } from '@/components/ui/button';
import LeaveConfirmationModal from '@/app/dashboard/blogs/_components/editor/LeaveConfirmationModal';

import DeviceBasicInfo from './DeviceBasicInfo';
import DeviceQuickSpecs from './DeviceQuickSpecs';
import DeviceDetailedSpecs from './DeviceDetailedSpecs';
import DeviceOverviewEditor from './DeviceOverviewEditor';
import DeviceExpertRatings from './DeviceExpertRatings';
import DeviceEditorSidebar from './DeviceEditorSidebar';

import DeviceHero from '@/app/(main)/devices/[brandSlug]/[deviceSlug]/_components/DeviceGallery';
import DeviceQuickInfo from '@/app/(main)/devices/[brandSlug]/[deviceSlug]/_components/DeviceQuickInfo';
import DeviceTabs from '@/app/(main)/devices/[brandSlug]/[deviceSlug]/_components/DeviceTabs';
import { CompareProvider } from '@/context/CompareContext';

const DEFAULT_DEVICE = {
  name: '',
  brand: '',
  price: '',
  imageColor: 'from-slate-600 to-zinc-800',
  isNew: true,
  isTopRated: false,
  status: 'draft',
  allowReviews: true,
  description: '',
  expertRatings: {},
  images: ['', '', '', ''],
  affiliates: {
    amazon: { url: '', price: '' },
    bestbuy: { url: '', price: '' },
    walmart: { url: '', price: '' },
    ebay: { url: '', price: '' }
  },
  specs: {
    screen: '',
    chipset: '',
    camera: '',
    battery: '',
    ram: '',
    storage: '',
    os: ''
  },
  seo: {
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  }
};

export default function DeviceEditor({ initialDevice = null, brands = [], allAttributes = [], ratingBars = [], deviceGroups = [] }) {
  const router = useRouter();
  const isEditMode = !!initialDevice;
  
  const [formData, setFormData] = useState(initialDevice || DEFAULT_DEVICE);
  const [initialFormState] = useState(formData);
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // Track form data changes
  React.useEffect(() => {
    if (JSON.stringify(formData) !== JSON.stringify(initialFormState)) {
      setIsDirty(true);
    }
  }, [formData, initialFormState]);

  // Block tab closing/reloading
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSave = (status) => {
    if (!formData.name || !formData.brand) {
      alert("Name and Brand are required");
      return;
    }

    startTransition(async () => {
      const dataToSave = {
        ...formData,
        status: status || formData.status
      };

      let res;
      if (isEditMode) {
        res = await updateDevice(dataToSave.id, dataToSave);
      } else {
        res = await createDevice(dataToSave);
      }

      if (res.success) {
        setIsDirty(false);
        router.push('/dashboard/devices');
        router.refresh();
      } else {
        alert(res.error || 'Failed to save device');
      }
    });
  };

  const handleGenerateDevice = async () => {
    if (!formData.name || !formData.brand) {
      alert("Please enter the device Brand and Name first (in the dropdown below).");
      return;
    }
    
    setIsGenerating(true);
    const res = await generateDeviceData(formData.name, formData.brand);
    setIsGenerating(false);
    
    if (res.success && res.data) {
      const mergedSpecs = {
        ...formData.specs,
        ...res.data.quickSpecs
      };
      
      if (res.data.detailedSpecs) {
        Object.entries(res.data.detailedSpecs).forEach(([groupName, specsList]) => {
          mergedSpecs[groupName] = specsList;
        });
      }

      setFormData(prev => ({
        ...prev,
        price: res.data.price || prev.price,
        description: res.data.description || prev.description,
        specs: mergedSpecs
      }));
    } else {
      alert(res.error || "Failed to generate device data");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-20 p-4 sm:p-8">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <button 
          type="button"
          onClick={(e) => {
            if (isDirty) {
              e.preventDefault();
              setShowLeaveModal(true);
            } else {
              router.push('/dashboard/devices');
            }
          }}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Devices
        </button>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => setIsPreview(!isPreview)} className="gap-2 rounded-xl">
            <Eye className="w-4 h-4" /> {isPreview ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => handleSave('draft')} disabled={isPending} className="gap-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700">
            <Save className="w-4 h-4" /> {isPending ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button type="button" onClick={() => handleSave('published')} disabled={isPending || (initialDevice?.status === 'published' && !isDirty)} className={`gap-2 rounded-xl text-white shadow-lg shadow-brand-500/25 ${initialDevice?.status === 'published' && !isDirty ? 'bg-brand-400 opacity-80 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}>
            <Send className="w-4 h-4" /> {isPending ? 'Publishing...' : (initialDevice?.status === 'published' && !isDirty ? 'Published' : 'Publish')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {isPreview ? (
          <CompareProvider>
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 overflow-hidden w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 pointer-events-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-8">
                <DeviceHero device={formData} />
                <DeviceQuickInfo device={formData} />
              </div>
              <DeviceTabs device={formData} hideAds={true} />
            </div>
          </CompareProvider>
        ) : (
          <>
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-6 relative">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3 w-full mr-4">
                    <Smartphone className="h-6 w-6 text-brand-500 shrink-0" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter Device Name..."
                      className="w-full bg-transparent text-xl sm:text-2xl font-bold text-slate-900 dark:text-white border-none focus:outline-none focus:ring-0 placeholder:text-slate-400 p-0"
                      required
                    />
                  </div>
                  <Button 
                    type="button"
                    onClick={handleGenerateDevice}
                    disabled={isGenerating}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/25 gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> 
                    {isGenerating ? 'Generating...' : 'AI Generate'}
                  </Button>
                </div>
                
                <DeviceBasicInfo 
                  formData={formData} 
                  setFormData={setFormData}
                  brands={brands} 
                />
              </div>

              <DeviceQuickSpecs 
                specs={formData.specs} 
                allAttributes={allAttributes}
                onChange={(key, value) => setFormData(prev => ({ 
                  ...prev, 
                  specs: { ...prev.specs, [key]: value } 
                }))} 
              />
              <DeviceDetailedSpecs 
                specs={formData.specs}
                deviceGroups={deviceGroups}
                allAttributes={allAttributes}
                onChange={(newSpecs) => {
                  setFormData({
                    ...formData,
                    specs: newSpecs
                  });
                }}
              />
              <DeviceOverviewEditor 
                description={formData.description} 
                onChange={(html) => setFormData(prev => ({ ...prev, description: html }))} 
              />
              <DeviceExpertRatings 
                expertRatings={formData.expertRatings || {}}
                ratingBars={ratingBars}
                onChange={(ratings) => setFormData(prev => ({ ...prev, expertRatings: ratings }))}
              />
            </div>

            {/* Sidebar */}
            <DeviceEditorSidebar formData={formData} setFormData={setFormData} />
          </>
        )}
      </div>

      <LeaveConfirmationModal 
        showLeaveModal={showLeaveModal}
        setShowLeaveModal={setShowLeaveModal}
        handleDiscard={() => {
          setIsDirty(false);
          router.push('/dashboard/devices');
        }}
      />
    </div>
  );
}
