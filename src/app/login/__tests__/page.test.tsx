import { render as rtlRender, screen, fireEvent, act } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import LoginPage from '@/app/login/page';
import type { ReactNode } from 'react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>{children}</AppProvider>
    </AuthProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('Login Page', () => {
  it('renders the brand header', async () => {
    await act(async () => {
      rtlRender(<LoginPage />, { wrapper: Wrapper });
    });
    expect(screen.getByText('Upstream')).toBeInTheDocument();
  });

  it('renders email input', async () => {
    await act(async () => {
      rtlRender(<LoginPage />, { wrapper: Wrapper });
    });
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  });

  it('renders submit button', async () => {
    await act(async () => {
      rtlRender(<LoginPage />, { wrapper: Wrapper });
    });
    expect(screen.getByText('Send login link')).toBeInTheDocument();
  });

  it('has a form with email input and submit button', async () => {
    await act(async () => {
      rtlRender(<LoginPage />, { wrapper: Wrapper });
    });
    const form = screen.getByText('Send login link').closest('form');
    expect(form).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('Email address')).toHaveAttribute('required');
  });
});
