import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../components/Navbar';

// Mock next/navigation and next-themes since we are testing outside Next.js
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

describe('Navbar Component', () => {
  it('renders the navbar links', () => {
    render(<Navbar compareCount={0} onOpenCompare={vi.fn()} />);
    expect(screen.getAllByText('Home')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Devices')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Comparisons')[0]).toBeInTheDocument();
  });

  it('displays the compare count bubble when compareCount > 0', () => {
    render(<Navbar compareCount={2} onOpenCompare={vi.fn()} />);
    // The number 2 should be displayed in the badge
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('does not display the compare count bubble when compareCount is 0', () => {
    render(<Navbar compareCount={0} onOpenCompare={vi.fn()} />);
    // "0" shouldn't be rendered anywhere in the compare button
    const compareButtons = screen.getAllByRole('button', { name: /Compare/i });
    expect(compareButtons[0]).not.toHaveTextContent('0');
  });

  it('calls onOpenCompare when the Compare button is clicked', () => {
    const handleOpenCompare = vi.fn();
    render(<Navbar compareCount={1} onOpenCompare={handleOpenCompare} />);
    
    const compareButtons = screen.getAllByRole('button', { name: /Compare/i });
    fireEvent.click(compareButtons[0]);
    
    expect(handleOpenCompare).toHaveBeenCalledTimes(1);
  });
});
