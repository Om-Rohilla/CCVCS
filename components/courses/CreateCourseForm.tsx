"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { apiClient } from "@/lib/api-client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const CreateCourseForm = () => {
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [semester, setSemester] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!courseName || !courseCode) {
      setError("Course name and code are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.createCourse({ courseName, courseCode, semester });
      setCourseName("");
      setCourseCode("");
      setSemester("");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to create course.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <Input
        placeholder="Course name"
        value={courseName}
        onChange={(event) => setCourseName(event.target.value)}
      />
      <Input
        placeholder="Course code"
        value={courseCode}
        onChange={(event) => setCourseCode(event.target.value)}
      />
      <Input
        placeholder="Semester (optional)"
        value={semester}
        onChange={(event) => setSemester(event.target.value)}
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create course"}
      </Button>
    </form>
  );
};
