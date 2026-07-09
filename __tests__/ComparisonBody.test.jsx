import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ComparisonBody from '@/app/(main)/comparisons/_components/ComparisonBody';
import { SettingsProvider } from '@/context/SettingsContext';

const mockSettings = {
  typography: {
    fontSizes: {
      body: '16px'
    }
  }
};

// We only provide a few categories to keep the test simple
const mockCompareList = [
  {
    id: "device-1",
    specs: {
      generalSpecs: [
        { label: "OS", value: "Android 14" },
        { label: "Weight", value: "200g" },
        { label: "Waterproof", value: true }
      ]
    }
  },
  {
    id: "device-2",
    specs: {
      generalSpecs: [
        { label: "OS", value: "iOS 17" },
        { label: "Weight", value: "180g" },
        { label: "Waterproof", value: false }
      ]
    }
  }
];

describe('ComparisonBody Component', () => {
  it('renders correctly with string and boolean specifications', () => {
    const { container } = render(
      <SettingsProvider settings={mockSettings}>
        <ComparisonBody 
          compareList={mockCompareList} 
          gridColsClass="grid-cols-3" 
        />
      </SettingsProvider>
    );
    
    // Check if category title is rendered
    expect(screen.getByText('General')).toBeInTheDocument();
    
    // Check if labels are rendered
    expect(screen.getByText('OS')).toBeInTheDocument();
    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText('Waterproof')).toBeInTheDocument();
    
    // Check if string values are rendered
    expect(screen.getByText('Android 14')).toBeInTheDocument();
    expect(screen.getByText('iOS 17')).toBeInTheDocument();
    expect(screen.getByText('200g')).toBeInTheDocument();
    expect(screen.getByText('180g')).toBeInTheDocument();

    // The BoolIcon renders SVGs for booleans.
    // We can count the icons by querying the SVG elements directly or assuming they rendered.
    const svgElements = container.querySelectorAll('svg');
    // 1 for icon in header, + 2 for waterproof true/false
    expect(svgElements.length).toBeGreaterThan(0);
  });
  
  it('does not render categories if there are no specs', () => {
    const emptyList = [
      { id: "device-1", specs: {} },
      { id: "device-2", specs: {} }
    ];
    
    render(
      <SettingsProvider settings={mockSettings}>
        <ComparisonBody 
          compareList={emptyList} 
          gridColsClass="grid-cols-3" 
        />
      </SettingsProvider>
    );
    
    // None of the categories should render if there are no specs
    expect(screen.queryByText('General')).not.toBeInTheDocument();
    expect(screen.queryByText('Display')).not.toBeInTheDocument();
  });
});
