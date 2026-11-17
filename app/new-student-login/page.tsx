'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewStudentLoginPage() {
  const router = useRouter();
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/new-student/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_number: registrationNumber.trim(), password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid Registration Number or Password.');
        return;
      }

      router.replace(data.next_route || '/register/student-personal-info');
      router.refresh();
    } catch {
      setError('Unable to connect to the registration service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-108px)] bg-[#f4efe7] px-4 py-10 sm:px-6">
      <section className="mx-auto w-full max-w-md overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
        <div className="bg-[#7C0A02] px-6 py-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-200">Rajarata University of Sri Lanka</p>
          <h1 className="mt-2 text-xl font-bold">New Student Registration</h1>
          <p className="mt-1 text-sm text-white/80">Sign in with your assigned registration details to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <label className="block text-sm font-semibold text-stone-700">
            Student Registration Number
            <input
              type="text"
              required
              autoComplete="username"
              value={registrationNumber}
              onChange={event => setRegistrationNumber(event.target.value)}
              placeholder="ITT/2026/001"
              className="mt-2 w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 font-normal outline-none transition focus:border-[#7C0A02] focus:ring-2 focus:ring-red-900/10"
            />
          </label>

          <label className="block text-sm font-semibold text-stone-700">
            Assigned Password
            <div className="relative mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 pr-10 font-normal outline-none transition focus:border-[#7C0A02] focus:ring-2 focus:ring-red-900/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(current => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 transition hover:text-stone-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`} aria-hidden="true" />
              </button>
            </div>
          </label>

          <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-[#7C0A02] px-4 py-3 font-semibold text-white transition hover:bg-[#5a0602] disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Validating...' : 'Continue to Registration'}
          </button>

          <p className="text-center text-sm text-stone-600">
            Current student? <Link href="/signin" className="font-semibold text-[#7C0A02] hover:underline">Student sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
