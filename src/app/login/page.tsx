'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSent(true);
  }

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="bg-navy rounded-t-xl px-8 py-6 text-center">
        <div className="text-xl font-semibold text-white tracking-tight">
          <em className="font-serif italic font-bold text-water">Upstream</em> AI
        </div>
        <div className="text-[10px] text-white/55 mt-1 uppercase tracking-[1.2px]">
          Compliance Intelligence
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-surface border border-border border-t-0 rounded-b-xl px-8 py-6">
        {sent ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-bg text-green flex items-center justify-center text-xl mx-auto mb-4">
              ✓
            </div>
            <h2 className="text-lg font-semibold text-navy mb-2">Check your email</h2>
            <p className="text-xs text-text-mid mb-4 leading-relaxed">
              We sent a login link to <strong className="text-text-primary">{email}</strong>.
              Click the link in your email to sign in.
            </p>
            <p className="text-[10px] text-text-dim">No password needed — the link is your key.</p>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="mt-4 text-xs text-accent underline cursor-pointer bg-transparent border-none"
            >
              ← Use a different email
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-lg font-semibold text-navy mb-1">Sign in</h1>
            <p className="text-xs text-text-mid mb-6 leading-relaxed">
              Enter your email below. We&apos;ll send a secure sign-in link — no password needed.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-text-mid mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@townofAlma.co"
                  className="w-full px-3 py-2.5 border-[1.5px] border-border-mid rounded-lg text-sm text-text-primary bg-surface outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(27,106,138,0.12)]"
                />
              </div>

              {error && (
                <p className="text-red text-xs font-semibold">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-accent text-white rounded-lg text-sm font-bold cursor-pointer border-none hover:bg-navy transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending link...' : 'Send login link'}
              </button>

              <p className="text-[10px] text-text-dim text-center">
                No password needed — we&apos;ll email you a secure link.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
