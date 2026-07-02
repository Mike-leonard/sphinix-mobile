import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

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
