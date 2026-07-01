'use client';
import React, { createContext, useContext, useState } from 'react';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleToggleCompare = (product) => {
    setCompareList(prev => {
      const isCurrentlyCompared = prev.some(item => item.id === product.id);
      
      if (isCurrentlyCompared) {
        // If removing the last item, close the drawer
        if (prev.length === 1) setIsCompareOpen(false);
        return prev.filter(item => item.id !== product.id);
      } else {
        // Enforce max 3 limit
        if (prev.length >= 3) {
          alert("You can only compare up to 3 devices at a time.");
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsCompareOpen(false);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        isCompareOpen,
        setIsCompareOpen,
        handleToggleCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
