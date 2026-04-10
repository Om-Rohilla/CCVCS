import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const LoginPage = () => (
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
        <form className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-brand-light" htmlFor="email">
              Email
            </label>
            <Input id="email" type="email" placeholder="teacher@college.edu" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-brand-light" htmlFor="password">
              Password
            </label>
            <Input id="password" type="password" placeholder="********" />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  </main>
);

export default LoginPage;
