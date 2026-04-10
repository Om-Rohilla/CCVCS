import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

import { createClient } from "@/lib/supabase/server";

const ProtectedLayout = async ({ children }: PropsWithChildren) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return children;
};

export default ProtectedLayout;
