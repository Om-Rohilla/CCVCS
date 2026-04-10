import { FileVersion } from "@/lib/types";

type VersionTimelineProps = {
  versions: FileVersion[];
};

export const VersionTimeline = ({ versions }: VersionTimelineProps) => {
  if (!versions.length) {
    return <p className="text-sm text-brand-light">No versions available yet.</p>;
  }

  return (
    <ol className="space-y-3">
      {versions.map((version) => (
        <li
          key={version.id}
          className="rounded-lg border border-slate-700/60 bg-brand-slate p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-brand-white">v{version.versionNumber}</p>
            <a
              href={`/api/files/${version.fileId}/versions/${version.versionNumber}/download`}
              className="text-sm text-brand-gold hover:underline"
            >
              Download
            </a>
          </div>
          <p className="mt-2 text-sm text-brand-light">
            {version.changeMessage ?? "No change message provided."}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Uploaded by {version.uploadedBy}{" "}
            {version.uploadedAt ? `on ${new Date(version.uploadedAt).toLocaleString()}` : ""}
          </p>
        </li>
      ))}
    </ol>
  );
};
