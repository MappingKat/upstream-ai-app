import { render, screen } from '@/test/test-utils';
import Home from '@/app/(dashboard)/page';

describe('Home page', () => {
  it('renders the page header', () => {
    render(<Home />);
    expect(screen.getByText('Compliance')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders the district subtitle', () => {
    render(<Home />);
    expect(screen.getByText(/Town of Alma · PWS CO0147001/)).toBeInTheDocument();
  });

  it('renders the calendar link in header', () => {
    render(<Home />);
    const links = screen.getAllByText(/View calendar/);
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders Ask Upstream links', () => {
    render(<Home />);
    // There are multiple "Ask Upstream" references (header + quick actions)
    const links = screen.getAllByText(/Ask Upstream/);
    expect(links.length).toBeGreaterThan(0);
    const askLink = links[0].closest('a');
    expect(askLink).toHaveAttribute('href', '/ask');
  });

  it('renders all major sections', () => {
    render(<Home />);
    // FocusHero
    expect(screen.getByText(/Today's focus/)).toBeInTheDocument();
    // StateFormCard
    expect(screen.getByText(/One-click compliance/)).toBeInTheDocument();
    // TrendsStrip
    expect(screen.getByText('On track YTD')).toBeInTheDocument();
    // ForecastChart
    expect(screen.getByText(/6-month trend/)).toBeInTheDocument();
    // IntegrationsStrip
    expect(screen.getByText(/Live data/)).toBeInTheDocument();
    // Timeline
    expect(screen.getByText('Coming up')).toBeInTheDocument();
    // AtAGlance
    expect(screen.getByText('At a glance')).toBeInTheDocument();
    // QuickActions
    expect(screen.getByText('Quick actions')).toBeInTheDocument();
  });
});
