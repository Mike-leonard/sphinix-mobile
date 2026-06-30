'use client';

import * as React from 'react';
// Change 'next-themes' to '@teispace/next-themes'
import { ThemeProvider as NextThemesProvider } from '@teispace/next-themes';

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
