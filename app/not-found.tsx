import Link from "next/link";

const NotFound = () => (
  <main className="flex min-h-screen items-center justify-center bg-brand-navy px-4">
    <div className="w-full max-w-xl rounded-xl border border-slate-700/60 bg-brand-slate p-6 text-center">
      <h1 className="text-2xl font-bold text-brand-white">Page not found</h1>
      <p className="mt-2 text-brand-light">
        The resource you requested does not exist or has moved.
      </p>
      <Link href="/dashboard" className="mt-5 inline-block text-brand-gold hover:underline">
        Go to dashboard
      </Link>
    </div>
  </main>
);

export default NotFound;
