import { render, screen } from '@/test/test-utils';
import { TopBar } from '@/components/layout/TopBar';

describe('TopBar', () => {
  it('renders the district name', () => {
    render(<TopBar />);
    expect(screen.getByText(/Town of Alma/)).toBeInTheDocument();
  });

  it('renders the sync status indicator', () => {
    render(<TopBar />);
    // Mock connectivity returns 'online' / 'Synced'
    expect(screen.getByText('Synced')).toBeInTheDocument();
  });

  it('renders mode indicator', () => {
    render(<TopBar />);
    expect(screen.getByText('All systems')).toBeInTheDocument();
  });
});
