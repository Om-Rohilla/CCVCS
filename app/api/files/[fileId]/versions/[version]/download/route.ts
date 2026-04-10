import { NextResponse } from "next/server";

import { STORAGE_BUCKET } from "@/lib/constants";
import { requireUser } from "@/lib/server/auth";

type RouteContext = {
  params: Promise<{ fileId: string; version: string }>;
};

export const GET = async (_request: Request, context: RouteContext) => {
  const session = await requireUser();
  if (session.error || !session.supabase) {
    return NextResponse.json({ message: session.error }, { status: session.status });
  }

  const { fileId, version } = await context.params;
  const versionNumber = Number(version);
  if (!Number.isFinite(versionNumber)) {
    return NextResponse.json({ message: "Invalid version parameter." }, { status: 400 });
  }

  const { data, error } = await session.supabase
    .from("file_versions")
    .select("storage_path")
    .eq("file_id", fileId)
    .eq("version_number", versionNumber)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: "Version not found." }, { status: 404 });
  }

  const { data: signedData, error: signError } = await session.supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(data.storage_path, 60);

  if (signError || !signedData?.signedUrl) {
    return NextResponse.json(
      { message: signError?.message ?? "Failed to create signed download URL." },
      { status: 500 },
    );
  }

  return NextResponse.redirect(signedData.signedUrl);
};
