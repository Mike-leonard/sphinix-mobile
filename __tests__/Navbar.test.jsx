import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '../components/Navbar';
import * as CompareContext from '@/context/CompareContext';

// Mock next/navigation and next-themes since we are testing outside Next.js
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));
vi.mock('@teispace/next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the navbar links', () => {
    vi.spyOn(CompareContext, 'useCompare').mockReturnValue({
      compareList: [],
      setIsCompareOpen: vi.fn()
    });
    
    render(<Navbar />);
    expect(screen.getAllByText('Home')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Devices')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Comparisons')[0]).toBeInTheDocument();
  });

  it('displays the compare count bubble when compareCount > 0', () => {
    vi.spyOn(CompareContext, 'useCompare').mockReturnValue({
      compareList: [{}, {}], // length 2
      setIsCompareOpen: vi.fn()
    });

    render(<Navbar />);
    // The number 2 should be displayed in the badge
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('does not display the compare count bubble when compareCount is 0', () => {
    vi.spyOn(CompareContext, 'useCompare').mockReturnValue({
      compareList: [],
      setIsCompareOpen: vi.fn()
    });

    render(<Navbar />);
    // "0" shouldn't be rendered anywhere in the compare button
    const compareButtons = screen.getAllByRole('button', { name: /Compare/i });
    expect(compareButtons[0]).not.toHaveTextContent('0');
  });

  it('calls setIsCompareOpen when the Compare button is clicked', () => {
    const setIsCompareOpenMock = vi.fn();
    vi.spyOn(CompareContext, 'useCompare').mockReturnValue({
      compareList: [{}], // length 1
      setIsCompareOpen: setIsCompareOpenMock
    });

    render(<Navbar />);
    
    const compareButtons = screen.getAllByRole('button', { name: /Compare/i });
    fireEvent.click(compareButtons[0]);
    
    expect(setIsCompareOpenMock).toHaveBeenCalledWith(true);
  });
});
