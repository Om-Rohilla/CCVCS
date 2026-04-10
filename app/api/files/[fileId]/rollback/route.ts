import { NextResponse } from "next/server";

import { requireTeacherOrAdmin } from "@/lib/server/auth";

type RouteContext = {
  params: Promise<{ fileId: string }>;
};

export const POST = async (request: Request, context: RouteContext) => {
  const session = await requireTeacherOrAdmin();
  if (session.error || !session.supabase || !session.user) {
    return NextResponse.json({ message: session.error }, { status: session.status });
  }

  const { fileId } = await context.params;
  const body = await request.json().catch(() => null);
  const targetVersion = Number(body?.targetVersion);
  const reason = String(body?.reason ?? "").trim();

  if (!Number.isFinite(targetVersion)) {
    return NextResponse.json({ message: "targetVersion is required." }, { status: 400 });
  }

  const [{ data: currentFile, error: fileError }, { data: sourceVersion, error: sourceError }] =
    await Promise.all([
      session.supabase
        .from("course_files")
        .select("id, course_id, current_version")
        .eq("id", fileId)
        .single(),
      session.supabase
        .from("file_versions")
        .select("storage_path")
        .eq("file_id", fileId)
        .eq("version_number", targetVersion)
        .single(),
    ]);

  if (fileError || !currentFile) {
    return NextResponse.json({ message: "File not found." }, { status: 404 });
  }

  if (sourceError || !sourceVersion) {
    return NextResponse.json({ message: "Target version not found." }, { status: 404 });
  }

  const newVersion = (currentFile.current_version ?? 0) + 1;
  const extension = sourceVersion.storage_path.split(".").pop() ?? "bin";
  const newStoragePath = `${currentFile.course_id}/${fileId}/v${newVersion}-rollback.${extension}`;

  const { error: copyError } = await session.supabase.storage
    .from("course-files")
    .copy(sourceVersion.storage_path, newStoragePath);

  if (copyError) {
    return NextResponse.json({ message: copyError.message }, { status: 500 });
  }

  const { error: versionInsertError } = await session.supabase.from("file_versions").insert({
    file_id: fileId,
    version_number: newVersion,
    storage_path: newStoragePath,
    change_message: reason || `Rollback to v${targetVersion}`,
    uploaded_by: session.user.id,
  });

  if (versionInsertError) {
    return NextResponse.json({ message: versionInsertError.message }, { status: 500 });
  }

  const { error: updateError } = await session.supabase
    .from("course_files")
    .update({ current_version: newVersion, updated_at: new Date().toISOString() })
    .eq("id", fileId);

  if (updateError) {
    return NextResponse.json({ message: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ newVersionAfterRollback: newVersion });
};
