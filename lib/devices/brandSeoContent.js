/**
 * Unique SEO H1 headings, intro descriptions, and series keywords for brand hub pages.
 * Tailored for search intent and distinct keyword targeting per manufacturer.
 */
export const BRAND_SEO_CONTENT = {
  samsung: {
    h1: 'Samsung Phones',
    intro: 'Explore Samsung smartphones, specifications, prices, cameras, displays, processors, and more. Browse the full Galaxy S, Z Fold, Z Flip, and A series lineup.',
    series: ['Galaxy S', 'Z Fold', 'Z Flip', 'Galaxy A']
  },
  apple: {
    h1: 'Apple iPhone Specifications',
    intro: 'Browse detailed specifications, prices, and camera details for every iPhone model — from the latest iPhone Pro Max to older generations, all in one place.',
    series: ['iPhone Pro Max', 'iPhone Pro', 'iPhone Plus', 'iPhone']
  },
  asus: {
    h1: 'Asus Phones',
    intro: 'Check out Asus smartphone specifications, including the ROG Phone gaming series and Zenfone lineup — display, chipset, battery, and pricing details.',
    series: ['ROG Phone', 'Zenfone']
  },
  google: {
    h1: 'Google Pixel Phones',
    intro: 'Discover Google Pixel specifications, prices, and camera performance — covering the Pixel Pro, standard, and budget "a" series models.',
    series: ['Pixel Pro', 'Pixel', 'Pixel a-series']
  },
  honor: {
    h1: 'Honor Phones',
    intro: 'Explore Honor smartphone specifications and prices, including flagship and mid-range models with detailed display, camera, and battery breakdowns.',
    series: ['Magic', 'Number series', 'X series']
  },
  huawei: {
    h1: 'Huawei Phones',
    intro: 'Find complete Huawei smartphone specifications, including the Mate and P series — chipset, camera system, display, and pricing details.',
    series: ['Mate', 'P series', 'Nova']
  },
  lg: {
    h1: 'LG Phones',
    intro: 'Browse LG smartphone specifications and pricing, with full details on display, camera, and hardware across LG\'s released device lineup.',
    series: ['Velvet', 'Wing', 'G series', 'V series']
  },
  motorola: {
    h1: 'Motorola Phones',
    intro: 'Explore Motorola smartphone specifications, including the Razr foldable series and Edge lineup — display, camera, battery, and price details.',
    series: ['Razr', 'Edge', 'Moto G']
  },
  nothing: {
    h1: 'Nothing Phones',
    intro: 'Check out Nothing Phone specifications and pricing, featuring the brand\'s distinctive Glyph interface, display, camera, and performance details.',
    series: ['Phone (1)', 'Phone (2)', 'Phone (2a)']
  },
  oneplus: {
    h1: 'OnePlus Phones',
    intro: 'Discover OnePlus smartphone specifications and prices, including flagship and Nord series models — battery, camera, display, and chipset details.',
    series: ['OnePlus Flagship', 'Nord series', 'Open']
  },
  oppo: {
    h1: 'Oppo Phones',
    intro: 'Browse Oppo smartphone specifications, including the Find and Reno series — full details on camera, display, battery life, and pricing.',
    series: ['Find', 'Reno', 'A series']
  },
  realme: {
    h1: 'Realme Phones',
    intro: 'Explore Realme smartphone specifications and prices, covering the GT and Number series with detailed camera, display, and performance breakdowns.',
    series: ['GT series', 'Number series', 'C series']
  },
  sony: {
    h1: 'Sony Xperia Phones',
    intro: 'Find Sony Xperia specifications and pricing, including camera, display, and hardware details across the Xperia lineup.',
    series: ['Xperia 1', 'Xperia 5', 'Xperia 10']
  },
  vivo: {
    h1: 'Vivo Phones',
    intro: 'Browse Vivo smartphone specifications and prices, including the X and V series — camera, display, battery, and chipset details in full.',
    series: ['X series', 'V series', 'Y series']
  },
  xiaomi: {
    h1: 'Xiaomi Phones',
    intro: 'Explore Xiaomi smartphone specifications and prices, covering the numbered series, POCO, Redmi, and Ultra models — camera, display, and battery details.',
    series: ['Xiaomi Ultra', 'POCO', 'Redmi', 'Numbered series']
  }
};

/**
 * Retrieves brand-specific SEO H1 heading and intro copy, falling back to a structured template
 * for any custom brand added dynamically to the database.
 * 
 * @param {string} brandNameOrSlug - Brand name or slug (e.g. "samsung", "Samsung", "google-pixel").
 * @returns {{ h1: string, intro: string, series?: string[] }}
 */
export function getBrandSeoContent(brandNameOrSlug) {
  if (!brandNameOrSlug) {
    return {
      h1: 'Smartphones & Mobile Specifications',
      intro: 'Explore latest smartphones with detailed technical specifications, reviews, prices, and comparisons on Sphinix Mobile.',
      series: []
    };
  }

  const normalized = String(brandNameOrSlug).toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const entry = BRAND_SEO_CONTENT[normalized];

  if (entry) {
    return entry;
  }

  const cleanName = String(brandNameOrSlug).trim();
  return {
    h1: `${cleanName} Phones`,
    intro: `Explore all latest ${cleanName} smartphones with detailed technical specifications, prices, camera capabilities, battery endurance, and expert comparisons on Sphinix Mobile.`,
    series: []
  };
}
