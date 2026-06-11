import { render, screen } from '@/test/test-utils';
import { RoleVisible } from '@/components/ui/RoleVisible';

// Default role from mock session is 'op'

describe('RoleVisible', () => {
  it('renders operator content when role is "op" (default)', () => {
    render(
      <RoleVisible show="op">
        <span>Operator content</span>
      </RoleVisible>
    );
    expect(screen.getByText('Operator content')).toBeInTheDocument();
  });

  it('hides manager content when role is "op" (default)', () => {
    render(
      <RoleVisible show="mgr">
        <span>Manager content</span>
      </RoleVisible>
    );
    expect(screen.queryByText('Manager content')).not.toBeInTheDocument();
  });
});
