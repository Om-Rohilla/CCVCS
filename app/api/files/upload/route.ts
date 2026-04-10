import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { STORAGE_BUCKET } from "@/lib/constants";
import { requireTeacherOrAdmin } from "@/lib/server/auth";

export const POST = async (request: Request) => {
  const session = await requireTeacherOrAdmin();
  if (session.error || !session.supabase || !session.user) {
    return NextResponse.json({ message: session.error }, { status: session.status });
  }

  const formData = await request.formData();
  const courseId = String(formData.get("courseId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const file = formData.get("file");
  const changeMessage =
    String(formData.get("changeMessage") ?? "Initial upload").trim() || "Initial upload";

  if (!courseId || !title || !(file instanceof File)) {
    return NextResponse.json(
      { message: "courseId, title and file are required." },
      { status: 400 },
    );
  }

  const { data: newFile, error: fileError } = await session.supabase
    .from("course_files")
    .insert({
      course_id: courseId,
      title,
      file_type: file.type || "application/octet-stream",
      current_version: 1,
      created_by: session.user.id,
    })
    .select("id, course_id, title, file_type, current_version, created_by, created_at, updated_at")
    .single();

  if (fileError || !newFile) {
    return NextResponse.json(
      { message: fileError?.message ?? "Failed to create file record." },
      { status: 500 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const storagePath = `${courseId}/${newFile.id}/v1-${randomUUID()}.${ext}`;

  const { error: uploadError } = await session.supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ message: uploadError.message }, { status: 500 });
  }

  const { error: versionError } = await session.supabase.from("file_versions").insert({
    file_id: newFile.id,
    version_number: 1,
    storage_path: storagePath,
    change_message: changeMessage,
    uploaded_by: session.user.id,
  });

  if (versionError) {
    return NextResponse.json({ message: versionError.message }, { status: 500 });
  }

  return NextResponse.json({
    file: {
      id: newFile.id,
      courseId: newFile.course_id,
      title: newFile.title,
      fileType: newFile.file_type,
      currentVersion: newFile.current_version,
      createdBy: newFile.created_by,
      createdAt: newFile.created_at,
      updatedAt: newFile.updated_at,
    },
    version: 1,
  });
};
