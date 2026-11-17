import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import Sidebar from "../components/layout/slidebar/slidebar";
import RegistrationDraftGuard from './RegistrationDraftGuard';

export default async function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('newStudentSession')?.value;
  if (!sessionCookie) redirect('/new-student-login');

  let isAuthorized = false;
  try {
    const response = await fetch('http://localhost:5000/api/auth/new-student/session', {
      headers: { Cookie: `newStudentSession=${encodeURIComponent(sessionCookie)}` },
      cache: 'no-store',
    });
    isAuthorized = response.ok;
  } catch {
    isAuthorized = false;
  }

  if (!isAuthorized) redirect('/new-student-login');

  return (
    <div className="min-h-[calc(100vh-108px)] bg-[#f4efe7]">
      <RegistrationDraftGuard />
      <Suspense fallback={<div className="p-4 text-slate-600">Loading navigation…</div>}>
        <Sidebar />
      </Suspense>
      <main className="lg:pl-80 px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="p-6 text-slate-700">Loading registration section…</div>}>
          <div className="mx-auto max-w-5xl">{children}</div>
        </Suspense>
      </main>
    </div>
  );
}