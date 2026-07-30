'use server';

/**
 * -----------------------------------------------------------------------------
 * AI AGGREGATOR RE-EXPORTS
 * -----------------------------------------------------------------------------
 * @description Central server action entry point for all AI feature modules.
 * Re-exports dedicated domain handlers:
 *  - Blog AI: `generateBlogFromTitle`, `generateBlogFromUrl`
 *  - SEO AI: `generateSEOFromContent`, `generateDeviceSEO`
 *  - Device Specs AI: `generateDeviceData`, `generateDeviceDataFromUrl`
 */

import { generateBlogFromTitle, generateBlogFromUrl } from './ai/blog-actions';
import { generateSEOFromContent, generateDeviceSEO } from './ai/seo-actions';
import { generateDeviceData, generateDeviceDataFromUrl } from './ai/device-actions';

export {
  generateBlogFromTitle,
  generateBlogFromUrl,
  generateSEOFromContent,
  generateDeviceSEO,
  generateDeviceData,
  generateDeviceDataFromUrl
};
