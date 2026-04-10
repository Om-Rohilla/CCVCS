"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { apiClient } from "@/lib/api-client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type UploadFileFormProps = {
  courseId: string;
};

export const UploadFileForm = ({ courseId }: UploadFileFormProps) => {
  const [title, setTitle] = useState("");
  const [changeMessage, setChangeMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title || !file) {
      setError("Title and file are required.");
      return;
    }

    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("title", title);
    formData.append("file", file);
    formData.append("changeMessage", changeMessage);

    setIsSubmitting(true);
    try {
      await apiClient.uploadInitialFile(formData);
      setTitle("");
      setChangeMessage("");
      setFile(null);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Upload failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <Input
        placeholder="File title (e.g. Unit 1 Notes)"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <Input
        placeholder="Change message (optional for v1)"
        value={changeMessage}
        onChange={(event) => setChangeMessage(event.target.value)}
      />
      <Input
        type="file"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Uploading..." : "Upload as v1"}
      </Button>
    </form>
  );
};
