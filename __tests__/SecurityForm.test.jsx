import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SecurityForm from '@/app/dashboard/settings/security/_components/SecurityForm';
import { updateSettings } from '@/actions/settings';

// Mock server actions
vi.mock('@/actions/settings', () => ({
  updateSettings: vi.fn().mockResolvedValue({ success: true })
}));

vi.mock('@/actions/backup', () => ({
  createBackup: vi.fn().mockResolvedValue({ success: true }),
  restoreBackup: vi.fn().mockResolvedValue({ success: true })
}));

const mockInitialSettings = {
  security: {
    maxRequests: 100,
    timeWindow: 15,
    ipBlacklist: []
  },
  ai: {
    enableAiFeatures: true,
    apiKey: '',
    model: 'gpt-4',
    temperature: 0.7
  },
  recaptcha: {
    enabled: false,
    siteKey: '',
    secretKey: ''
  },
  backups: {
    automatic: false,
    schedule: 'weekly'
  }
};

describe('SecurityForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the 4 main security tabs', () => {
    render(<SecurityForm initialSettings={mockInitialSettings} />);
    
    expect(screen.getByText('Access & IPs')).toBeInTheDocument();
    expect(screen.getByText('AI Configuration')).toBeInTheDocument();
    expect(screen.getByText('reCAPTCHA')).toBeInTheDocument();
    expect(screen.getByText('Backups')).toBeInTheDocument();
  });

  it('displays the Access & IPs tab content by default', () => {
    render(<SecurityForm initialSettings={mockInitialSettings} />);
    
    expect(screen.getByText('Enable API Rate Limiting')).toBeInTheDocument();
  });

  it('switches to the AI Configuration tab when clicked', async () => {
    render(<SecurityForm initialSettings={mockInitialSettings} />);
    
    const aiTab = screen.getByText('AI Configuration');
    fireEvent.click(aiTab);
    
    expect(screen.getByText('Enable AI Features globally')).toBeInTheDocument();
    expect(screen.getByText('AI Model')).toBeInTheDocument();
  });

  it('calls updateSettings when Save Changes is clicked', async () => {
    render(<SecurityForm initialSettings={mockInitialSettings} />);
    
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(updateSettings).toHaveBeenCalledTimes(1);
    });
  });
});
