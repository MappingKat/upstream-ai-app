import { render as rtlRender, screen } from '@testing-library/react';
import { Card, CardHeader } from '@/components/ui/Card';

describe('Card', () => {
  it('renders children', () => {
    rtlRender(<Card><span>Card content</span></Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = rtlRender(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has default styling classes', () => {
    const { container } = rtlRender(<Card>Content</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('bg-surface');
    expect(el.className).toContain('rounded-xl');
  });
});

describe('CardHeader', () => {
  it('renders the title', () => {
    rtlRender(<CardHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders an action element when provided', () => {
    rtlRender(<CardHeader title="Title" action={<button>Action</button>} />);
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('does not render action when not provided', () => {
    const { container } = rtlRender(<CardHeader title="Title" />);
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });
});
