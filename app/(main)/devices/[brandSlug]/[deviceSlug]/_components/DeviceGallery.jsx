'use client';
import React, { useState } from 'react';
import { ANGLES } from './gallery/constants';
import MainImageView from './gallery/MainImageView';
import GalleryThumbnails from './gallery/GalleryThumbnails';

export default function DeviceGallery({ device }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? ANGLES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === ANGLES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-4">
      <MainImageView 
        device={device} 
        activeIndex={activeIndex} 
        handlePrevious={handlePrevious} 
        handleNext={handleNext} 
      />
      <GalleryThumbnails 
        device={device} 
        activeIndex={activeIndex} 
        setActiveIndex={setActiveIndex} 
      />
    </div>
  );
}
