import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 text-indigo-600 mb-4">
          <i className="fas fa-shield-halved text-2xl" />
          <span className="text-xs font-semibold uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-full text-indigo-700">
            Admin Workspace
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Admin Portal
        </h1>
        <p className="mt-3 text-base text-slate-600 max-w-2xl">
          Welcome to the RUSL administrative management dashboard placeholder.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <i className="fas fa-arrow-left text-xs" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
