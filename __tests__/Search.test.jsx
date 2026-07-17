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

  test('changes active scope when scope buttons are clicked', async () => {
    render(<Search searchQuery="Galaxy" setSearchQuery={() => {}} selectedCategory="All Types" setSelectedCategory={() => {}} />);
    
    // Ensure "Phones" scope button exists
    const devicesBtn = screen.getByText('Phones');
    expect(devicesBtn).toBeInTheDocument();
    
    fireEvent.click(devicesBtn);
    
    // Active scope should be updated (visual change or class change usually)
    // Here we can check if it has the active class (bg-brand-600)
    expect(devicesBtn.className).toMatch(/bg-brand-600/);
  });
});
