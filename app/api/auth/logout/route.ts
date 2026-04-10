import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const POST = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true });
};
