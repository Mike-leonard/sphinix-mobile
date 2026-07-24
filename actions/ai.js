'use server';

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
