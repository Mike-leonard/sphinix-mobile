import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ComparisonsPage from '@/app/(main)/comparisons/page';
import * as CompareContext from '@/context/CompareContext';

// Mock child components to isolate the page logic
vi.mock('@/app/(main)/comparisons/_components/EmptyState', () => ({
  default: () => <div data-testid="empty-state">Empty</div>
}));
vi.mock('@/app/(main)/comparisons/_components/ComparisonHeader', () => ({
  default: () => <div data-testid="comparison-header">Header</div>
}));
vi.mock('@/app/(main)/comparisons/_components/ComparisonBody', () => ({
  default: () => <div data-testid="comparison-body">Body</div>
}));
vi.mock('@/app/(main)/comparisons/_components/ComparisonBreadcrumb', () => ({
  default: ({ title }) => <div data-testid="comparison-breadcrumb">{title}</div>
}));
vi.mock('@/components/sidebar/RightSidebar', () => ({
  default: () => <div data-testid="right-sidebar">Sidebar</div>
}));

describe('ComparisonsPage', () => {
  it('renders EmptyState when compareList is empty', () => {
    vi.spyOn(CompareContext, 'useCompare').mockReturnValue({
      compareList: [],
      handleToggleCompare: vi.fn()
    });

    render(<ComparisonsPage />);
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.queryByTestId('comparison-header')).not.toBeInTheDocument();
  });

  it('renders page layout with components when compareList has items', () => {
    const mockList = [
      { id: "1", name: "Phone A" },
      { id: "2", name: "Phone B" }
    ];

    vi.spyOn(CompareContext, 'useCompare').mockReturnValue({
      compareList: mockList,
      handleToggleCompare: vi.fn()
    });

    render(<ComparisonsPage />);
    
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    expect(screen.getByTestId('comparison-header')).toBeInTheDocument();
    expect(screen.getByTestId('comparison-body')).toBeInTheDocument();
    expect(screen.getByTestId('comparison-breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('right-sidebar')).toBeInTheDocument();
    
    // Breadcrumb should have dynamic title
    expect(screen.getByTestId('comparison-breadcrumb')).toHaveTextContent('Phone A vs Phone B');
  });
});
