import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";

const LoginPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-navy px-4 py-10">
      <div className="grid w-full max-w-5xl gap-6 md:grid-cols-2">
        <Card className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-brand-white">
            Course Content Version Control System
          </h1>
          <p className="mt-3 text-brand-light">
            Keep every course update traceable with timeline history, compare, and
            version downloads.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-brand-white">Sign in</h2>
          <LoginForm />
        </Card>
      </div>
    </main>
  );
};

export default LoginPage;
