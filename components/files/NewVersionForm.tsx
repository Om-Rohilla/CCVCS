"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { apiClient } from "@/lib/api-client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type NewVersionFormProps = {
  fileId: string;
};

export const NewVersionForm = ({ fileId }: NewVersionFormProps) => {
  const [changeMessage, setChangeMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("changeMessage", changeMessage);

    setIsSubmitting(true);
    try {
      await apiClient.uploadNewVersion(fileId, formData);
      setFile(null);
      setChangeMessage("");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Version update failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <Input
        placeholder="Change message (e.g. Updated examples)"
        value={changeMessage}
        onChange={(event) => setChangeMessage(event.target.value)}
      />
      <Input
        type="file"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Uploading..." : "Upload new version"}
      </Button>
    </form>
  );
};
