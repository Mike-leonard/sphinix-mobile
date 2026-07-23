import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import { Search } from '@/components/Search';
import React from 'react';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock server actions
vi.mock('@/actions/devices', () => ({
  publishedDevices: vi.fn().mockResolvedValue([
    { id: '1', name: 'Galaxy S24', brand: 'Samsung', slug: 'galaxy-s24' }
  ])
}));

vi.mock('@/actions/blogs', () => ({
  publishedBlogs: vi.fn().mockResolvedValue([])
}));

describe('Search Component', () => {
  test('renders search input', () => {
    render(<Search searchQuery="" setSearchQuery={() => {}} selectedCategory="All" setSelectedCategory={() => {}} />);
    expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
  });

  test('opens autocomplete dropdown when typing', async () => {
    const setSearchQuery = vi.fn();
    render(<Search searchQuery="" setSearchQuery={setSearchQuery} selectedCategory="All Types" setSelectedCategory={() => {}} />);
    
    const input = screen.getByPlaceholderText(/Search/i);
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Galaxy' } });
    
    expect(setSearchQuery).toHaveBeenCalledWith('Galaxy');
  });

  test('changes active scope when scope buttons are clicked', () => {
    render(<Search searchQuery="iPhone" setSearchQuery={() => {}} selectedCategory="All Types" setSelectedCategory={() => {}} />);
    
    const phonesBadge = screen.getByText('Phones');
    fireEvent.click(phonesBadge);
    
    expect(phonesBadge).toHaveClass('bg-brand-600');
  });
});
