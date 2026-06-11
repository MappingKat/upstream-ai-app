import { render, screen, fireEvent } from '@/test/test-utils';
import { Sidebar } from '@/components/layout/Sidebar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: jest.fn() }),
}));

describe('Sidebar', () => {
  it('renders the brand name', () => {
    render(<Sidebar />);
    expect(screen.getByText('Upstream')).toBeInTheDocument();
  });

  it('renders the district name', () => {
    render(<Sidebar />);
    expect(screen.getByText('Town of Alma')).toBeInTheDocument();
  });

  it('renders system mode toggle', () => {
    render(<Sidebar />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('DW')).toBeInTheDocument();
    expect(screen.getByText('WW')).toBeInTheDocument();
  });

  it('renders role toggle', () => {
    render(<Sidebar />);
    expect(screen.getByText('Operator')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('renders nav sections', () => {
    render(<Sidebar />);
    expect(screen.getByText('Compliance')).toBeInTheDocument();
    expect(screen.getByText('Operations')).toBeInTheDocument();
    expect(screen.getByText('Reference')).toBeInTheDocument();
  });

  it('renders nav items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Compliance Home')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Daily Log')).toBeInTheDocument();
  });

  it('renders sign out button', () => {
    render(<Sidebar />);
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('hides DMR Prep when mode is DW', () => {
    render(<Sidebar />);
    expect(screen.getByText('DMR Prep')).toBeInTheDocument();
    fireEvent.click(screen.getByText('DW'));
    expect(screen.queryByText('DMR Prep')).not.toBeInTheDocument();
  });

  it('hides MOR Prep when mode is WW', () => {
    render(<Sidebar />);
    expect(screen.getByText('MOR Prep')).toBeInTheDocument();
    fireEvent.click(screen.getByText('WW'));
    expect(screen.queryByText('MOR Prep')).not.toBeInTheDocument();
  });

  it('shows badges', () => {
    render(<Sidebar />);
    expect(screen.getByText('2 gaps')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });
});
