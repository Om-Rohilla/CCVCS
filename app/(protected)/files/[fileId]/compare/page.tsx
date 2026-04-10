import { AppShell } from "@/components/layout/AppShell";
import { ComparePanel } from "@/components/files/ComparePanel";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";

type ComparePageProps = {
  params: Promise<{ fileId: string }>;
};

const ComparePage = async ({ params }: ComparePageProps) => {
  const { fileId } = await params;
  const supabase = await createClient();
  const { data: versions } = await supabase
    .from("file_versions")
    .select("version_number")
    .eq("file_id", fileId)
    .order("version_number", { ascending: false });

  const availableVersions = versions?.map((item) => item.version_number) ?? [];

  return (
    <AppShell title="Compare Versions">
      <Card>
        <h2 className="text-xl font-semibold text-brand-white">
          Compare for file {fileId}
        </h2>
        <p className="mb-4 mt-2 text-brand-light">
          Select two versions and view line-level changes.
        </p>
        <ComparePanel fileId={fileId} availableVersions={availableVersions} />
      </Card>
    </AppShell>
  );
};

export default ComparePage;
