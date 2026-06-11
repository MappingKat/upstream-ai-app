import { render, screen } from '@/test/test-utils';
import { Timeline } from '@/components/home/Timeline';

describe('Timeline', () => {
  it('renders the "Coming up" title', () => {
    render(<Timeline />);
    expect(screen.getByText('Coming up')).toBeInTheDocument();
  });

  it('renders the calendar link', () => {
    render(<Timeline />);
    const link = screen.getByText('View full calendar →').closest('a');
    expect(link).toHaveAttribute('href', '/calendar');
  });

  it('renders all three timeline sections', () => {
    render(<Timeline />);
    expect(screen.getByText('This week')).toBeInTheDocument();
    expect(screen.getByText('Next 30 days')).toBeInTheDocument();
    expect(screen.getByText('Future')).toBeInTheDocument();
  });

  it('renders timeline items in "all" mode', () => {
    render(<Timeline />);
    // DW items
    expect(screen.getByText('March MOR — Drinking Water')).toBeInTheDocument();
    expect(screen.getByText('Q1 Disinfection Byproducts')).toBeInTheDocument();
    expect(screen.getByText('Consumer Confidence Report (CCR)')).toBeInTheDocument();
    // WW items
    expect(screen.getByText(/BOD₅ \+ TSS sample pickup/)).toBeInTheDocument();
    expect(screen.getByText('March DMR — Wastewater')).toBeInTheDocument();
    expect(screen.getByText(/Operator certification renewal/)).toBeInTheDocument();
  });

  it('renders date numbers', () => {
    render(<Timeline />);
    expect(screen.getByText('10')).toBeInTheDocument(); // Apr 10
    expect(screen.getByText('8')).toBeInTheDocument();  // Apr 8
    expect(screen.getByText('28')).toBeInTheDocument(); // Apr 28
  });

  it('renders tags on timeline items', () => {
    render(<Timeline />);
    expect(screen.getByText('7 days')).toBeInTheDocument();
    expect(screen.getByText('2 gaps')).toBeInTheDocument();
    expect(screen.getByText('annual')).toBeInTheDocument();
    expect(screen.getByText('cert')).toBeInTheDocument();
  });

  it('renders subtitles with context info', () => {
    render(<Timeline />);
    expect(screen.getByText(/CDPHE · wqcdcompliance\.com/)).toBeInTheDocument();
    expect(screen.getByText(/Colorado Analytical · scheduled 8:00 AM/)).toBeInTheDocument();
  });
});
