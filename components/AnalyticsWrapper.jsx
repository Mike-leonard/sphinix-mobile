'use client';

import React, { useState, useEffect } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function AnalyticsWrapper({ gaId }) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check initial consent from localStorage
    const savedConsent = localStorage.getItem('sphinix_cookie_consent');
    if (savedConsent === 'accepted') {
      setHasConsent(true);
    }

    // Listen for real-time consent changes from CookieConsent banner
    const handleConsentChange = (e) => {
      if (e.detail === 'accepted') {
        setHasConsent(true);
      } else {
        setHasConsent(false);
      }
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);
    return () => window.removeEventListener('cookieConsentChanged', handleConsentChange);
  }, []);

  if (!gaId || !hasConsent) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
