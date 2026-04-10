import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { createClient } from "@/lib/supabase/server";

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AppShell title="Dashboard">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-brand-light">Signed-in User</p>
          <p className="mt-2 text-lg font-semibold">{user?.email ?? "--"}</p>
        </Card>
        <Card>
          <p className="text-sm text-brand-light">Role</p>
          <p className="mt-2 text-2xl font-bold capitalize">
            {user?.app_metadata?.role ?? "student"}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-brand-light">Latest Activities</p>
          <Skeleton className="mt-3 h-8 w-full" />
        </Card>
      </section>
    </AppShell>
  );
};

export default DashboardPage;
