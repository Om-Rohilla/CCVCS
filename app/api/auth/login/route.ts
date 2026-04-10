import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const POST = async (request: Request) => {
  const body = await request.json().catch(() => null);
  const email = body?.email?.trim();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return NextResponse.json(
      { message: "Invalid credentials. Please try again." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      role: data.user.app_metadata?.role ?? "student",
    },
  });
};
