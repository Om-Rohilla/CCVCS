import { NextResponse } from "next/server";

import { requireTeacherOrAdmin, requireUser } from "@/lib/server/auth";

export const GET = async () => {
  const session = await requireUser();
  if (session.error || !session.supabase || !session.user) {
    return NextResponse.json({ message: session.error }, { status: session.status });
  }

  const userRole = (session.user.app_metadata?.role ?? "student") as string;
  let query = session.supabase
    .from("courses")
    .select("id, course_name, course_code, teacher_id, semester, created_at")
    .order("created_at", { ascending: false });

  if (userRole === "teacher") {
    query = query.eq("teacher_id", session.user.id);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const courses = (data ?? []).map((course) => ({
    id: course.id,
    courseName: course.course_name,
    courseCode: course.course_code,
    teacherId: course.teacher_id,
    semester: course.semester,
    createdAt: course.created_at,
  }));

  return NextResponse.json({ courses });
};

export const POST = async (request: Request) => {
  const session = await requireTeacherOrAdmin();
  if (session.error || !session.supabase || !session.user) {
    return NextResponse.json({ message: session.error }, { status: session.status });
  }

  const body = await request.json().catch(() => null);
  const courseName = body?.courseName?.trim();
  const courseCode = body?.courseCode?.trim();
  const semester = body?.semester?.trim() || null;

  if (!courseName || !courseCode) {
    return NextResponse.json(
      { message: "courseName and courseCode are required." },
      { status: 400 },
    );
  }

  const { data, error } = await session.supabase
    .from("courses")
    .insert({
      course_name: courseName,
      course_code: courseCode,
      teacher_id: session.user.id,
      semester,
    })
    .select("id, course_name, course_code, teacher_id, semester, created_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ message: error?.message ?? "Failed to create course." }, { status: 500 });
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
