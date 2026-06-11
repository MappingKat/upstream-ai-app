import { render, screen } from '@/test/test-utils';
import { StateFormCard } from '@/components/home/StateFormCard';

describe('StateFormCard', () => {
  it('renders the one-click compliance eyebrow', () => {
    render(<StateFormCard />);
    expect(screen.getByText(/One-click compliance/)).toBeInTheDocument();
  });

  it('renders the DMR title with CDPHE', () => {
    render(<StateFormCard />);
    expect(screen.getByText(/March DMR/)).toBeInTheDocument();
    const cdpheElements = screen.getAllByText('CDPHE');
    expect(cdpheElements.length).toBeGreaterThan(0);
  });

  it('shows field completion status', () => {
    render(<StateFormCard />);
    expect(screen.getByText(/26 \/ 28 fields complete/)).toBeInTheDocument();
  });

  it('shows gap status indicator', () => {
    render(<StateFormCard />);
    expect(screen.getByText(/2 gaps remaining/)).toBeInTheDocument();
  });

  it('renders review form button linking to DMR prep', () => {
    render(<StateFormCard />);
    const link = screen.getByText(/Review filled form/).closest('a');
    expect(link).toHaveAttribute('href', '/dmr-prep');
  });

  it('renders submit to NetDMR button', () => {
    render(<StateFormCard />);
    expect(screen.getByText(/Submit to NetDMR/)).toBeInTheDocument();
  });

  it('renders download Excel link', () => {
    render(<StateFormCard />);
    expect(screen.getByText(/Download Excel/)).toBeInTheDocument();
  });

  it('renders form preview thumbnail', () => {
    render(<StateFormCard />);
    expect(screen.getByText(/Form preview/)).toBeInTheDocument();
    expect(screen.getByText(/2 gaps · 26 of 28 filled/)).toBeInTheDocument();
  });
});
