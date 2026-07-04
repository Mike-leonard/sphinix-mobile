import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ComparisonHeader from '@/app/(main)/comparisons/_components/ComparisonHeader';

const mockCompareList = [
  {
    id: "device-1",
    name: "Phone One",
    price: "$999"
  },
  {
    id: "device-2",
    name: "Phone Two",
    price: "$799"
  }
];

describe('ComparisonHeader Component', () => {
  it('renders device names and prices correctly', () => {
    render(
      <ComparisonHeader 
        compareList={mockCompareList} 
        gridColsClass="grid-cols-3" 
        handleToggleCompare={vi.fn()} 
      />
    );
    
    // Check if device names are rendered
    expect(screen.getByText('Phone One')).toBeInTheDocument();
    expect(screen.getByText('Phone Two')).toBeInTheDocument();
    
    // Check if prices are rendered
    expect(screen.getByText('$999')).toBeInTheDocument();
    expect(screen.getByText('$799')).toBeInTheDocument();
  });

  it('calls handleToggleCompare when remove button is clicked', () => {
    const handleToggleCompareMock = vi.fn();
    render(
      <ComparisonHeader 
        compareList={mockCompareList} 
        gridColsClass="grid-cols-3" 
        handleToggleCompare={handleToggleCompareMock} 
      />
    );
    
    // Get all remove buttons
    const removeButtons = screen.getAllByRole('button');
    
    // Click the first remove button
    fireEvent.click(removeButtons[0]);
    
    // Verify it was called with the correct device
    expect(handleToggleCompareMock).toHaveBeenCalledWith(mockCompareList[0]);
  });
});
