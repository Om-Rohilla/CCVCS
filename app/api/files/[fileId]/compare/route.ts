import { NextResponse } from "next/server";

import { requireUser } from "@/lib/server/auth";
import { buildLineDiff } from "@/lib/versioning/diff";

type RouteContext = {
  params: Promise<{ fileId: string }>;
};

const readStorageText = async (
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  storagePath: string,
) => {
  if (!supabase) return { text: "", error: "Unauthorized" };
  const { data, error } = await supabase.storage.from("course-files").download(storagePath);
  if (error || !data) {
    return { text: "", error: error?.message ?? "Failed to read file." };
  }

  const buffer = await data.arrayBuffer();
  const text = new TextDecoder().decode(buffer);
  return { text, error: null };
};

export const GET = async (request: Request, context: RouteContext) => {
  const session = await requireUser();
  if (session.error || !session.supabase) {
    return NextResponse.json({ message: session.error }, { status: session.status });
  }

  const { fileId } = await context.params;
  const { searchParams } = new URL(request.url);
  const v1 = Number(searchParams.get("v1"));
  const v2 = Number(searchParams.get("v2"));

  if (!Number.isFinite(v1) || !Number.isFinite(v2)) {
    return NextResponse.json({ message: "v1 and v2 query parameters are required." }, { status: 400 });
  }

  const { data: versions, error } = await session.supabase
    .from("file_versions")
    .select("version_number, storage_path")
    .eq("file_id", fileId)
    .in("version_number", [v1, v2]);

  if (error || !versions || versions.length < 2) {
    return NextResponse.json({ message: "One or both versions were not found." }, { status: 404 });
  }

  const sourceV1 = versions.find((version) => version.version_number === v1);
  const sourceV2 = versions.find((version) => version.version_number === v2);
  if (!sourceV1 || !sourceV2) {
    return NextResponse.json({ message: "One or both versions were not found." }, { status: 404 });
  }

  const [textV1, textV2] = await Promise.all([
    readStorageText(session.supabase, sourceV1.storage_path),
    readStorageText(session.supabase, sourceV2.storage_path),
  ]);

  if (textV1.error || textV2.error) {
    return NextResponse.json(
      { message: textV1.error ?? textV2.error ?? "Failed to compare versions." },
      { status: 500 },
    );
  }

  const diff = buildLineDiff(textV1.text, textV2.text);

  return NextResponse.json({
    v1,
    v2,
    summary: diff.summary,
    lines: diff.lines,
    truncated: diff.truncated,
  });
};
