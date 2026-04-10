"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type FormState = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        setError(payload?.message ?? "Unable to sign in.");
        return;
      }

      const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
      router.push(redirectTo);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-5 space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="mb-1 block text-sm text-brand-light" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="teacher@college.edu"
          value={form.email}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, email: event.target.value }))
          }
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-brand-light" htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="********"
          value={form.password}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, password: event.target.value }))
          }
        />
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};
