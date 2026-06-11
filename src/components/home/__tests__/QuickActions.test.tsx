import { render, screen } from '@/test/test-utils';
import { QuickActions } from '@/components/home/QuickActions';

describe('QuickActions', () => {
  it('renders the "Quick actions" header', () => {
    render(<QuickActions />);
    expect(screen.getByText('Quick actions')).toBeInTheDocument();
  });

  it('renders always-visible action buttons', () => {
    render(<QuickActions />);
    expect(screen.getByText(/Log readings/)).toBeInTheDocument();
    expect(screen.getByText(/Log sample/)).toBeInTheDocument();
    expect(screen.getByText(/Ask Upstream/)).toBeInTheDocument();
  });

  it('renders mode-specific actions in "all" mode', () => {
    render(<QuickActions />);
    expect(screen.getByText(/Open MOR/)).toBeInTheDocument();
    expect(screen.getByText(/Open DMR/)).toBeInTheDocument();
  });

  it('links Log readings to daily-log', () => {
    render(<QuickActions />);
    const link = screen.getByText(/Log readings/).closest('a');
    expect(link).toHaveAttribute('href', '/daily-log');
  });

  it('links Log sample to lab-samples', () => {
    render(<QuickActions />);
    const link = screen.getByText(/Log sample/).closest('a');
    expect(link).toHaveAttribute('href', '/lab-samples');
  });

  it('links Open MOR to mor-prep', () => {
    render(<QuickActions />);
    const link = screen.getByText(/Open MOR/).closest('a');
    expect(link).toHaveAttribute('href', '/mor-prep');
  });

  it('links Open DMR to dmr-prep', () => {
    render(<QuickActions />);
    const link = screen.getByText(/Open DMR/).closest('a');
    expect(link).toHaveAttribute('href', '/dmr-prep');
  });
});
