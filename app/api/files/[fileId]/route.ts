import { NextResponse } from "next/server";

import { requireUser } from "@/lib/server/auth";

type RouteContext = {
  params: Promise<{ fileId: string }>;
};

export const GET = async (_request: Request, context: RouteContext) => {
  const session = await requireUser();
  if (session.error || !session.supabase) {
    return NextResponse.json({ message: session.error }, { status: session.status });
  }

  const { fileId } = await context.params;
  const { data, error } = await session.supabase
    .from("course_files")
    .select("id, course_id, title, file_type, current_version, created_by, created_at, updated_at")
    .eq("id", fileId)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: "File not found." }, { status: 404 });
  }

  return NextResponse.json({
    file: {
      id: data.id,
      courseId: data.course_id,
      title: data.title,
      fileType: data.file_type,
      currentVersion: data.current_version,
      createdBy: data.created_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
  });
};
