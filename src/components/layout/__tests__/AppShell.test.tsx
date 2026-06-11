import { render, screen, act } from '@/test/test-utils';
import { AppShell } from '@/components/layout/AppShell';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: jest.fn() }),
}));

describe('AppShell', () => {
  it('renders children after loading', async () => {
    await act(async () => {
      render(
        <AppShell>
          <div>Page content</div>
        </AppShell>
      );
    });
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('renders the sidebar', async () => {
    await act(async () => {
      render(
        <AppShell>
          <div>Content</div>
        </AppShell>
      );
    });
    expect(screen.getByText('Upstream')).toBeInTheDocument();
  });
});
