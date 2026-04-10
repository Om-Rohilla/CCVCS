import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const DashboardPage = () => (
  <AppShell title="Dashboard">
    <section className="grid gap-4 md:grid-cols-3">
      <Card>
        <p className="text-sm text-brand-light">Total Courses</p>
        <p className="mt-2 text-2xl font-bold">--</p>
      </Card>
      <Card>
        <p className="text-sm text-brand-light">Files Updated This Week</p>
        <p className="mt-2 text-2xl font-bold">--</p>
      </Card>
      <Card>
        <p className="text-sm text-brand-light">Latest Activities</p>
        <Skeleton className="mt-3 h-8 w-full" />
      </Card>
    </section>
  </AppShell>
);

export default DashboardPage;
