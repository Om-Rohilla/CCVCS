import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { STORAGE_BUCKET } from "@/lib/constants";
import { requireTeacherOrAdmin, requireUser } from "@/lib/server/auth";

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
    .from("file_versions")
    .select("id, file_id, version_number, storage_path, change_message, uploaded_by, uploaded_at")
    .eq("file_id", fileId)
    .order("version_number", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const versions = (data ?? []).map((version) => ({
    id: version.id,
    fileId: version.file_id,
    versionNumber: version.version_number,
    storagePath: version.storage_path,
    changeMessage: version.change_message,
    uploadedBy: version.uploaded_by,
    uploadedAt: version.uploaded_at,
  }));

  return NextResponse.json({ versions });
};

export const POST = async (request: Request, context: RouteContext) => {
  const session = await requireTeacherOrAdmin();
  if (session.error || !session.supabase || !session.user) {
    return NextResponse.json({ message: session.error }, { status: session.status });
  }

  const { fileId } = await context.params;
  const formData = await request.formData();
  const file = formData.get("file");
  const changeMessage = String(formData.get("changeMessage") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "file is required." }, { status: 400 });
  }

  const { data: currentFile, error: fileError } = await session.supabase
    .from("course_files")
    .select("id, course_id, current_version")
    .eq("id", fileId)
    .single();

  if (fileError || !currentFile) {
    return NextResponse.json({ message: "File not found." }, { status: 404 });
  }

  const newVersion = (currentFile.current_version ?? 0) + 1;
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const storagePath = `${currentFile.course_id}/${fileId}/v${newVersion}-${randomUUID()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await session.supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ message: uploadError.message }, { status: 500 });
  }

  const { error: insertVersionError } = await session.supabase.from("file_versions").insert({
    file_id: fileId,
    version_number: newVersion,
    storage_path: storagePath,
    change_message: changeMessage || `Updated to v${newVersion}`,
    uploaded_by: session.user.id,
  });

  if (insertVersionError) {
    return NextResponse.json({ message: insertVersionError.message }, { status: 500 });
  }

  const { error: updateFileError } = await session.supabase
    .from("course_files")
    .update({ current_version: newVersion, updated_at: new Date().toISOString() })
    .eq("id", fileId);

  if (updateFileError) {
    return NextResponse.json({ message: updateFileError.message }, { status: 500 });
  }

  return NextResponse.json({ newVersionNumber: newVersion });
};
