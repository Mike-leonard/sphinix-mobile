'use server';

import { headers } from 'next/headers';

export async function detectVisitorCountry() {
  try {
    const headerList = await headers();
    const cloudCountry =
      headerList.get('x-vercel-ip-country') ||
      headerList.get('cf-ipcountry') ||
      headerList.get('x-country-code') ||
      headerList.get('cloudfront-viewer-country');

    if (cloudCountry && cloudCountry !== 'XX') {
      return cloudCountry.toUpperCase();
    }

    const forwarded = headerList.get('x-forwarded-for');
    const ip = forwarded
      ? forwarded.split(',')[0].trim()
      : headerList.get('x-real-ip') || '';

    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
      return 'US';
    }

    try {
      const geoip = require('geoip-lite');
      const geo = geoip ? geoip.lookup(ip) : null;
      if (geo && geo.country) {
        return geo.country.toUpperCase();
      }
    } catch (e) {
      // Fallback if geoip-lite dat files are excluded by Next.js bundler
    }

    return 'US';
  } catch (error) {
    return 'US';
  }
}
