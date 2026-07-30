'use server';

import { headers } from 'next/headers';

/**
 * -----------------------------------------------------------------------------
 * GEO-IP ACTION: detectVisitorCountry
 * -----------------------------------------------------------------------------
 * @description Detects visitor ISO 2-letter country code using CDN headers (Vercel, Cloudflare, CloudFront) or local Geo-IP lookup.
 * @why Resolves user location on public device pages to automatically highlight country-specific buy links and local currencies.
 * @where Called by: `app/(main)/phones/[brandSlug]/[deviceSlug]/_components/quick-info/AffiliateLinks.jsx`
 * @security Server-side IP header reading with local fallback to 'US'.
 * @returns {Promise<string>} ISO 2-letter uppercase country code (e.g. 'US', 'IT', 'BD').
 */
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
