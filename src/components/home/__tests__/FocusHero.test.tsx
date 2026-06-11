import { render, screen } from '@/test/test-utils';
import { FocusHero } from '@/components/home/FocusHero';

describe('FocusHero', () => {
  it('renders the eyebrow text', () => {
    render(<FocusHero />);
    expect(screen.getByText(/Today's focus/)).toBeInTheDocument();
  });

  it('renders the title about NODI codes', () => {
    render(<FocusHero />);
    expect(screen.getByText(/2 chlorine readings need a NODI code/)).toBeInTheDocument();
  });

  it('renders the subtitle with gap details', () => {
    render(<FocusHero />);
    expect(screen.getByText(/Mar 11.*unresolved/)).toBeInTheDocument();
  });

  it('renders the CTA button', () => {
    render(<FocusHero />);
    expect(screen.getByText('Resolve gaps →')).toBeInTheDocument();
  });

  it('links CTA to DMR prep page', () => {
    render(<FocusHero />);
    const link = screen.getByText('Resolve gaps →').closest('a');
    expect(link).toHaveAttribute('href', '/dmr-prep');
  });
});
