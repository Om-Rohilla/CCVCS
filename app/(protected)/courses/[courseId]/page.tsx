import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { UploadFileForm } from "@/components/files/UploadFileForm";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";

type CoursePageProps = {
  params: Promise<{ courseId: string }>;
};

const CoursePage = async ({ params }: CoursePageProps) => {
  const { courseId } = await params;
  const supabase = await createClient();

  const [{ data: course }, { data: files }] = await Promise.all([
    supabase
      .from("courses")
      .select("id, course_name, course_code, semester")
      .eq("id", courseId)
      .single(),
    supabase
      .from("course_files")
      .select("id, title, current_version, updated_at")
      .eq("course_id", courseId)
      .order("updated_at", { ascending: false }),
  ]);

  return (
    <AppShell title="Course Details">
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-brand-white">
            {course?.course_name ?? "Unknown course"}
          </h2>
          <p className="mt-1 text-sm text-brand-light">
            Code: {course?.course_code ?? "--"} | Semester: {course?.semester ?? "--"}
          </p>
          <div className="mt-5 space-y-3">
            {(files ?? []).map((file) => (
              <Link
                key={file.id}
                href={`/files/${file.id}`}
                className="block rounded-lg border border-slate-700/60 p-4 hover:border-brand-gold/70"
              >
                <p className="font-medium text-brand-white">{file.title}</p>
                <p className="text-sm text-brand-light">
                  Current Version: v{file.current_version}
                </p>
              </Link>
            ))}
            {!files?.length ? (
              <p className="text-sm text-brand-light">
                No files yet. Upload the first version from the panel.
              </p>
            ) : null}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-brand-white">Upload New File</h3>
          <p className="mb-4 mt-1 text-sm text-brand-light">
            This creates a new `course_file` with initial version `v1`.
          </p>
          <UploadFileForm courseId={courseId} />
        </Card>
      </section>
    </AppShell>
  );
};

export default CoursePage;
