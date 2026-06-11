import { render, screen } from '@/test/test-utils';
import { IntegrationsStrip } from '@/components/home/IntegrationsStrip';

describe('IntegrationsStrip', () => {
  it('renders the header title', () => {
    render(<IntegrationsStrip />);
    expect(screen.getByText(/Live data/)).toBeInTheDocument();
  });

  it('renders the attention badge', () => {
    render(<IntegrationsStrip />);
    expect(screen.getByText(/1 needs attention/)).toBeInTheDocument();
  });

  it('renders all 5 integration names', () => {
    render(<IntegrationsStrip />);
    expect(screen.getByText('SCADA')).toBeInTheDocument();
    expect(screen.getByText('Lab inbox (CAL)')).toBeInTheDocument();
    expect(screen.getByText('CDPHE portal')).toBeInTheDocument();
    expect(screen.getByText('NetDMR')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('shows SCADA as healthy and streaming', () => {
    render(<IntegrationsStrip />);
    expect(screen.getByText('Healthy · streaming')).toBeInTheDocument();
  });

  it('shows Lab inbox as slow with pending items', () => {
    render(<IntegrationsStrip />);
    expect(screen.getByText('Slow · 2 pending')).toBeInTheDocument();
  });

  it('renders status metadata', () => {
    render(<IntegrationsStrip />);
    expect(screen.getByText(/Last sync: 0:02 ago/)).toBeInTheDocument();
    expect(screen.getByText(/8,928 points \/ day/)).toBeInTheDocument();
  });

  it('renders footer with summary counts', () => {
    render(<IntegrationsStrip />);
    expect(screen.getByText(/1 system slow · 4 healthy · 0 down/)).toBeInTheDocument();
  });

  it('renders link to integrations page', () => {
    render(<IntegrationsStrip />);
    const link = screen.getByText(/View all integrations/).closest('a');
    expect(link).toHaveAttribute('href', '/integrations');
  });
});
