export const defaultTypography = {
  h1Size: {
    "Global Default": "2.25rem",
    "Hero Section": "3rem",
    "Dashboard Headers": "1.875rem",
    "Auth Pages": "1.5rem",
    "Device Details": "1.875rem",
    "Blogs Header": "1.875rem",
    "Comparisons Header": "1.125rem"
  },
  h2Size: {
    "Global Default": "1.875rem",
    "Section Headers": "1.875rem",
    "Card Titles": "1.25rem",
    "Settings & Forms": "1.5rem",
    "Modal & Drawer Titles": "1.5rem"
  },
  h3Size: {
    "Global Default": "1.5rem",
    "Section Headers": "1.5rem",
    "Card Titles": "1.125rem",
    "Settings & Forms": "1.25rem",
    "Modal & Drawer Titles": "1.25rem"
  },
  pSize: {
    "Global Default": "1rem",
    "Section Subtitles": "0.875rem",
    "Card Descriptions": "0.875rem",
    "Form Text": "0.875rem",
    "Footer Text": "0.875rem"
  },
  navSize: "0.875rem",
  buttonSize: {
    "Global Default": "0.875rem",
    "Primary Actions": "1rem",
    "Secondary Actions": "0.875rem",
    "Sidebar & Nav Items": "0.875rem"
  },
  linkSize: {
    "Global Default": "1rem",
    "Navigation Links": "0.875rem",
    "Footer Links": "0.875rem",
    "Inline Links": "1rem"
  }
};

export const POSITIONS = {
  h1Size: Object.keys(defaultTypography.h1Size),
  h2Size: Object.keys(defaultTypography.h2Size),
  h3Size: Object.keys(defaultTypography.h3Size),
  pSize: Object.keys(defaultTypography.pSize),
  buttonSize: Object.keys(defaultTypography.buttonSize),
  linkSize: Object.keys(defaultTypography.linkSize)
};
