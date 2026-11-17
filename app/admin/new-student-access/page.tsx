'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '../adminFetch';

type AuthorizationAccount = {
  registration_number: string;
  is_active: boolean;
  registration_completed: boolean;
  created_at: string;
  form_statuses: Record<string, string>;
};

export default function NewStudentAccessPage() {
  const [accounts, setAccounts] = useState<AuthorizationAccount[]>([]);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verificationKey, setVerificationKey] = useState('');

  async function loadAccounts() {
    try {
      const response = await adminFetch('http://localhost:5000/api/admin/new-student-authorizations');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load authorized students.');
      setAccounts(data.accounts);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load authorized students.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAccounts();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await adminFetch('http://localhost:5000/api/admin/new-student-authorizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_number: registrationNumber, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to add authorized student.');

      setRegistrationNumber('');
      setPassword('');
      await loadAccounts();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to add authorized student.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOfflineForm(accountNumber: string, formKey: 'bursary' | 'mahapola') {
    const key = `${accountNumber}:${formKey}`;
    setVerificationKey(key);
    setError('');
    try {
      const response = await adminFetch('http://localhost:5000/api/admin/new-student-authorizations/forms/' + formKey + '/verify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_number: accountNumber }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to verify the paper form.');
      await loadAccounts();
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : 'Unable to verify the paper form.');
    } finally {
      setVerificationKey('');
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-[#1e293b]">New Student Access</h1>
        <p className="font-medium text-[#64748b]">Manage which new students are allowed to submit registration forms.</p>
      </div>

      {error && <p role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-8 grid gap-4 rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="text-sm font-semibold text-slate-700">
          Registration number
          <input required pattern="(ITT|ENT|BST)/[0-9]{4}/[0-9]{3}" value={registrationNumber} onChange={event => setRegistrationNumber(event.target.value)} placeholder="ITT/2026/051" className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-[#7C0A02] focus:ring-2 focus:ring-red-900/10" />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Assigned password
          <div className="relative mt-1.5">
            <input required minLength={12} type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2.5 pr-10 font-normal outline-none focus:border-[#7C0A02] focus:ring-2 focus:ring-red-900/10" />
            <button
              type="button"
              onClick={() => setShowPassword(current => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
              aria-label={showPassword ? 'Hide assigned password' : 'Show assigned password'}
              title={showPassword ? 'Hide assigned password' : 'Show assigned password'}
            >
              <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`} aria-hidden="true" />
            </button>
          </div>
        </label>
        <button type="submit" disabled={submitting} className="rounded-md bg-[#7C0A02] px-5 py-2.5 font-semibold text-white hover:bg-[#5a0602] disabled:opacity-60">
          {submitting ? 'Adding...' : 'Authorize student'}
        </button>
      </form>

      <section className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="border-b border-[#e2e8f0] bg-[#f8fafc] px-5 py-4">
          <h2 className="font-bold text-slate-800">Authorized accounts ({accounts.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e2e8f0] text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Registration number</th>
                <th className="px-5 py-3">Access</th>
                <th className="px-5 py-3">Registration status</th>
                <th className="px-5 py-3">Offline forms</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-500">Loading authorized accounts...</td></tr>
              ) : accounts.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-500">No authorized accounts found.</td></tr>
              ) : accounts.map(account => (
                <tr key={account.registration_number} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-3 font-semibold text-slate-800">{account.registration_number}</td>
                  <td className="px-5 py-3">{account.is_active ? 'Active' : 'Disabled'}</td>
                  <td className="px-5 py-3">{account.registration_completed ? 'Completed' : 'Not completed'}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      {(['bursary', 'mahapola'] as const).map(formKey => (
                        account.form_statuses?.[formKey] === 'staff_verified' ? (
                          <span key={formKey} className="rounded bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                            {formKey === 'bursary' ? 'Bursary verified' : 'Mahapola verified'}
                          </span>
                        ) : (
                          <button
                            key={formKey}
                            type="button"
                            disabled={Boolean(verificationKey)}
                            onClick={() => void handleVerifyOfflineForm(account.registration_number, formKey)}
                            className="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800 disabled:opacity-60"
                          >
                            {verificationKey === `${account.registration_number}:${formKey}` ? 'Verifying...' : `Verify ${formKey === 'bursary' ? 'Bursary' : 'Mahapola'}`}
                          </button>
                        )
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
