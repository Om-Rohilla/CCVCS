import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

type CoursePageProps = {
  params: Promise<{ courseId: string }>;
};

const CoursePage = async ({ params }: CoursePageProps) => {
  const { courseId } = await params;

  return (
    <AppShell title="Course Details">
      <Card>
        <h2 className="text-xl font-semibold text-brand-white">
          Course: {courseId}
        </h2>
        <p className="mt-2 text-brand-light">
          Course file listing and upload actions are added in upcoming steps.
        </p>
      </Card>
    </AppShell>
  );
};

export default CoursePage;
