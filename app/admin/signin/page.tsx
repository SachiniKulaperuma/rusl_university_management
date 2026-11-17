'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Unable to sign in.');
        return;
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      router.replace('/admin');
    } catch {
      setError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Admin Sign In</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in with your administrator account.</p>

        {error && <p role="alert" className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            Admin email
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2.5 outline-none focus:border-[#7C0A02] focus:ring-2 focus:ring-red-900/10"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            Password
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 pr-10 outline-none focus:border-[#7C0A02] focus:ring-2 focus:ring-red-900/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(current => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`} aria-hidden="true" />
              </button>
            </div>
          </label>
          <button type="submit" disabled={loading} className="mt-2 rounded-md bg-[#7C0A02] px-4 py-3 font-semibold text-white hover:bg-[#5a0602] disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Student? <Link href="/signin" className="font-semibold text-[#7C0A02] hover:underline">Student sign in</Link>
        </p>
      </section>
    </main>
  );
}
