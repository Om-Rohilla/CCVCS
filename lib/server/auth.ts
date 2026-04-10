import { createClient } from "@/lib/supabase/server";

export const requireUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", status: 401 as const, supabase: null, user: null };
  }

  return { error: null, status: 200 as const, supabase, user };
};

export const requireTeacherOrAdmin = async () => {
  const session = await requireUser();
  if (session.error || !session.user || !session.supabase) {
    return session;
  }

  const role = (session.user.app_metadata?.role ?? "student") as string;
  if (!["teacher", "admin"].includes(role)) {
    return {
      error: "Forbidden",
      status: 403 as const,
      supabase: null,
      user: null,
    };
  }

  return session;
};
