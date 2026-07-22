import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import { Search } from '@/components/Search';
import React from 'react';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('Search Component', () => {
  test('renders search input', () => {
    render(<Search searchQuery="" setSearchQuery={() => {}} selectedCategory="All" setSelectedCategory={() => {}} />);
    expect(screen.getByPlaceholderText(/Search model, brand/i)).toBeInTheDocument();
  });

  test('opens autocomplete dropdown when typing', async () => {
    const setSearchQuery = vi.fn();
    render(<Search searchQuery="" setSearchQuery={setSearchQuery} selectedCategory="All Types" setSelectedCategory={() => {}} />);
    
    const input = screen.getByPlaceholderText(/Search model, brand/i);
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Galaxy' } });
    
    // Check if the mock callback was fired
    expect(setSearchQuery).toHaveBeenCalledWith('Galaxy');
  });

  test('changes active scope when scope buttons are clicked', () => {
    render(<Search searchQuery="iPhone" setSearchQuery={() => {}} selectedCategory="All Types" setSelectedCategory={() => {}} />);
    
    const phonesBadge = screen.getByText('Phones');
    fireEvent.click(phonesBadge);
    
    // Phones badge should be styled as active (default variant has bg-brand-600)
    expect(phonesBadge).toHaveClass('bg-brand-600');
  });
});
