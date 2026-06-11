import { render as rtlRender, screen } from '@testing-library/react';
import { Tag } from '@/components/ui/Tag';

describe('Tag', () => {
  it('renders children text', () => {
    rtlRender(<Tag>Status</Tag>);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('uses "mid" variant by default', () => {
    const { container } = rtlRender(<Tag>Default</Tag>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('bg-bg');
    expect(el.className).toContain('text-text-mid');
  });

  it('applies "ok" variant styles', () => {
    const { container } = rtlRender(<Tag variant="ok">OK</Tag>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('bg-green-bg');
    expect(el.className).toContain('text-green');
  });

  it('applies "warn" variant styles', () => {
    const { container } = rtlRender(<Tag variant="warn">Warning</Tag>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('bg-yellow-bg');
    expect(el.className).toContain('text-yellow');
  });

  it('applies "alert" variant styles', () => {
    const { container } = rtlRender(<Tag variant="alert">Alert</Tag>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('bg-red-bg');
    expect(el.className).toContain('text-red');
  });

  it('applies "navy" variant styles', () => {
    const { container } = rtlRender(<Tag variant="navy">Navy</Tag>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('text-navy');
  });

  it('applies "purple" variant styles', () => {
    const { container } = rtlRender(<Tag variant="purple">Purple</Tag>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('bg-purple-bg');
    expect(el.className).toContain('text-purple');
  });
});
