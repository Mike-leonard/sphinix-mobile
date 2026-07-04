import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ComparisonBreadcrumb from '@/app/(main)/comparisons/_components/ComparisonBreadcrumb';

describe('ComparisonBreadcrumb Component', () => {
  it('renders the title text correctly', () => {
    const title = 'OnePlus 12 vs Galaxy S24';
    render(<ComparisonBreadcrumb title={title} />);
    
    // Check if the title text is displayed
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('renders the Comparison Mode badge', () => {
    render(<ComparisonBreadcrumb title="Test" />);
    
    // Check if the static badge is displayed
    expect(screen.getByText('Comparison Mode')).toBeInTheDocument();
  });
});
