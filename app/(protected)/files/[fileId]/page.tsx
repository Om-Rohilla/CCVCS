import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { NewVersionForm } from "@/components/files/NewVersionForm";
import { RollbackForm } from "@/components/files/RollbackForm";
import { VersionTimeline } from "@/components/files/VersionTimeline";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";

type FilePageProps = {
  params: Promise<{ fileId: string }>;
};

const FilePage = async ({ params }: FilePageProps) => {
  const { fileId } = await params;
  const supabase = await createClient();
  const [{ data: file }, { data: versions }] = await Promise.all([
    supabase
      .from("course_files")
      .select("id, title, current_version, course_id, updated_at")
      .eq("id", fileId)
      .single(),
    supabase
      .from("file_versions")
      .select("id, file_id, version_number, storage_path, change_message, uploaded_by, uploaded_at")
      .eq("file_id", fileId)
      .order("version_number", { ascending: false }),
  ]);

  const mappedVersions =
    versions?.map((version) => ({
      id: version.id,
      fileId: version.file_id,
      versionNumber: version.version_number,
      storagePath: version.storage_path,
      changeMessage: version.change_message,
      uploadedBy: version.uploaded_by,
      uploadedAt: version.uploaded_at,
    })) ?? [];
  const availableVersions = mappedVersions.map((version) => version.versionNumber);

  return (
    <AppShell title="File Details">
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-brand-white">
            {file?.title ?? `File ${fileId}`}
          </h2>
          <p className="mt-1 text-sm text-brand-light">
            Current version: v{file?.current_version ?? 0}
          </p>
          <div className="mt-4">
            <VersionTimeline versions={mappedVersions} />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-brand-white">New Version</h3>
          <p className="mb-4 mt-1 text-sm text-brand-light">
            Upload an updated file with a commit-style message.
          </p>
          <NewVersionForm fileId={fileId} />
          <Link className="mt-4 inline-block" href={`/files/${fileId}/compare`}>
            <Button variant="secondary">Open compare view</Button>
          </Link>

          <div className="mt-6 border-t border-slate-700/60 pt-4">
            <h4 className="text-base font-semibold text-brand-white">Rollback</h4>
            <p className="mb-3 mt-1 text-sm text-brand-light">
              Restore any older version as a new latest version.
            </p>
            <RollbackForm fileId={fileId} availableVersions={availableVersions} />
          </div>
        </Card>
      </section>
    </AppShell>
  );
};

export default FilePage;
