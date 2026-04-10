import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

const ProfilePage = () => (
  <AppShell title="Profile">
    <Card>
      <h2 className="text-xl font-semibold text-brand-white">Account Details</h2>
      <p className="mt-2 text-brand-light">
        Profile data wiring will be connected in Step 2 with Supabase Auth.
      </p>
    </Card>
  </AppShell>
);

export default ProfilePage;
