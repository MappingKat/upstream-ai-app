import { render, screen, act } from '@/test/test-utils';
import { renderHook } from '@testing-library/react';
import { ModeVisible } from '@/components/ui/ModeVisible';
import { useApp } from '@/context/AppContext';

// We use the test-utils render which seeds a session and wraps in AuthProvider + AppProvider.
// Default mode is 'all' (from mock session's systemPreference).

describe('ModeVisible', () => {
  it('renders DW content when mode is "all"', () => {
    render(
      <ModeVisible show="dw">
        <span>DW content</span>
      </ModeVisible>
    );
    expect(screen.getByText('DW content')).toBeInTheDocument();
  });

  it('renders WW content when mode is "all"', () => {
    render(
      <ModeVisible show="ww">
        <span>WW content</span>
      </ModeVisible>
    );
    expect(screen.getByText('WW content')).toBeInTheDocument();
  });
});
