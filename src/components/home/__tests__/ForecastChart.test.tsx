import { render, screen } from '@/test/test-utils';
import { ForecastChart } from '@/components/home/ForecastChart';

describe('ForecastChart', () => {
  it('renders the chart title', () => {
    render(<ForecastChart />);
    expect(screen.getByText(/6-month trend \+ 8-week forecast/)).toBeInTheDocument();
  });

  it('renders the predictive badge', () => {
    render(<ForecastChart />);
    expect(screen.getByText(/Predictive/)).toBeInTheDocument();
  });

  it('renders the subtitle with date range', () => {
    render(<ForecastChart />);
    expect(screen.getByText(/Oct 2025 — May 2026/)).toBeInTheDocument();
  });

  it('renders the work order action button', () => {
    render(<ForecastChart />);
    expect(screen.getByText(/Create work order/)).toBeInTheDocument();
  });

  it('renders the SVG chart element', () => {
    const { container } = render(<ForecastChart />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 720 160');
  });

  it('renders violation callout', () => {
    render(<ForecastChart />);
    expect(screen.getByText(/Predicted permit violation/)).toBeInTheDocument();
    expect(screen.getByText(/Apr 19–24, 2026/)).toBeInTheDocument();
  });

  it('renders the recommended action', () => {
    render(<ForecastChart />);
    expect(screen.getByText(/chlorinator feed-pump inspection/)).toBeInTheDocument();
  });

  it('renders legend items for all modes', () => {
    // In "all" mode (default), all legend items should be visible
    render(<ForecastChart />);
    expect(screen.getByText(/Cl₂ \(DW\)/)).toBeInTheDocument();
    expect(screen.getByText(/BOD₅ \(WW\)/)).toBeInTheDocument();
    expect(screen.getByText(/TSS \(WW\)/)).toBeInTheDocument();
    expect(screen.getByText(/TDS \(DW\)/)).toBeInTheDocument();
  });

  it('renders confidence band legend', () => {
    render(<ForecastChart />);
    expect(screen.getByText('━ Actual')).toBeInTheDocument();
    expect(screen.getByText('▒ 80% confidence band')).toBeInTheDocument();
  });
});
