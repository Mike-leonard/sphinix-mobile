import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import CompareDrawer from '@/components/CompareDrawer';
import { CompareProvider, useCompare } from '@/context/CompareContext';
import React, { useEffect } from 'react';

// A mock device
const mockDevice = {
  id: "1",
  brand: "TestBrand",
  name: "Test Phone",
  price: "$999",
  specs: {
    screen: "6.1 inch",
    chipset: "Snapdragon",
    camera: "12MP",
    battery: "4000mAh",
    ram: "8GB",
    storage: "128GB"
  }
};

// Helper component to inject state for testing
function TestWrapper({ children }) {
  const { handleToggleCompare } = useCompare();
  
  useEffect(() => {
    handleToggleCompare(mockDevice);
  }, []);

  return children;
}

describe('CompareDrawer', () => {
  test('renders nothing when compareList is empty', () => {
    const { container } = render(
      <CompareProvider>
        <CompareDrawer />
      </CompareProvider>
    );
    // Since list is empty, component returns null
    expect(container.firstChild).toBeNull();
  });

  test('renders drawer correctly when items exist', () => {
    render(
      <CompareProvider>
        <TestWrapper>
          <CompareDrawer />
        </TestWrapper>
      </CompareProvider>
    );
    
    // The drawer is closed by default, but the floating trigger should be visible
    expect(screen.getByText('Compare List')).toBeInTheDocument();
    // Badge count should be 1
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('opens drawer when Compare List button is clicked', () => {
    render(
      <CompareProvider>
        <TestWrapper>
          <CompareDrawer />
        </TestWrapper>
      </CompareProvider>
    );

    // Mock alert for <2 items
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const compareBtn = screen.getByText('Compare List');
    fireEvent.click(compareBtn);

    // Because only 1 item is added, it triggers alert
    expect(alertMock).toHaveBeenCalledWith('Please select at least 2 devices to compare.');
    alertMock.mockRestore();
  });

  test('clear button on floating trigger resets list', () => {
    render(
      <CompareProvider>
        <TestWrapper>
          <CompareDrawer />
        </TestWrapper>
      </CompareProvider>
    );

    // The clear (X) button is right next to the Compare List button
    const clearBtn = screen.getByTitle('Clear Compare List');
    fireEvent.click(clearBtn);

    // After clearing, the Compare Drawer should return null, hiding the Compare List button
    expect(screen.queryByText('Compare List')).not.toBeInTheDocument();
  });
});
