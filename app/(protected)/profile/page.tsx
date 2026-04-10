import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";

const ProfilePage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AppShell title="Profile">
      <Card>
        <h2 className="text-xl font-semibold text-brand-white">Account Details</h2>
        <div className="mt-4 space-y-2 text-brand-light">
          <p>
            <span className="font-medium text-brand-white">Email:</span>{" "}
            {user?.email ?? "--"}
          </p>
          <p>
            <span className="font-medium text-brand-white">Role:</span>{" "}
            <span className="capitalize">
              {user?.app_metadata?.role ?? "student"}
            </span>
          </p>
          <p>
            <span className="font-medium text-brand-white">User ID:</span>{" "}
            {user?.id ?? "--"}
          </p>
        </div>
      </Card>
    </AppShell>
  );
};

export default ProfilePage;
