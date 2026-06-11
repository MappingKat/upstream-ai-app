import { render, screen } from '@/test/test-utils';
import { AtAGlance } from '@/components/home/AtAGlance';

describe('AtAGlance', () => {
  it('renders the "At a glance" header', () => {
    render(<AtAGlance />);
    expect(screen.getByText('At a glance')).toBeInTheDocument();
  });

  it('renders population', () => {
    render(<AtAGlance />);
    expect(screen.getByText('Population served')).toBeInTheDocument();
    expect(screen.getByText('~270 residents')).toBeInTheDocument();
  });

  it('renders operator on duty', () => {
    render(<AtAGlance />);
    expect(screen.getByText('Operator on duty')).toBeInTheDocument();
    expect(screen.getByText('Bobby J. · since 6:00 AM')).toBeInTheDocument();
  });

  it('renders permit renewal info', () => {
    render(<AtAGlance />);
    expect(screen.getByText('Next renewal')).toBeInTheDocument();
    expect(screen.getByText('CDPS permit · 2028')).toBeInTheDocument();
  });

  it('renders both DW and WW system classes in "all" mode', () => {
    render(<AtAGlance />);
    expect(screen.getByText('DW system class')).toBeInTheDocument();
    expect(screen.getByText('CWS · bag/cartridge + Cl₂')).toBeInTheDocument();
    expect(screen.getByText('WW system class')).toBeInTheDocument();
    expect(screen.getByText('3-cell aerated lagoon')).toBeInTheDocument();
  });

  it('renders last submission statuses', () => {
    render(<AtAGlance />);
    expect(screen.getByText('Last MOR submitted')).toBeInTheDocument();
    expect(screen.getByText(/Feb · Mar 7 \(on time\)/)).toBeInTheDocument();
    expect(screen.getByText('Last DMR submitted')).toBeInTheDocument();
    expect(screen.getByText(/Feb · Mar 26 \(2d early\)/)).toBeInTheDocument();
  });
});
