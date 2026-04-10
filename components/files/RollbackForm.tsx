"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { apiClient } from "@/lib/api-client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type RollbackFormProps = {
  fileId: string;
  availableVersions: number[];
};

export const RollbackForm = ({ fileId, availableVersions }: RollbackFormProps) => {
  const hasVersions = availableVersions.length > 0;
  const [targetVersion, setTargetVersion] = useState<number>(availableVersions[0] ?? 1);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!hasVersions) return;
    setIsSubmitting(true);
    try {
      await apiClient.rollbackVersion(fileId, { targetVersion, reason });
      setReason("");
      router.refresh();
    } catch (rollbackError) {
      setError(rollbackError instanceof Error ? rollbackError.message : "Rollback failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      {!hasVersions ? (
        <p className="text-sm text-brand-light">No versions available for rollback.</p>
      ) : null}
      <label className="text-sm text-brand-light">
        Target version
        <select
          className="mt-1 w-full rounded-md border border-slate-700 bg-brand-slate px-3 py-2 text-brand-white"
          value={targetVersion}
          onChange={(event) => setTargetVersion(Number(event.target.value))}
        >
          {availableVersions.map((version) => (
            <option key={version} value={version}>
              v{version}
            </option>
          ))}
        </select>
      </label>
      <Input
        placeholder="Reason (optional)"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button variant="destructive" type="submit" disabled={isSubmitting || !hasVersions}>
        {isSubmitting ? "Rolling back..." : "Rollback as new version"}
      </Button>
    </form>
  );
};
