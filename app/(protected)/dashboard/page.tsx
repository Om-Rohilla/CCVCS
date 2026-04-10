import Link from "next/link";

import { CreateCourseForm } from "@/components/courses/CreateCourseForm";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { createClient } from "@/lib/supabase/server";

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = (user?.app_metadata?.role ?? "student") as string;
  const courseQuery = supabase
    .from("courses")
    .select("id", { count: "exact", head: true });
  const fileQuery = supabase
    .from("course_files")
    .select("id", { count: "exact", head: true });

  const [{ count: courseCount }, { count: fileCount }, { data: recentCourses }] =
    await Promise.all([
    role === "teacher" ? courseQuery.eq("teacher_id", user?.id ?? "") : courseQuery,
    fileQuery,
    (role === "teacher"
      ? supabase
          .from("courses")
          .select("id, course_name, course_code")
          .eq("teacher_id", user?.id ?? "")
      : supabase.from("courses").select("id, course_name, course_code")
    )
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <AppShell title="Dashboard">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-brand-light">Signed-in User</p>
          <p className="mt-2 text-lg font-semibold">{user?.email ?? "--"}</p>
        </Card>
        <Card>
          <p className="text-sm text-brand-light">Total Courses</p>
          <p className="mt-2 text-2xl font-bold">{courseCount ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-brand-light">Tracked Files</p>
          <p className="mt-2 text-2xl font-bold">{fileCount ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-brand-light">Latest Activities</p>
          <Skeleton className="mt-3 h-8 w-full" />
        </Card>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold">Recent Courses</h3>
          <div className="mt-3 space-y-3">
            {(recentCourses ?? []).map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="block rounded-lg border border-slate-700/60 p-3 hover:border-brand-gold/70"
              >
                <p className="font-medium text-brand-white">{course.course_name}</p>
                <p className="text-sm text-brand-light">{course.course_code}</p>
              </Link>
            ))}
            {!recentCourses?.length ? (
              <p className="text-sm text-brand-light">
                No courses yet. Create your first course.
              </p>
            ) : null}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Create Course</h3>
          <p className="mb-4 mt-1 text-sm text-brand-light">
            Teacher/Admin can create and manage course spaces.
          </p>
          <CreateCourseForm />
        </Card>
      </section>
    </AppShell>
  );
};

export default DashboardPage;
