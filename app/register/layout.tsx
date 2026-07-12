import { Suspense } from 'react';
import Sidebar from "../components/layout/slidebar/slidebar";

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[calc(100vh-96px)] bg-[#f4efe7]">
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