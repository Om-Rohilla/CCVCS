"use client";

import { useState } from "react";

import { apiClient } from "@/lib/api-client";
import { CompareResult } from "@/lib/types";

import { Button } from "@/components/ui/Button";

type ComparePanelProps = {
  fileId: string;
  availableVersions: number[];
};

export const ComparePanel = ({ fileId, availableVersions }: ComparePanelProps) => {
  const hasVersions = availableVersions.length > 0;
  const [v1, setV1] = useState<number>(availableVersions[1] ?? availableVersions[0] ?? 1);
  const [v2, setV2] = useState<number>(availableVersions[0] ?? 1);
  const [result, setResult] = useState<(CompareResult & { truncated?: boolean }) | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const runCompare = async () => {
    if (!hasVersions) return;
    setError("");
    setIsLoading(true);
    try {
      const response = await apiClient.compareVersions(fileId, v1, v2);
      setResult(response);
    } catch (compareError) {
      setResult(null);
      setError(compareError instanceof Error ? compareError.message : "Compare failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!hasVersions ? (
        <p className="text-sm text-brand-light">
          No versions found yet. Upload at least two versions to compare.
        </p>
      ) : null}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm text-brand-light">
          Version A
          <select
            className="mt-1 w-full rounded-md border border-slate-700 bg-brand-slate px-3 py-2 text-brand-white"
            value={v1}
            onChange={(event) => setV1(Number(event.target.value))}
          >
            {availableVersions.map((version) => (
              <option key={`a-${version}`} value={version}>
                v{version}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-brand-light">
          Version B
          <select
            className="mt-1 w-full rounded-md border border-slate-700 bg-brand-slate px-3 py-2 text-brand-white"
            value={v2}
            onChange={(event) => setV2(Number(event.target.value))}
          >
            {availableVersions.map((version) => (
              <option key={`b-${version}`} value={version}>
                v{version}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Button onClick={runCompare} disabled={isLoading || v1 === v2 || !hasVersions}>
        {isLoading ? "Comparing..." : "Compare versions"}
      </Button>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {result ? (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-md border border-slate-700/60 p-3 text-sm">
              Added: <span className="font-semibold text-emerald-400">{result.summary.added}</span>
            </div>
            <div className="rounded-md border border-slate-700/60 p-3 text-sm">
              Removed: <span className="font-semibold text-red-400">{result.summary.removed}</span>
            </div>
            <div className="rounded-md border border-slate-700/60 p-3 text-sm">
              Changed: <span className="font-semibold text-amber-300">{result.summary.changed}</span>
            </div>
            <div className="rounded-md border border-slate-700/60 p-3 text-sm">
              Same: <span className="font-semibold text-brand-light">{result.summary.unchanged}</span>
            </div>
          </div>

          <div className="max-h-[480px] space-y-2 overflow-y-auto rounded-lg border border-slate-700/60 p-3">
            {result.lines
              .filter((line) => line.type !== "unchanged")
              .map((line) => (
                <div key={`${line.lineNumber}-${line.type}`} className="rounded-md bg-brand-slate p-2 text-xs">
                  <p className="text-slate-400">Line {line.lineNumber}</p>
                  {line.type !== "added" ? (
                    <p className="mt-1 text-red-300">- {line.before || "(empty)"}</p>
                  ) : null}
                  {line.type !== "removed" ? (
                    <p className="text-emerald-300">+ {line.after || "(empty)"}</p>
                  ) : null}
                </div>
              ))}
            {result.lines.every((line) => line.type === "unchanged") ? (
              <p className="text-sm text-brand-light">No differences found.</p>
            ) : null}
          </div>
          {result.truncated ? (
            <p className="text-xs text-slate-400">
              Compare output was truncated to keep rendering fast.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
