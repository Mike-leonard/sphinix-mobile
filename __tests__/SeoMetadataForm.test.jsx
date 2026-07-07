import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SeoMetadataForm from '@/app/dashboard/settings/seo-metadata/_components/SeoMetadataForm';
import * as settingsActions from '@/actions/settings';

// Mock the settings action
vi.mock('@/actions/settings', () => ({
  updateSettings: vi.fn(),
}));

const mockInitialSettings = {
  seo: {
    advanced: {
      generateSitemap: false,
      robotsTxt: "User-agent: *\nAllow: /",
      globalStructuredData: ""
    },
    home: {
      title: "Test Title",
      description: "Test Desc",
      keywords: "test, keywords",
      structuredData: ""
    },
    devices: {},
    blogs: {},
    comparisons: {}
  }
};

describe('SeoMetadataForm Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the main tabs including Advanced SEO', () => {
    render(<SeoMetadataForm initialSettings={mockInitialSettings} />);
    
    expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Advanced SEO/i })).toBeInTheDocument();
  });

  it('renders Keywords input in the General tab', () => {
    render(<SeoMetadataForm initialSettings={mockInitialSettings} />);
    
    // By default, it's on Home -> General
    const keywordsInput = screen.getByPlaceholderText(/comma separated/i);
    expect(keywordsInput).toBeInTheDocument();
    expect(keywordsInput).toHaveValue("test, keywords");
  });

  it('switches to the Advanced SEO tab and displays Sitemap and Robots.txt fields', () => {
    render(<SeoMetadataForm initialSettings={mockInitialSettings} />);
    
    const advancedTab = screen.getByRole('button', { name: /Advanced SEO/i });
    fireEvent.click(advancedTab);

    // Advanced specific fields should now be visible
    expect(screen.getByText(/Enable Dynamic Sitemap Generation/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/User-agent:/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/{ "@context": "https:\/\/schema.org"/i)).toBeInTheDocument();

    // General fields should be hidden
    expect(screen.queryByPlaceholderText(/e.g. Sphinix Mobile \| Expert Reviews/i)).not.toBeInTheDocument();
  });

  it('calls updateSettings with modified keywords when Save is clicked', async () => {
    vi.spyOn(settingsActions, 'updateSettings').mockResolvedValue({ success: true });
    
    render(<SeoMetadataForm initialSettings={mockInitialSettings} />);
    
    const keywordsInput = screen.getByPlaceholderText(/comma separated/i);
    fireEvent.change(keywordsInput, { target: { value: 'new, test, keywords' } });
    
    const saveButton = screen.getByRole('button', { name: /Save Settings/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(settingsActions.updateSettings).toHaveBeenCalled();
      const calledArg = settingsActions.updateSettings.mock.calls[0][0];
      expect(calledArg.seo.home.keywords).toBe('new, test, keywords');
    });
  });
});
