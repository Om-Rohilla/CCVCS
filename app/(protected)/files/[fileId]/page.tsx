import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type FilePageProps = {
  params: Promise<{ fileId: string }>;
};

const FilePage = async ({ params }: FilePageProps) => {
  const { fileId } = await params;

  return (
    <AppShell title="File Details">
      <Card>
        <h2 className="text-xl font-semibold text-brand-white">File: {fileId}</h2>
        <p className="mt-2 text-brand-light">
          Version timeline component and API integration come next.
        </p>
        <Link className="mt-4 inline-block" href={`/files/${fileId}/compare`}>
          <Button variant="secondary">Open compare view</Button>
        </Link>
      </Card>
    </AppShell>
  );
};

export default FilePage;
