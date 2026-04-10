import { NextResponse } from "next/server";

import { requireUser } from "@/lib/server/auth";

type RouteContext = {
  params: Promise<{ courseId: string }>;
};

export const GET = async (_request: Request, context: RouteContext) => {
  const session = await requireUser();
  if (session.error || !session.supabase) {
    return NextResponse.json({ message: session.error }, { status: session.status });
  }

  const { courseId } = await context.params;
  const { data, error } = await session.supabase
    .from("courses")
    .select("id, course_name, course_code, teacher_id, semester, created_at")
    .eq("id", courseId)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: "Course not found." }, { status: 404 });
  }

  return NextResponse.json({
    course: {
      id: data.id,
      courseName: data.course_name,
      courseCode: data.course_code,
      teacherId: data.teacher_id,
      semester: data.semester,
      createdAt: data.created_at,
    },
  });
};
