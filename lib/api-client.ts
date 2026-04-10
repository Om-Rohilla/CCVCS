import { CompareResult, Course, CourseFile, FileVersion } from "@/lib/types";

type ApiError = {
  message: string;
};

const toError = async (response: Response) => {
  const body = (await response.json().catch(() => null)) as ApiError | null;
  return new Error(body?.message ?? "Request failed.");
};

export const apiClient = {
  getCourses: async () => {
    const response = await fetch("/api/courses", { cache: "no-store" });
    if (!response.ok) throw await toError(response);
    return (await response.json()) as { courses: Course[] };
  },

  createCourse: async (payload: {
    courseName: string;
    courseCode: string;
    semester?: string;
  }) => {
    const response = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw await toError(response);
    return (await response.json()) as { course: Course };
  },

  uploadInitialFile: async (formData: FormData) => {
    const response = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw await toError(response);
    return (await response.json()) as { file: CourseFile; version: number };
  },

  uploadNewVersion: async (fileId: string, formData: FormData) => {
    const response = await fetch(`/api/files/${fileId}/versions`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw await toError(response);
    return (await response.json()) as { newVersionNumber: number };
  },

  getFile: async (fileId: string) => {
    const response = await fetch(`/api/files/${fileId}`, { cache: "no-store" });
    if (!response.ok) throw await toError(response);
    return (await response.json()) as { file: CourseFile };
  },

  getFileVersions: async (fileId: string) => {
    const response = await fetch(`/api/files/${fileId}/versions`, { cache: "no-store" });
    if (!response.ok) throw await toError(response);
    return (await response.json()) as { versions: FileVersion[] };
  },

  compareVersions: async (fileId: string, v1: number, v2: number) => {
    const response = await fetch(`/api/files/${fileId}/compare?v1=${v1}&v2=${v2}`, {
      cache: "no-store",
    });
    if (!response.ok) throw await toError(response);
    return (await response.json()) as CompareResult & { truncated?: boolean };
  },

  rollbackVersion: async (fileId: string, payload: { targetVersion: number; reason?: string }) => {
    const response = await fetch(`/api/files/${fileId}/rollback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw await toError(response);
    return (await response.json()) as { newVersionAfterRollback: number };
  },
};
