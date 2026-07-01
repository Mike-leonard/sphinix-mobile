import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import { CompareProvider, useCompare } from '@/context/CompareContext';
import React from 'react';

// Test Component to consume context
function TestComponent() {
  const { compareList, isCompareOpen, handleToggleCompare, clearCompare } = useCompare();

  return (
    <div>
      <span data-testid="count">{compareList.length}</span>
      <span data-testid="is-open">{isCompareOpen.toString()}</span>
      
      <button 
        data-testid="add-1" 
        onClick={() => handleToggleCompare({ id: 1, name: 'Phone 1' })}
      >Add 1</button>
      <button 
        data-testid="add-2" 
        onClick={() => handleToggleCompare({ id: 2, name: 'Phone 2' })}
      >Add 2</button>
      <button 
        data-testid="add-3" 
        onClick={() => handleToggleCompare({ id: 3, name: 'Phone 3' })}
      >Add 3</button>
      <button 
        data-testid="add-4" 
        onClick={() => handleToggleCompare({ id: 4, name: 'Phone 4' })}
      >Add 4</button>
      <button 
        data-testid="clear" 
        onClick={clearCompare}
      >Clear</button>
    </div>
  );
}

describe('CompareContext', () => {
  test('adds devices to compare list correctly', () => {
    render(
      <CompareProvider>
        <TestComponent />
      </CompareProvider>
    );

    expect(screen.getByTestId('count').textContent).toBe('0');
    
    fireEvent.click(screen.getByTestId('add-1'));
    expect(screen.getByTestId('count').textContent).toBe('1');
    
    // Removing the same item
    fireEvent.click(screen.getByTestId('add-1'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  test('prevents adding more than 3 devices', () => {
    // Mock window.alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(
      <CompareProvider>
        <TestComponent />
      </CompareProvider>
    );

    fireEvent.click(screen.getByTestId('add-1'));
    fireEvent.click(screen.getByTestId('add-2'));
    fireEvent.click(screen.getByTestId('add-3'));
    
    expect(screen.getByTestId('count').textContent).toBe('3');
    
    // Try to add a 4th
    fireEvent.click(screen.getByTestId('add-4'));
    
    expect(alertMock).toHaveBeenCalledWith('You can only compare up to 3 devices at a time.');
    expect(screen.getByTestId('count').textContent).toBe('3'); // Still 3
    
    alertMock.mockRestore();
  });

  test('clears compare list', () => {
    render(
      <CompareProvider>
        <TestComponent />
      </CompareProvider>
    );

    fireEvent.click(screen.getByTestId('add-1'));
    fireEvent.click(screen.getByTestId('add-2'));
    expect(screen.getByTestId('count').textContent).toBe('2');

    fireEvent.click(screen.getByTestId('clear'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });
});
