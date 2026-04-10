import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-brand-navy px-4 text-center">
      <h1 className="text-3xl font-bold">Course Content Version Control System</h1>
      <p className="max-w-xl text-brand-light">
        Foundation initialized. Use the links below to access the public and
        protected route groups.
      </p>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-brand-gold hover:underline">
          Login
        </Link>
        <Link href="/dashboard" className="text-brand-gold hover:underline">
          Dashboard
        </Link>
      </div>
    </main>
  );
}
