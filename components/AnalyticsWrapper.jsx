'use client';

import React, { useState, useEffect } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function AnalyticsWrapper({ gaId }) {
  const activeGaId = gaId || process.env.NEXT_PUBLIC_GA_ID || 'G-6PKG3EWYHX';
  const [hasConsent, setHasConsent] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('sphinix_cookie_consent') !== 'declined';
  });

  useEffect(() => {
    // Listen for real-time consent changes from CookieConsent banner
    const handleConsentChange = (e) => {
      setHasConsent(e.detail !== 'declined');
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);
    return () => window.removeEventListener('cookieConsentChanged', handleConsentChange);
  }, []);

  if (!activeGaId || !hasConsent) return null;

  return <GoogleAnalytics gaId={activeGaId} />;
}
