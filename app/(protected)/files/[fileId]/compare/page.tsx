import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

type ComparePageProps = {
  params: Promise<{ fileId: string }>;
};

const ComparePage = async ({ params }: ComparePageProps) => {
  const { fileId } = await params;

  return (
    <AppShell title="Compare Versions">
      <Card>
        <h2 className="text-xl font-semibold text-brand-white">
          Compare for file {fileId}
        </h2>
        <p className="mt-2 text-brand-light">
          Compare panel placeholder. Diff view will be integrated with backend
          compare data in next implementation steps.
        </p>
      </Card>
    </AppShell>
  );
};

export default ComparePage;
