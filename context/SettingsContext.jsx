'use client';

import React, { createContext, useContext } from 'react';

const SettingsContext = createContext(null);

export function SettingsProvider({ settings, children }) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
