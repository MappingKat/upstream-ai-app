import '@testing-library/jest-dom';
import { randomUUID } from 'crypto';

// Polyfill crypto.randomUUID for jsdom
if (!globalThis.crypto?.randomUUID) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      ...globalThis.crypto,
      randomUUID,
    },
  });
}

// Set Supabase env vars for tests (AuthContext needs these)
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock fetch for Supabase auth calls and health endpoint
const originalFetch = globalThis.fetch;
globalThis.fetch = jest.fn((...args: Parameters<typeof fetch>) => {
  const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
  // Mock Supabase OTP signup/login
  if (url.includes('supabase.co') && url.includes('otp')) {
    return Promise.resolve(new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
  }
  // Mock Supabase auth endpoints
  if (url.includes('supabase.co')) {
    return Promise.resolve(new Response(JSON.stringify({ data: { user: null }, error: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
  }
  // Mock health endpoint
  if (url.includes('/api/health')) {
    return Promise.resolve(new Response(null, { status: 200 }));
  }
  return originalFetch(...args);
}) as typeof fetch;
