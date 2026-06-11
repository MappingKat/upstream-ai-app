import { render, screen } from '@/test/test-utils';
import { TrendsStrip } from '@/components/home/TrendsStrip';

describe('TrendsStrip', () => {
  it('renders all 4 trend stat cards in "all" mode', () => {
    render(<TrendsStrip />);
    expect(screen.getByText('On track YTD')).toBeInTheDocument();
    expect(screen.getByText('Due in 30 days')).toBeInTheDocument();
    expect(screen.getByText('Open data gaps')).toBeInTheDocument();
    expect(screen.getByText('Cl₂ residual trend')).toBeInTheDocument();
  });

  it('renders stat values', () => {
    render(<TrendsStrip />);
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('0.82')).toBeInTheDocument();
  });

  it('renders delta indicators', () => {
    render(<TrendsStrip />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('flat')).toBeInTheDocument();
    expect(screen.getByText('↑ 2')).toBeInTheDocument();
    expect(screen.getByText('−14%')).toBeInTheDocument();
  });

  it('renders note descriptions', () => {
    render(<TrendsStrip />);
    expect(screen.getByText(/All Q1 MOR/)).toBeInTheDocument();
    expect(screen.getByText(/March MOR · March DMR/)).toBeInTheDocument();
  });

  it('renders units', () => {
    render(<TrendsStrip />);
    expect(screen.getByText('/ 7 filings')).toBeInTheDocument();
    expect(screen.getByText('reports')).toBeInTheDocument();
    expect(screen.getByText('Cl₂ readings')).toBeInTheDocument();
    expect(screen.getByText('mg/L min')).toBeInTheDocument();
  });
});
