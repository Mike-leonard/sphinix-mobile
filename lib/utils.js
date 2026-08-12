import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const rawOrigin = process.env.NEXT_PUBLIC_BASE_URL
  || process.env.BASE_URL
  || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');



export function generateBlogSlug(title) {
  if (!title) return "";
  // Split by special characters: colon, question mark, or comma
  const parts = title.split(/[:?,]/);
  // Take the first part, trim it, convert to lowercase, and replace non-alphanumeric with hyphens
  const coreTitle = parts[0].trim();
  return coreTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const generateDeviceSlug = generateBlogSlug;
export const generateBrandSlug = generateBlogSlug;

export function getDeviceFirstImage(product) {
  if (!product) return null;
  
  if (Array.isArray(product.deviceGallery) && product.deviceGallery.length > 0) {
    const first = product.deviceGallery[0];
    const src = typeof first === 'string' ? first : first?.url || first?.src;
    if (src && typeof src === 'string' && src.trim() !== '') return src;
  }
  
  if (Array.isArray(product.specs?.gallery) && product.specs.gallery.length > 0) {
    const first = product.specs.gallery[0];
    const src = typeof first === 'string' ? first : first?.url || first?.src;
    if (src && typeof src === 'string' && src.trim() !== '') return src;
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    const found = product.images.find(img => img && typeof img === 'string' && img.trim() !== '');
    if (found) return found;
  }

  if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
    return product.image;
  }

  return null;
}

export function getDeviceImageAlt(product) {
  if (Array.isArray(product?.imageAlts) && product.imageAlts[0]) {
    return product.imageAlts[0];
  }
  return `${product?.brand || ''} ${product?.name || ''}`.trim();
}
