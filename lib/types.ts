export type Role = "teacher" | "student" | "admin";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
};

export type Course = {
  id: string;
  courseName: string;
  courseCode: string;
  teacherId: string;
  semester?: string;
  createdAt?: string;
};

export type CourseFile = {
  id: string;
  courseId: string;
  title: string;
  fileType: string;
  currentVersion: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FileVersion = {
  id: string;
  fileId: string;
  versionNumber: number;
  storagePath: string;
  changeMessage: string | null;
  uploadedBy: string;
  uploadedAt?: string;
  checksum?: string;
};
