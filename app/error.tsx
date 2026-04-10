"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const GlobalError = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-navy px-4">
      <div className="w-full max-w-xl rounded-xl border border-slate-700/60 bg-brand-slate p-6">
        <h1 className="text-2xl font-bold text-brand-white">Something went wrong</h1>
        <p className="mt-2 text-brand-light">
          The request failed unexpectedly. Please retry, and verify environment
          variables if this persists.
        </p>
        <div className="mt-5">
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </main>
  );
};

export default GlobalError;
